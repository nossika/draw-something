import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Brush from 'utils/brush';
import Rx from 'rxjs/Rx';
import wsAction from 'utils/wsAction';
import { canvasStroke$, canvasReset$ } from 'flow/canvas';
import * as gameActions from 'actions/game';
import { getPersonName } from 'utils/main';

const renderRankings = (players) => {
    let list = [];
    for (let playerId in players) {
        let player = players[playerId];
        list.push(player);
    }
    list.sort((a, b) => a.score > b.score ? -1 : 1);
    list = list.map((player, index) => (
        <div key={player.id} className={player.online ? 'on' : 'off'}>
            {index + 1}: { getPersonName(player) } - { player.score }
        </div>
    ));
    return (
        <div>
            { list }
        </div>
    )
};
const strokeColors = ['red', 'black', 'green'];

@connect(
    state => ({
        game: state.game,
        user: state.user,
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Game extends Component {
    render () {
        let { game } = this.props;
        let { word, countDown, banker, players, status } = game;
        return (
            <section>
                <section>
                    <h1>game</h1>
                    <h1>{ status }</h1>
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-focus"></use>
                        </svg>
                        { word }
                    </div>
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-countdown"></use>
                        </svg>
                        <span>{ countDown }</span>
                    </div>
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-write"></use>
                        </svg>
                        { getPersonName(banker) }
                    </div>
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-rank"></use>
                        </svg>
                        { renderRankings(players) }
                    </div>
                </section>
                <section>

                    <canvas
                        className="canvas"
                        ref="canvas" width="300" height="300"
                    ></canvas>
                    <div>
                        {
                            strokeColors.map(color => {
                                return (<span key={color} onClick={() => {
                                    this.syncStroke({ type: 'mode', mode: 'brush' });
                                    this.syncStroke({ type: 'color', color });

                                }}>{ color }</span>)
                            })
                        }
                        <span onClick={() => {this.syncStroke({ type: 'mode', mode: 'eraser' });}}>eraser</span>
                    </div>
                </section>
            </section>
        );
    }
    resizeCanvas = function () {
        console.log('resize', this);
        // todo redraw
        // let { setCanvasData } = this.props;
        // setCanvasData({
        //     size: [this.refs.canvas.width, this.refs.canvas.height],
        //     strokes: []
        // });
        // this.brush.redraw();
    }.bind(this);
    componentWillMount () {
        let { setGameStatus, setGameCountDown, setGameBanker, setGamePlayers, setGameWord, setCanvasData } = this.props;
        setGameStatus('await');
        setGameCountDown(0);
        setGameBanker(null);
        setGamePlayers({});
        setGameWord('');
        setCanvasData({ strokes: [] });

    }
    componentDidMount () {
        window.addEventListener('resize', this.resizeCanvas);
        this.brush = new Brush({ canvas: this.refs.canvas });
        this.canvasStroke$$ = canvasStroke$.subscribe(stroke => this.syncStroke(stroke, true));
        this.canvasReset$$ = canvasReset$.subscribe(() => this.resetCanvas());
        this.mouseEvent$$ = Rx.Observable
            .fromEvent(this.refs.canvas, 'mousedown')
            .do(e => { // beginPath on mousedown event
                this.syncStroke({
                    x: e.offsetX,
                    y: e.offsetY,
                    type: 'begin',
                });
            })
            .switchMap(firstE => Rx.Observable
                .fromEvent(this.refs.canvas, 'mousemove')
                .takeUntil(Rx.Observable
                    .fromEvent(document.body, 'mouseup')
                    .do(e => { // closePath on mouseup event
                        this.syncStroke({ type: 'close' });
                    })))
            .do(e => { // draw mousemove event
                this.syncStroke({
                    x: e.offsetX,
                    y: e.offsetY,
                    type: 'move',
                });
            })
            .subscribe();

        // todo: redraw after state changed
        setTimeout(() => {
            this.brush.redraw(this.props.game.canvasData.strokes);
        });
    }
    componentWillUnmount () {
        this.mouseEvent$$.unsubscribe();
        this.canvasReset$$.unsubscribe();
        this.canvasStroke$$.unsubscribe();
        window.removeEventListener('resize', this.resizeCanvas);
    }
    syncStroke (stroke, fromServer) {
        let { game, user, pushCanvasStroke } = this.props;

        // if game is not going or you are not the banker, stroke event would be ignored
        if (!fromServer && (game.status !== 'going' || !game.banker || game.banker.id !== user.id)) return;
        pushCanvasStroke(stroke);
        this.brush.draw(stroke);
        !fromServer && wsAction.emitCanvasStroke(stroke);
    }
    resetCanvas () {
        let { setCanvasData } = this.props;
        setCanvasData({
            size: [this.refs.canvas.width, this.refs.canvas.height],
            strokes: []
        });
        this.brush.redraw();
    }
}