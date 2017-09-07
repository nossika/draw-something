import store from '../reducers';
import * as roomAction from 'actions/room';
import * as networkActions from 'actions/network';
import * as userActions from 'actions/user';
import * as gameActions from 'actions/game';
import Rx from 'rxjs/Rx';

console.log(Rx);

export default (socket) => {
    // main
    socket.on('connect', () => {
        store.dispatch(networkActions.wsConnect());
    });
    socket.on('disconnect', () => {
        store.dispatch(networkActions.wsDisconnect());
    });
    socket.on('reconnect', () => {
        console.log('reconnect'); // todo 断线重连时重进房间
        let state = store.getState();
        let roomName = state.room.currentRoom.name;
        if (roomName) {
            socket.emit('enterRoom', roomName);
        }
    });
    socket.on('userInfo', d => {
        store.dispatch(userActions.setUserInfo({
            id: d.id,
            info: d.info || {}
        }));
    });
    // room
    socket.on('roomList', d => {
        let list = d.map(roomInfo => ({
            roomName: roomInfo.roomName,
            peopleCount: roomInfo.peopleCount,
            owner: roomInfo.owner,
        }));
        store.dispatch(roomAction.updateRoomList(list));
    });
    socket.on('roomInfo', d => {
        let info = {
            people: d.people,
            owner: d.owner,
            messageList: d.messageList || [],
        };
        store.dispatch(roomAction.setRoomInfo(info));
    });
    socket.on('roomOwnerChanged', d => {
        let info = {
            owner: d.owner
        };
        store.dispatch(roomAction.setRoomInfo(info));
    });
    socket.on('peopleEnterRoom', message => {
        store.dispatch(roomAction.addRoomPeople(message.sender));
    });
    socket.on('peopleLeaveRoom', message => {
        store.dispatch(roomAction.delRoomPeople(message.sender));
    });
    socket.on('roomMessage', message => {
        store.dispatch(roomAction.receiveRoomMessage({
            timestamp: message.timestamp,
            type: 'message',
            by: message.sender || null,
            content: message.content
        }));
    });
    // game
    socket.on('setGameStatus', status => {
        store.dispatch(gameActions.setGameStatus(status));
        if (status === 'going') {
            store.dispatch(gameActions.setGameWord(''));
        }
    });
    socket.on('setGameCountDown', countDown => {
        store.dispatch(gameActions.setGameCountDown(countDown));
    });
    socket.on('setGameBanker', banker => {
        store.dispatch(gameActions.setGameBanker(banker));
    });
    socket.on('setGamePlayers', players => {
        store.dispatch(gameActions.setGamePlayers(players));
    });
    socket.on('updateGamePlayerScore', ({ playerId, score }) => {
        store.dispatch(gameActions.updateGamePlayerScore({ playerId, score }));
    });
    socket.on('roundWord', word => {
        store.dispatch(gameActions.setGameWord(word));
    });

}