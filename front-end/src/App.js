import React, { Component } from 'react';
import Board from 'containers/Board';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import AsyncComponent from 'containers/AsyncComponent';

export default class App extends Component {
    render () {
        return (
            <div>
                {/*<Route path="/a" render={*/}
                    {/*(p) => {*/}
                        {/*return (*/}
                            {/*<Board url={p.match.url}/>*/}
                        {/*)*/}
                    {/*}*/}
                {/*}/>*/}
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