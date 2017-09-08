const util = require('../utils');

function pickWord (wordList) {
    return wordList.splice(Math.random() * wordList.length | 0, 1)[0]
}

module.exports = class Game {
    constructor ({
            roundTime = 50,
            pendingTime = 3,
            clients,
            wordMatchScore = [5, 3, 1],
            bankerScore = 3,
            wordList = ['asd', 'zzz', 'asd', 'zzzz', 'zxc', 'ccccc', 'c22'],
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
        this.wordList = wordList;
        this.wordMatched = [];
        this.wordMatchScore = wordMatchScore;

        this._roundTimer = 0;
        this.roundCountDown = 0;
        this._handler = {};
    }
    broadcast ({ channel, data }) {
        for (let client of this._clients.values()) {
            client.io.emit(channel, data);
        }
    }
    peopleLeave (client) {
        this._clients.delete(client);
        Reflect.deleteProperty(this.players, client.id);
        this.broadcast({ channel: 'setGamePlayers', data: this.players });
    }
    gameStart () {
        this.broadcast({ channel: 'setGamePlayers', data: this.players });
        this.roundStart();
    }
    matchWord (word, client) {
        if (this.status !== 'going') return;
        if (this.word && word === this.word) {
            let playerId = client.id;
            let score = this.wordMatchScore[this.wordMatched.length];

            // block banker
            if (client === this.banker) return;

            // block duplicate player
            if (this.wordMatched.includes(playerId)) return;

            this.players[client.id].score += score;
            this.broadcast({
                channel: 'updateGamePlayerScore',
                data: { playerId: client.id, score }
            });
            this.wordMatched.push(playerId);

            // if all player matched or scores run out
            if (this.wordMatched.length >= this.wordMatchScore.length || this.wordMatched.length >= this._clients.size) {
                this.roundEnd();
            }
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
        this.word = pickWord(this.wordList);
        this.banker && this.banker.io.emit('roundWord', this.word);
        this.roundCountDown = this.roundTime;
        this.wordMatched = [];
        clearInterval(this._roundTimer);
        this._roundTimer = setInterval(() => {
            this.roundCountDown--;
            this.broadcast({
                channel: 'setGameCountDown',
                data: this.roundCountDown
            });
            if (this.roundCountDown <= 0) {
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
        this.broadcast({
            channel: 'roundWord',
            data: this.word
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