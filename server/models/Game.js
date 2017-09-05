const util = require('../utils');

let words = ['asd', 'zzz', 'asd', 'zzzz'];

module.exports = class Game {
    constructor ({
            roundTime = 5,
            pendingTime = 3,
            clients,
        }) {

        this._clients = clients;
        this._clients_gen = this._clients.values();

        this.rounds = 2;
        this.currentRound = 0;

        this.banker = this._clients_gen.next().value;
        this.players = (() => {
            let players = {};
            for (let client of clients.values()) {
                let clientInfo = util.clientInfo(client);
                clientInfo.score = 0;
                players[clientInfo.id] = clientInfo;
            }
            return players;
        })();

        this.status = 'await';
        this.pendingTime = pendingTime;
        this.roundTime = roundTime;

        this.word = '';

        this._roundTimer = 0;
        this._roundCountDown = 0;
        this._handler = {};
    }
    broadcast ({
        channel,
        data
    }) {
        for (let client of this._clients.values()) {
            client.io.emit(channel, data);
        }
    }
    peopleLeave (client) {
        this._clients.delete(client);
        Reflect.deleteProperty(this.players, client.id);
        this.broadcast({
            channel: 'setGamePlayers',
            data: this.players
        });
    }
    gameStart () {
        this.broadcast({
            channel: 'setGamePlayers',
            data: this.players
        });

        this.roundStart();
    }
    matchWord (word, client) {
        if (this.word && word === this.word) {
            console.log('matched!');

            this.roundEnd();
        }
    }
    roundStart () {
        this.status = 'going';
        this.broadcast({
            channel: 'setGameStatus',
            data: this.status
        });
        this.broadcast({
            channel: 'setGameBanker',
            data: util.clientInfo(this.banker)
        });
        this._roundCountDown = this.roundTime;
        clearInterval(this._roundTimer);
        this._roundTimer = setInterval(() => {
            this._roundCountDown--;
            this.broadcast({
                channel: 'setGameCountDown',
                data: this._roundCountDown
            });
            if (this._roundCountDown <= 0) {
                clearInterval(this._roundTimer);
                this.roundEnd();
            }
        }, 1000);
    }
    roundEnd () {
        this.status = 'pending';
        this.broadcast({
            channel: 'setGameStatus',
            data: this.status
        });
        clearInterval(this._roundTimer);

        let item = this._clients_gen.next();

        if (!item.value) {
            this.currentRound++;
            this._clients_gen = this._clients.values();
            item = this._clients_gen.next();
        }
        if (this.currentRound >= this.rounds) {
            this._emit('gameEnd');
            this.status = 'await';
            this.broadcast({
                channel: 'setGameStatus',
                data: this.status
            });
            return;
        }
        this.banker = item.value;

        setTimeout(() => {
            this.roundStart();
        }, this.pendingTime * 1000);

    }
    on (event, callback) {
        if (typeof callback !== 'function') {
            throw('callback must be a function');
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