import socket from 'network/ws';
import store from '../reducers';
import * as roomActions from 'actions/room';
import * as networkActions from 'actions/network';
import * as userActions from 'actions/user';
import * as gameActions from 'actions/game';

export default {
    enterRoom (roomName) {
        socket.emit('enterRoom', roomName, () => {
            store.dispatch(roomActions.setRoomInfo({ roomName }));
        });
    },
    leaveRoom () {
        socket.emit('leaveRoom');
        store.dispatch(roomActions.setRoomInfo({ roomName: '' }));
    },
    sendRoomMessage (content) {
        let userInfo = store.getState().user;
        socket.emit('sendRoomMessage', content, (res) => {
            if (!res.ok) return;
            store.dispatch(roomActions.receiveRoomMessage({
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
    },
    setUserData (userData) {
        socket.emit('set')
        store.dispatch(userActions.setUserData({
            info: {
                name: 1,
            }
        }));
    },
}