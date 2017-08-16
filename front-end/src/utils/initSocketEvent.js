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
}