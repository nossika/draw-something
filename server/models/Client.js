const ROOMS_MAP = global.ROOMS_MAP;
const CLIENTS_MAP = global.CLIENTS_MAP;
const Room = require('./Room');
const Game = require('./Game');
const words = require('../resource/words');

const handler = {
    enterRoom (roomName, cb) { // people enter
        if (!roomName) {
            this.emitErrorMsg({ cb, content: 'invalid room name! (enterRoom)' });
            return;
        }

        if (this.room) this.room.peopleLeave(this);

        if (!ROOMS_MAP.has(roomName)) {
            let room = new Room({ name: roomName });
            room.on('roomEmpty', room => {
                ROOMS_MAP.delete(room.name);
            });
            ROOMS_MAP.set(roomName, room);
        }

        this.room = ROOMS_MAP.get(roomName);
        this.room.peopleEnter(this);
        this.emitSuccessMsg({ cb });
    },
    leaveRoom (data, cb) { // people leave
        if (!this.room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room! (leaveRoom)' });
            return;
        }
        this.room.peopleLeave(this);
        this.room = null;
        this.emitSuccessMsg({ cb });
    },
    setClient (info, cb) {
        CLIENTS_MAP.delete(this.id);
        this.io.id = info.id;
        CLIENTS_MAP.set(this.id, this);
        if (this.room) {
            this.room.updateRoomInfo();
            if (this.room.game && this.room.game.playersMap.has(this.id)) {
                this.room.game.playerReconnect(this);
            }
        }
    },
    setUserInfo (info, cb) { // set user info
        Object.assign(this.info, info);
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
            clients: room.clients,
            wordList: words.idiom
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
        CLIENTS_MAP.delete(this.id);
    },
};


module.exports = class Client {
    constructor ({
        client
    }) {
        this.io = client;
        Object.defineProperty(this, 'id', {
            enumerable: true,
            get () {
                return this.io.id;
            }
        });
        this.info = {};
        this.room = null;
        for (let event in handler) {
            client.on(event, handler[event].bind(this));
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