import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './reducers';
import socket from 'network/ws';
import initSocketEvent from 'utils/initSocketEvent';

initSocketEvent(socket);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,
    document.querySelector('#app')
);

