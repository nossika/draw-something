const ROOMS_MAP = global.ROOMS_MAP;
const CLIENTS_MAP = global.CLIENTS_MAP;
const CLIENTS_EMITTER = global.CLIENTS_EMITTER;
const Room = require('./Room');
const Game = require('./Game');
const wordLib = require('../resource/word-lib');

const handler = {
    enterRoom (roomName, cb) { // people enter
        if (!roomName) {
            this.emitErrorMsg({ cb, content: 'invalid room name! (enterRoom)' });
            return;
        }

        if (this.room) this.room.peopleLeave(this);

        if (!ROOMS_MAP.has(roomName)) {
            Room.create(roomName);
        }

        this.room = ROOMS_MAP.get(roomName);
        clearTimeout(this.room._timer);
        this.room.peopleEnter(this);
        this.emitSuccessMsg({ cb });
    },
    leaveRoom (data, cb) { // people leave
        if (!this.room) {
            return;
        }
        this.room.peopleLeave(this);
        this.room = null;
        this.emitSuccessMsg({ cb });
    },
    setClientId (id, cb) {
        let [prevId, curId] = [this.id, id];
        CLIENTS_MAP.delete(prevId);
        this.io.id = curId;
        let conflictClient = CLIENTS_MAP.get(curId);
        if (conflictClient) {
            conflictClient.room && conflictClient.room.peopleLeave(this);
            conflictClient.io.emit('logout', id);
        }
        CLIENTS_MAP.set(curId, this);
        if (this.room) {
            this.room.clientIdList.delete(prevId);
            this.room.clientIdList.add(curId);
            this.room.updateRoomInfo();
            if (this.room.game) {
                this.room.game.peopleConnect(this);
            }
        }
    },
    setClientInfo (info, cb) { // set client info
        let old = Object.assign({}, this.info);
        Object.assign(this.info, info);
        this.room && this.room.broadcast({
            channel: 'clientInfoChange',
            data: {
                old,
                info,
                id: this.id,
            },
        });
        this.emitSuccessMsg({ cb });
    },
    sendRoomMessage (content, cb) { // send message in room
        if (!this.room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room! (sendRoomMessage)' });
            return;
        }
        this.room.broadcast({
            channel: 'roomMessage',
            data: { content },
            sender: this
        });

        let game = this.room.game;
        if (game) {
            game.matchWord(content, this);
        }

        this.emitSuccessMsg({ cb });
    },
    startGame (data, cb) { // game start
        let room = this.room;
        if (!room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room! (startGame)' });
            return;
        }
        if (room.owner !== this) {
            this.emitErrorMsg({ cb, content: 'you\'re not the room owner! (startGame)' });
            return;
        }
        if (room.game) {
            this.emitErrorMsg({ cb, content: 'game already start! (startGame)' });
            return;
        }
        // game

        room.game = new Game({
            playerIdList: room.clientIdList,
            wordList: wordLib.idiom
        });

        room.game.on('broadcast', ({ channel, data, exclude }) => {
            // room.broadcast({ channel, data, exclude });
            exclude = exclude
                ? (Array.isArray(exclude)
                    ? exclude
                    : [exclude])
                : [];
            for (let clientId of room.clientIdList) {
                if (exclude.includes(clientId)) continue;
                CLIENTS_EMITTER[clientId](channel, data);
            }
        });

        room.game.gameStart();



        room.game.on('gameEnd', () => {
            room.game = null;
        });

        this.emitSuccessMsg({ cb });
    },
    canvasStroke (data, cb) {
        if (this.room && this.room.game) {
            this.room.game.canvasStroke(this, data);
        }
        this.emitSuccessMsg({ cb });
    },
    disconnect () { // user disconnect
        this.room && this.room.peopleLeave(this);
        // ensure this is the target client
        if (CLIENTS_MAP.get(this.id) === this) {
            CLIENTS_MAP.delete(this.id);
        }
    },
};


module.exports = class Client {
    constructor ({
        io
    }) {
        this.io = io;
        Object.defineProperties(this, {
            id: {
                enumerable: true,
                get () {
                    return this.io.id;
                }
            },
        });
        this.info = {};
        this.room = null;
        for (let event in handler) {
            io.on(event, handler[event].bind(this));
        }
    }
    emitSuccessMsg ({ content, cb }) {
        typeof cb === 'function' && cb({
            ok: 1,
            content,
            timestamp: Date.now()
        });
    }
    emitErrorMsg ({ content, cb }) {
        let msg = {
            ok: 0,
            content,
            timestamp: Date.now()
        };
        this.io.emit('errorMsg', msg);
        typeof cb === 'function' && cb(msg);
    }
    broadcastInRoom ({
        channel,
        message,
        callback,
    }) {
        this.room && this.room.broadcast({
            channel,
            message,
            callback,
            sender: this,
            exclude: this
        })
    }
};