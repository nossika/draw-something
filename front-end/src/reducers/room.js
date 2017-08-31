import { combineReducers } from 'redux';

let initialRoomList = [];

let initialMyRoom = {
    name: '',
    owner: null,
    people: [] // [{id: String, info: Object}]
};

export default combineReducers({
    roomList (state = initialRoomList, action) {
        switch (action.type) {
            case 'UPDATE_ROOM_LIST':
                return action.roomList;
            default:
                return state;
        }
    },
    myRoom (state = initialMyRoom, action) {
        switch (action.type) {
            case 'SET_ROOM':
                return Object.assign({}, state, {
                    name: action.name
                });
            case 'SET_ROOM_INFO':
                return Object.assign({}, state, {
                    people: action.people,
                    owner: action.owner,
                });
            case 'ADD_ROOM_PEOPLE':
            {
                let newState = Object.assign({}, state);
                newState.people = newState.people.slice();
                let { id, info } = action.people;
                newState.people.push({ id, info });
                return newState;
            }
            case 'DEL_ROOM_PEOPLE':
            {
                let newState = Object.assign({}, state);
                let { id, info } = action.people;
                newState.people = newState.people.filter(item => item.id !== id);
                return newState;
            }
            default:
                return state;
        }
    }
})