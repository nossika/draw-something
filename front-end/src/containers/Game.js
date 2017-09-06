import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as gameActions from 'actions/game';


const renderRankings = (players) => {
    let list = [];
    for (let playerId in players) {
        let player = players[playerId];
        list.push(player);

    }
    list.sort((a, b) => a.score > b.score ? -1 : 1);
    list = list.map(player => (
        <div key={player.id}>
            { player.id }: { player.score }
        </div>
    ));

    return (
        <div>
            { list }
        </div>
    )
};

@connect(
    state => ({
        game: state.game,
    }),
    dispatch => bindActionCreators({...gameActions}, dispatch)
)
export default class Game extends Component {
    static propTypes = {
        status: PropTypes.string.isRequired
    };
    render () {
        let { status, game } = this.props;
        return (
            <section>
                <h1>game</h1>
                <div>word: { game.word }</div>
                <div>status: { status }</div>
                <div>countDown: { game.countDown }</div>
                <div>banker: { JSON.stringify(game.banker) }</div>
                <div>rankings: { renderRankings(game.players) }</div>
            </section>
        );
    }
}