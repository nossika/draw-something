export const updateRoomList = (roomList) => ({
    type: 'UPDATE_ROOM_LIST',
    roomList
});
export const setRoom = (name) => ({
    type: 'SET_ROOM',
    name
});
export const setRoomPeople = (peopleList) => ({
    type: 'SET_ROOM_PEOPLE',
    peopleList
});
export const addRoomPeople = (people) => ({
    type: 'ADD_ROOM_PEOPLE',
    people: {
        id: people.id,
        info: people.info
    }
});
export const delRoomPeople = (people) => ({
    type: 'DEL_ROOM_PEOPLE',
    people: {
        id: people.id
    }
});