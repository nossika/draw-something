import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as gameActions from 'actions/game';

@connect(
    state => ({
        countDown: state.game.countDown,
        banker: state.game.banker,
        players: state.game.players
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Game extends Component {
    static propTypes = {
        status: PropTypes.string.isRequired
    };
    render () {
        let { status, countDown, banker, players } = this.props;
        return (
            <section>
                <h1>game</h1>
                <div>status: { status }</div>
                <div>countDown: { countDown }</div>
                <div>banker: { JSON.stringify(banker) }</div>
                <div>players: { Object.keys(players) }</div>
            </section>
        );
    }
}