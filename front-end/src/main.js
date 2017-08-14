import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './reducers';
import { Route, HashRouter as Router, Link } from 'react-router-dom'
import socket from 'network/ws';
import { updateRoomList } from 'actions/room';

socket.on('connect', () => {
    socket.emit('loginRoom', 'asd');
});
socket.on('chatMsg', d => {
    console.log(d)
});
socket.on('roomList', d => {
    let list = [];
    for (let room in d) {
        list.push({
            room,
            count: d[room]
        })
    }
    store.dispatch(updateRoomList(list));
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
