const ROOMS = global.ROOMS;
const CLIENTS = global.CLIENTS;

const emitInRoom = (ctx, channel, data, cb) => {
    let room = ctx.room;
    if (!room || !ROOMS[room]) return;
    for (let client of ROOMS[room]) {
        if (client === ctx) continue;
        client.io.emit(channel, Object.assign({}, data || {}, {
            name: ctx.info.name || ctx.id,
            date: Date.now()
        }), cb);
    }
};
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
    loginRoom (room, cb) { // 用户加入房间
        if (!room) {
            failCallback(cb, 'invalid room name!');
            return;
        }
        if (!ROOMS[room]) ROOMS[room] = new Set();
        ROOMS[room].add(this);
        handler.leaveRoom.call(this);
        this.room = room;
        emitInRoom(this, 'enterRoom');
        okCallback(cb);
    },
    leaveRoom (cb) { // 用户离开房间
        ROOMS[this.room] && ROOMS[this.room].delete(this);
        emitInRoom(this, 'leaveRoom');
        okCallback(cb);
    },
    setInfo (info) { // 设置用户信息
        Object.assign(this.info, info);
    },
    chatMsg (msg, cb) { // 发送消息
        emitInRoom(this, 'chatMsg', { msg });
        okCallback(cb);
    },
    draw (data, cb) {
        emitInRoom(this, 'draw', data);
        okCallback(cb);
    },
    disconnect () { // 用户离线
        handler.leaveRoom.call(this);
        Reflect.deleteProperty(CLIENTS, this.id);
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
        CLIENTS[client.id] = this;
    }
};