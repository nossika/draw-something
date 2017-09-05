const util = require('../utils');
const Client = require('./Client.js');

module.exports = class Room {
    constructor ({
        name,
    }) {
        this.clients = new Set(); // <Client>
        this.owner = null;
        this.name = name;
        this.game = null;
        this._handler = {};
    }
    peopleEnter (client) {
        // if (client.constructor !== Client) return; // validate client
        console.log(client, this, 'peopleEnter');
        this.clients.add(client);
        this.broadcast({
            channel: 'peopleEnterRoom',
            sender: client
        });
        client.io.emit('roomInfo', util.getRoomInfo(this.name));

        if (this.clients.size === 1) {
            this.setOwner(client);
        }
    }
    peopleLeave (client) {
        this.clients.delete(client);

        if (this.clients.size === 0) {
            this._emit('roomEmpty', this);
        } else if (client === this.owner) {
            for (let firstClient of this.clients.values()) {
                this.setOwner(firstClient);
                break;
            }
        }
        if (this.game) {
            this.game.peopleLeave(client);
        }

        this.broadcast({
            channel: 'peopleLeaveRoom',
            sender: client
        });
    }
    setOwner (client) {
        this.owner = client;
        this.broadcast({
            channel: 'roomOwnerChanged',
            data: {
                owner: util.clientInfo(client)
            }
        });
    }
    broadcast ({
        channel,
        data,
        sender,
        exclude,
        callback,
    }) {
        exclude = exclude
            ? (Array.isArray(exclude)
                ? exclude
                : [exclude])
            : (sender
                ? [sender]
                : []);
        for (let client of this.clients) {
            if (exclude.includes(client)) continue;
            client.io.emit(channel, Object.assign(
                {},
                sender ? util.clientInfo(sender) : {},
                { date: Date.now() },
                data || {},
            ), callback);
        }
    }
    on (event, callback) {
        if (typeof callback !== 'function') {
            throw('callback must be an function');
        }
        if (!this._handler[event]) this._handler[event] = [];
        this._handler[event].push(callback);
    }
    _emit (event, params) {
        if (this._handler[event]) {
            this._handler[event].forEach(fn => fn(params));
        }
    }
};