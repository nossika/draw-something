import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as gameActions from 'actions/game';
import Brush from 'utils/brush';
import { Observable } from 'rxjs/Observable';
import handler from 'utils/handler';

const colors = ['red', 'black', 'green'];

@connect(
    state => ({
        game: state.game,
        user: state.user
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Canvas extends Component {
    render () {
        let { game } = this.props;
        return (
            <section>
                <h1>{ game.status }</h1>
                <canvas
                    ref="canvas" width="300" height="300"
                ></canvas>
                <div>
                    {
                        (() => {
                            let list = [];
                            for (let color of colors) {
                                list.push(
                                    <span key={color} onClick={() => {
                                        this.syncStroke({ type: 'mode', mode: 'brush' });
                                        this.syncStroke({ type: 'color', color });

                                    }}>{ color }</span>
                                )
                            }
                            return list;
                        })()
                    }
                    <span onClick={() => {this.syncStroke({ type: 'mode', mode: 'eraser' });}}>eraser</span>
                </div>
            </section>
        );
    }
    componentDidMount () {
        let { game } = this.props;
        this.brush = new Brush({ canvas: this.refs.canvas });
        this.subscription = Observable
            .fromEvent(this.refs.canvas, 'mousedown')
            .do(e => { // beginPath on mousedown event
                this.syncStroke({
                    x: e.offsetX,
                    y: e.offsetY,
                    type: 'begin'
                });
            })
            .switchMap(firstE => Observable
                .fromEvent(this.refs.canvas, 'mousemove')
                .takeUntil(Observable
                    .fromEvent(document.body, 'mouseup')
                    .do(e => { // closePath on mouseup event
                        this.syncStroke({ type: 'close' });
                    })))
            .do(e => { // draw mousemove event
                this.syncStroke({
                    x: e.offsetX,
                    y: e.offsetY,
                    type: 'move'
                });
            })
            .subscribe();

        let initialStrokes = game.canvasData.strokes;
        this.brush.redraw(initialStrokes);
    }
    componentWillUnmount () {
        this.subscription.unsubscribe();
    }
    componentWillUpdate (props) {
        // let strokes = props.game.canvasData.strokes;
        // let brush = this.brush;
        // brush.redraw(strokes);
    }
    syncStroke (stroke, fromServer) {
        let { pushCanvasStroke, game, user } = this.props;
        if (!fromServer && (game.status !== 'going' || !game.banker || game.banker.id !== user.id)) return;
        pushCanvasStroke(stroke);
        this.brush.draw(stroke);
        !fromServer && handler.emitCanvasStroke(stroke);
    }
}