import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './reducers';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import socket from 'network/ws';

socket.on('connect', () => {
    console.log(1);
    socket.emit('loginRoom', 'asd');
    setTimeout(() => {
        socket.emit('chatMsg', 'asd');
    }, 500);
});
socket.on('chatMsg', d => {
    console.log(d)
});
socket.on('roomList', d => {
    console.log(d, 'roomList')
});
socket.on('asd', d => {
    console.log(d, 'asd')
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
