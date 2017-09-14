const util = require('../utils');
const Rx = require('rxjs/Rx');
const CLIENTS_EMITTER = global.CLIENTS_EMITTER;
function pickWord (wordList) {
    return wordList.splice(Math.random() * wordList.length | 0, 1)[0]
}

module.exports = class Game {
    constructor ({
            roundTime = 10,
            pendingTime = 5,
            clients,
            wordMatchScore = [5, 3, 1],
            bankerScore = 3,
            wordList,
        }) {

        this._clients = clients;
        this._clientsGenerator = this._clients.values();

        this.rounds = 2;
        this.currentRound = 0;

        this.banker = this._clientsGenerator.next().value;

        this.playersMap = new Map(Array.from(clients).map(client => {
            let clientInfo = util.clientInfo(client);
            clientInfo.score = 0;
            return [client.id, clientInfo];
        }));

        this.status = 'await';
        this.pendingTime = pendingTime;
        this.roundTime = roundTime;

        this.word = '';
        this.wordList = wordList.slice();
        this.wordMatched = [];
        this.wordMatchScore = wordMatchScore;

        this._roundTimer = 0;
        this.roundCountDown = 0;
        this._handler = {};
    }
    broadcast ({ channel, data }) {
        for (let clientId of this.playersMap.keys()) {
            console.log(CLIENTS_EMITTER[clientId])
            CLIENTS_EMITTER[clientId].emit(channel, data);
        }
    }
    peopleLeave (client) {
        this._clients.delete(client);
        this.playersMap.delete(client.id);
        this.broadcast({ channel: 'setGamePlayers', data: util.map2Obj(this.playersMap) });
    }
    gameStart () {
        this.broadcast({ channel: 'setGamePlayers', data: util.map2Obj(this.playersMap) });
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

            this.playersMap.set(client.id, this.playersMap[client.id] + score);
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
        this._roundTime$$ && this._roundTime$$.unsubscribe();

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
        this.wordMatched = [];

        this.roundCountDown = this.roundTime;
        this._roundTime$$ = Rx.Observable
            .interval(1000)
            .scan((acc) => acc - 1, this.roundTime)
            .do((countDown) => {
                this.roundCountDown = countDown;
                this.broadcast({
                    channel: 'setGameCountDown',
                    data: countDown
                });
                if (countDown <= 0) {
                    this.roundEnd();
                }
            })
            .subscribe();
    }
    roundEnd () {
        this._roundTime$$ && this._roundTime$$.unsubscribe();

        this.status = 'pending';
        this.broadcast({
            channel: 'setGameStatus',
            data: this.status
        });
        this.broadcast({
            channel: 'roundWord',
            data: this.word
        });

        let item = this._clientsGenerator.next();

        if (!item.value) {
            this.currentRound++;
            this._clientsGenerator = this._clients.values();
            item = this._clientsGenerator.next();
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

        this.roundCountDown = this.pendingTime;
        this._roundTime$$ = Rx.Observable
            .interval(1000)
            .scan((acc) => acc - 1, this.pendingTime)
            .do((countDown) => {
                this.roundCountDown = countDown;
                this.broadcast({
                    channel: 'setGameCountDown',
                    data: countDown
                });
                if (countDown <= 0) {
                    this.roundStart();
                }
            })
            .subscribe();
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