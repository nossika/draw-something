import store from '../reducers';
import { updateRoomList } from 'actions/room';

export default (socket) => {
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
}