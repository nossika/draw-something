import React, { Component } from 'react';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import AsyncComponent from 'containers/AsyncComponent';
import * as networkActions from 'actions/network';

@connect(
    state => ({
        loadingStatus: state.network.loadingStatus,
        webSocketStatus: state.network.webSocketStatus
    }),
    dispatch => bindActionCreators({...networkActions}, dispatch)
)
export default class App extends Component {
    render () {
        const { loadingStatus, webSocketStatus, loading, loaded, wsConnect, wsDisconnect } = this.props;
        return (
            <div>
                <Route path="/" exact component={ AsyncComponent(() => import('containers/Home')) }/>
                <Route path="/:room" render={
                    ({ match }) => {
                        const Room = AsyncComponent(() => import('containers/Room'));
                        return <Room room={match.params.room}/>
                    }
                }/>
            </div>
        )
    }
}