import React, { Component } from 'react';
import { Route, Switch, Link, HashRouter as Router } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import AsyncComponent from 'containers/AsyncComponent';
import * as networkActions from 'actions/network';

@connect(
    state => ({
        loadingStatus: state.network.loadingStatus,
        webSocketStatus: state.network.webSocketStatus,
        user: state.user
    }),
    dispatch => bindActionCreators({...networkActions}, dispatch)
)
export default class App extends Component {
    render () {
        const { loadingStatus, webSocketStatus, loading, loaded, wsConnect, wsDisconnect, user } = this.props;
        return (
            <section>
                <div>webSocketStatus: { String(webSocketStatus) }</div>
                <div>myId: { user.id }</div>
                <Router>
                    <Switch>
                        <Route path="/" exact component={ AsyncComponent(() => import('containers/Home')) }/>
                        <Route
                            path="/:roomName"
                            render={
                                ({ match }) => {
                                    const Room = AsyncComponent(() => import('containers/Room'));
                                    return <Room key={ match.params.roomName } roomName={ match.params.roomName }/>
                                }
                            }
                        />
                    </Switch>
                </Router>
            </section>
        )
    }
}