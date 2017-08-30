
let words = ['asd', 'zzz', 'asd', 'zzzz'];


module.exports = class Game {
    constructor ({
            roundTime = 60,
            players,
        }) {
        this.players = players;
        this.rounds = players.size * 2;
        this.currentRound = 0;
        this.status = 'pending';
        this.roundTime = roundTime;
        this._roundTimer = 0;
        this._roundCountDown = 0;
        this._handler = {};
    }
    getStatus () {
        return {
            currentRound: this.currentRound,
            status: this.status,
            countDown: this._roundCountDown,
            players: this.players
        }
    }
    gameStart () {
        this.roundStart();
    }
    roundStart () {
        this.status = 'going';
        this._roundCountDown = this.roundTime;
        clearInterval(this._roundTimer);
        this._roundTimer = setInterval(() => {
            this._roundCountDown--;
            if (this._roundCountDown <= 0) {
                this.roundEnd();
            }
        }, 1000);
    }
    roundEnd () {
        this.status = 'pending';
        clearInterval(this._roundTimer);
        this.currentRound++;
        if (this.currentRound >= this.rounds) {
            this._emit('gameEnd');
        } else {
            setTimeout(() => {
                this.roundStart();
            }, 10 * 1000);
        }
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