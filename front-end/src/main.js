import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './reducers';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import socket from 'utils/ws';

socket.on('connect', () => {
    console.log(1)
});

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>
    ,
    document.querySelector('#app')
);