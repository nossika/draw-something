import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as gameActions from 'actions/game';

@connect(
    state => ({
        game: state.game,
        canvasData: state.canvasData
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Canvas extends Component {
    render () {
        let { game } = this.props;
        return (
            <section>
                <h1>{ game.status }</h1>
                <canvas ref="canvas" width="300" height="300"></canvas>
            </section>
        );
    }
    componentDidMount () {
        
    }
    componentWillUpdate (prev, next) {
        console.log(prev, next, this);
    }
}