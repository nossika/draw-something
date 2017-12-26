import socket from 'api/socketIo';
import ls from 'api/localStorage';
import store from '../reducers';
import * as roomActions from 'actions/room';
import * as networkActions from 'actions/network';
import * as userActions from 'actions/user';
import * as gameActions from 'actions/game';
import { message$ } from 'flow/message';

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
            message$.next({
                content,
                by: userInfo,
                timestamp: res.timestamp,
                type: 'message'
            });
        });

    },
    startGame () {
        socket.emit('startGame');
    },
    emitCanvasStroke (stroke) {
        socket.emit('canvasStroke', stroke);
    },
    setUserInfo (info) {
        socket.emit('setClientInfo', info, (e) => {
            ls.set('clientInfo', info, 7 * 24 * 60 * 60 * 1000);
            store.dispatch(userActions.setUserData({
                info
            }));
        });
    },
}