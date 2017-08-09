import React, { Component } from 'react';
import Board from 'containers/Board';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import AsyncComponent from 'containers/AsyncComponent';

export default class App extends Component {
    render () {
        return (
            <div>
                <Route path="/a" render={
                    (p) => {
                        return (
                            <Board url={p.match.url}/>
                        )
                    }
                }/>
                <Route path="/b" render={
                    () => {
                        let Aaa = AsyncComponent(() => import('containers/Async'));
                        return <Aaa name="1"/>
                    }
                }/>
                <Board/>
            </div>
        )
    }
}