const util = require('../utils');
const Client = require('./Client.js');
const CLIENTS_MAP = global.CLIENTS_MAP;

module.exports = class Room {
    constructor ({
        name,
    }) {
        this.clientIdList = new Set(); // <Client>
        this.owner = null;
        this.name = name;
        this.game = null;
        this._handler = {};
    }
    peopleEnter (client) {
        // if (client.constructor !== Client) return; // validate client
        if (!CLIENTS_MAP.has(client.id)) return;
        client.io.emit('roomInfo', util.getRoomInfo(this.name));

        this.clientIdList.add(client.id);
        this.broadcast({
            channel: 'peopleEnterRoom',
            sender: client,
            exclude: [],
        });

        if (this.clientIdList.size === 1) {
            this.setOwner(client);
        }

        if (this.game && this.game.playersMap.has(client.id)) {
            this.game.playerReconnect(client);
        }
    }
    peopleLeave (client, mute) {
        this.clientIdList.delete(client.id);

        if (this.clientIdList.size === 0) {
            this._emit('roomEmpty', this);
        } else if (client === this.owner) {
            for (let firstClientId of this.clientIdList) {
                this.setOwner(CLIENTS_MAP.get(firstClientId));
                break;
            }
        }
        if (this.game && this.game.playersMap.has(client.id)) {
            this.game.playerLeave(client);
        }

        !mute && this.broadcast({
            channel: 'peopleLeaveRoom',
            sender: client
        });
    }
    updateRoomInfo () {
        for (let clientId of this.clientIdList) {
            let client = CLIENTS_MAP.get(clientId);
            client && client.io.emit('roomInfo', util.getRoomInfo(this.name));
        }
    }
    setOwner (client) {
        this.owner = client;
        this.broadcast({
            channel: 'roomOwnerChanged',
            data: {
                owner: util.clientData(client)
            }
        });
    }
    broadcast ({ channel, data, sender, exclude, callback }) {
        exclude = exclude
            ? (Array.isArray(exclude)
                ? exclude
                : [exclude])
            : (sender
                ? [sender]
                : []);
        for (let clientId of this.clientIdList) {
            let client = CLIENTS_MAP.get(clientId);
            if (!client || exclude.includes(client)) continue;
            client.io.emit(channel, Object.assign(
                {},
                sender ? { sender: util.clientData(sender) } : {},
                { timestamp: Date.now() },
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