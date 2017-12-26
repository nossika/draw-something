import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './reducers';
import 'lib/iconfont';
import 'style/index.less';
import socket from 'api/socketIo';
import initSocketEvent from './initSocketEvent';
initSocketEvent(socket);



ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,
    document.querySelector('#app')
);

