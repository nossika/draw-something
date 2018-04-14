import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Brush from 'utils/brush';
import Rx from 'rxjs/Rx';
import wsAction from 'utils/wsAction';
import { canvasStroke$, canvasReset$ } from 'flow/canvas';
import * as gameActions from 'actions/game';
import { getPersonName } from 'utils/main';
import { strokeColors } from 'config';

const renderRankings = (players) => {
    let list = [];
    for (let playerId in players) {
        let player = players[playerId];
        list.push(player);
    }
    list.sort((a, b) => a.score > b.score ? -1 : 1);
    list = list.map((player, index) => (
        <div key={player.id} className="table-row">
            <span className="rank">
                { index + 1 }
            </span>
            <span title={getPersonName(player)} className={"name" + (player.online ? ' on' : ' off')}>
                { getPersonName(player) }
            </span>
            <span className="score">
                { player.score }
            </span>
        </div>
    ));
    return list;
};

@connect(
    state => ({
        game: state.game,
        user: state.user,
        currentRoom: state.room.currentRoom,
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Game extends Component {
    state = {
        color: '#000',
    };
    render () {
        let { game, user, currentRoom } = this.props;
        let { word, countDown, banker, players, status } = game;
        let { owner } = currentRoom;
        let isRoomOwner = owner && user.id === owner.id;
        let isBanker = banker && banker.id === owner.id;
        return (
            <section className="game-wrapper">
                <section className="game-info">
                    <div className="tip">{ {pending: '等待下个回合', going: '进行中', await: '等待房主开始游戏'}[status] }</div>


                    {
                        status === 'await'
                        ? null
                        : [
                            <div key='word' className="row">
                                <span className="key">目标词语</span>
                                <span className="value key-word">{ word || '?' }</span>
                            </div>,
                            <div key="time" className="row">
                                <span className="key">{{'pending': '下个回合', 'going': '剩余时间'}[status]}</span>

                                <span className="value">{ countDown || '' }</span>
                            </div>,
                            <div key="host" className="row">
                                <span className="key">庄家</span>
                                <span className="value">{ getPersonName(banker) }</span>
                            </div>
                          ]
                    }

                    {
                        status === 'await' && isRoomOwner ?
                            <div className="starter">
                                <span className="btn btn-default btn-md" onClick={ wsAction.startGame }>开始游戏</span>
                            </div>
                            : null
                    }
                    <div className="rank-wrapper">
                        <div key={''} className="table-row">
                            <span className="rank">
                                排名
                            </span>
                            <span className="name">
                                玩家
                            </span>
                            <span className="score">
                                积分
                            </span>
                        </div>
                        { renderRankings(players) }
                    </div>
                </section>
                <section className="game-panel">
                    <canvas
                        className="canvas"
                        ref="canvas" width="600" height="400"
                        style={{cursor: (status !== 'going' || !banker || banker.id !== user.id) ? 'default' : 'crosshair'}}
                    ></canvas>
                    <div className="controls" ref="controls">
                        {
                            strokeColors.map(color => {
                                return (
                                    <div
                                        key={color}
                                        style={{background: color}}
                                        className={`color-brush ${this.state.color === color ? 'active' : ''}`}
                                        onClick={() => {
                                            this.syncStroke({ type: 'mode', mode: 'brush' });
                                            this.syncStroke({ type: 'color', color });
                                        }}
                                    >
                                    </div>
                                )
                            })
                        }
                        {/*<div className={`color-brush eraser ${this.state.color === '_eraser' ? 'active' : ''}`}*/}
                             {/*title="橡皮"*/}
                             {/*onClick={() => {this.syncStroke({ type: 'mode', mode: 'eraser' });}}>*/}
                        {/*</div>*/}
                        <div className={`color-brush eraser`}
                             title="撤销"
                             onClick={() => {this.syncStroke({ type: 'revoke' });}}>
                        </div>
                    </div>
                </section>
            </section>
        );
    }
    redrawCanvas = function () {
        const canvas = this.refs.canvas;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        this.brush.redraw(this.props.game.canvasData.strokes);
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
        window.addEventListener('resize', this.redrawCanvas);
        this.brush = new Brush({ canvas: this.refs.canvas });
        this.canvasStroke$$ = canvasStroke$.subscribe(stroke => this.syncStroke(stroke, true));
        this.canvasReset$$ = canvasReset$.subscribe(() => this.resetCanvas());
        this.mouseEvent$$ = Rx.Observable
            .fromEvent(this.refs.canvas, 'mousedown')
            .do(e => { // beginPath on mousedown event
                this.syncStroke({
                    x: e.offsetX / this.refs.canvas.offsetWidth,
                    y: e.offsetY / this.refs.canvas.offsetHeight,
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
                    x: e.offsetX / this.refs.canvas.offsetWidth,
                    y: e.offsetY / this.refs.canvas.offsetHeight,
                    type: 'move',
                });
            })
            .subscribe();

        // todo: redraw after state changed
        setTimeout(() => {
            this.redrawCanvas();
        });
    }
    componentWillUnmount () {
        this.mouseEvent$$.unsubscribe();
        this.canvasReset$$.unsubscribe();
        this.canvasStroke$$.unsubscribe();
        window.removeEventListener('resize', this.redrawCanvas);
    }
    syncStroke (stroke, fromServer) {
        let { game, user, pushCanvasStroke } = this.props;

        // if game is not going or you are not the banker, stroke event would be ignored
        if (!fromServer && (game.status !== 'going' || !game.banker || game.banker.id !== user.id)) return;
        if (stroke.type === 'color') {
            this.setState({
                color: stroke.color,
            });
        } else if (stroke.type === 'mode' && stroke.mode === 'eraser') {
            this.setState({
                color: '_eraser',
            });
        }

        pushCanvasStroke(stroke);
        this.brush.exec(stroke);
        !fromServer && wsAction.emitCanvasStroke(stroke);
    }
    resetCanvas () {
        let { setCanvasData } = this.props;
        setCanvasData({
            size: [this.refs.canvas.width, this.refs.canvas.height],
            strokes: []
        });
        this.setState({
            color: '#000'
        });
        this.brush.redraw();
    }
}