import store from '../reducers';
import { updateRoomList } from 'actions/room';
import * as networkActions from 'actions/network';

export default (socket) => {
    socket.on('connect', () => {
        store.dispatch(networkActions.wsConnect());
    });
    socket.on('disconnect', () => {
        store.dispatch(networkActions.wsDisconnect());
    });
    socket.on('reconnect', () => {
        console.log('reconnect'); // todo 断线重连时重进房间
        let state = store.getState();
        let roomName = state.room.myRoom.name;
        if (roomName) {
            socket.emit('enterRoom', roomName);
        }
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
}