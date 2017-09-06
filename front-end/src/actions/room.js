export const updateRoomList = roomList => ({
    type: 'UPDATE_ROOM_LIST',
    roomList
});

export const setRoomInfo = roomInfo => ({
    type: 'SET_ROOM_INFO',
    roomName: roomInfo.roomName,
    people: roomInfo.people,
    owner: roomInfo.owner,
    messageList: roomInfo.messageList,
});
export const addRoomPeople = people => ({
    type: 'ADD_ROOM_PEOPLE',
    people: {
        id: people.id,
        info: people.info
    }
});
export const delRoomPeople = people => ({
    type: 'DEL_ROOM_PEOPLE',
    people: {
        id: people.id
    }
});
export const receiveRoomMessage = ({ by, content, timestamp, type }) => ({
    type: 'RECEIVE_ROOM_MESSAGE',
    message: { by, content, timestamp, type }
});