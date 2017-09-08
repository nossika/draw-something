const ROOMS = global.ROOMS;
const Room = require('./Room');
const Game = require('./Game');

const handler = {
    enterRoom (roomName, cb) { // people enter
        if (!roomName) {
            this.emitErrorMsg({ cb, content: 'invalid room name!' });
            return;
        }

        if (this.room) this.room.peopleLeave(this);

        if (!ROOMS.has(roomName)) {
            let room = new Room({ name: roomName });
            room.on('roomEmpty', room => {
                ROOMS.delete(room.name);
            });
            ROOMS.set(roomName, room);
        }

        this.room = ROOMS.get(roomName);
        this.room.peopleEnter(this);
        this.emitSuccessMsg({ cb });
    },
    leaveRoom (data, cb) { // people leave
        if (!this.room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room!' });
            return;
        }
        this.room.peopleLeave(this);
        this.room = null;
        this.emitSuccessMsg({ cb });
    },
    setUserInfo (info, cb) { // set user info
        Object.assign(this.info, info);
        this.emitSuccessMsg({ cb });
    },
    sendRoomMessage (content, cb) { // send message in room
        if (!this.room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room!' });
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
            this.emitErrorMsg({ cb, content: 'you\'re not in a room!' });
            return;
        }
        if (room.owner !== this) {
            this.emitErrorMsg({ cb, content: 'you\'re not the room owner!' });
            return;
        }
        if (room.game) {
            this.emitErrorMsg({ cb, content: 'game already start!' });
            return;
        }
        // game
        room.game = new Game({
            clients: room.clients,
        });
        room.game.gameStart();

        room.game.on('gameEnd', () => {
            room.game = null;
        });

        this.emitSuccessMsg({ cb });
    },
    canvasStroke (data, cb) {
        if (!this.room) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a room!' });
            return;
        }
        if (!this.room.game) {
            this.emitErrorMsg({ cb, content: 'you\'re not in a game!' });
            return;
        }
        if (this.room.game.banker !== this) {
            this.emitErrorMsg({ cb, content: 'you\'re not game banker!' });
            return;
        }
        this.room.broadcast({
            channel: 'canvasStroke',
            data,
            sender: this
        });
        this.emitSuccessMsg({ cb });
    },
    disconnect () { // user disconnect
        this.room && this.room.peopleLeave(this);
    },
};


module.exports = class Client {
    constructor ({
        client
    }) {
        this.id = client.id;
        this.io = client;
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