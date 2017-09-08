import socket from 'network/ws';
import store from '../reducers';
import * as roomAction from 'actions/room';
import * as networkActions from 'actions/network';
import * as userActions from 'actions/user';
import * as gameActions from 'actions/game';

export default {
    enterRoom (roomName) {
        socket.emit('enterRoom', roomName, () => {
            store.dispatch(roomAction.setRoomInfo({ roomName }));
        });
    },
    leaveRoom () {
        socket.emit('leaveRoom');
        store.dispatch(roomAction.setRoomInfo({ roomName: '' }));
    },
    sendRoomMessage (content) {
        let userInfo = store.getState().user;
        socket.emit('sendRoomMessage', content, (res) => {
            if (!res.ok) return;
            store.dispatch(roomAction.receiveRoomMessage({
                content,
                by: userInfo,
                timestamp: res.timestamp,
                type: 'message'
            }));
        });

    },
    startGame () {
        socket.emit('startGame');
    },
    emitCanvasStroke (stroke) {
        socket.emit('canvasStroke', stroke);
    }
}