const ROOMS = global.ROOMS;

const okCallback = (cb) => {
    typeof cb === 'function' && cb({
        ok: 1,
        time: Date.now()
    });
};
const failCallback = (cb, msg) => {
    typeof cb === 'function' && cb({
        ok: 0,
        msg,
        time: Date.now()
    });
};
const handler = {
    enterRoom (room, cb) { // 用户加入房间
        if (!room) {
            failCallback(cb, 'invalid room name!');
            return;
        }
        if (!ROOMS[room]) ROOMS[room] = new Set();
        ROOMS[room].add(this);
        handler.leaveRoom.call(this);
        this.room = room;
        this.emitInRoom('enterRoom');
        okCallback(cb);
    },
    leaveRoom (cb) { // 用户离开房间
        let roomSet = ROOMS[this.room];
        if (roomSet) {
            roomSet.delete(this);
            if (!roomSet.size) Reflect.deleteProperty(ROOMS, this.room);
        }
        this.emitInRoom('leaveRoom');
        okCallback(cb);
    },
    setInfo (info) { // 设置用户信息
        Object.assign(this.info, info);
    },
    chatMsg (msg, cb) { // 发送消息
        this.emitInRoom('chatMsg', { msg });
        okCallback(cb);
    },
    draw (data, cb) {
        this.emitInRoom('draw', data);
        okCallback(cb);
    },
    disconnect () { // 用户离线
        handler.leaveRoom.call(this);
    },
};
module.exports = class {
    constructor (client) {
        for (let event in handler) {
            client.on(event, handler[event].bind(this));
        }

        this.io = client;
        this.id = client.id;
        this.info = {};
        this.room = undefined;

    }
    emitInRoom (channel, data, cb) {
        let room = this.room;
        if (!room || !ROOMS[room]) return;
        for (let client of ROOMS[room]) {
            if (client === this) continue;
            client.io.emit(channel, Object.assign({}, data || {}, {
                user: this.info.name || this.id,
                date: Date.now()
            }), cb);
        }
    }
};