module.exports = class Game {
    constructor ({
            rounds,
            roundTime = 60,
        }) {
        this.rounds = rounds;
        this.currentRound = 0;
        this.status = 'pending';
        this.roundTime = roundTime;
        this._timer = 0;
        this._countDown = 0;
        this._handler = {};
    }
    getStatus () {
        return {
            currentRound: this.currentRound,
            status: this.status,
            countDown: this._countDown,
        }
    }
    roundStart () {
        this._emit('roundStart');
        this.status = 'going';
        this._countDown = this.roundTime;
        clearInterval(this._timer);
        this._timer = setInterval(() => {
            this._countDown--;
            if (this._countDown <= 0) {
                this.roundEnd();
            }
        }, 1000);
    }
    roundEnd () {
        this._emit('roundEnd');
        this.status = 'pending';
        clearInterval(this._timer);
        this.currentRound++;
        if (this.currentRound >= this.rounds) {
            this._emit('gameEnd');
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