import { combineReducers } from 'redux';

let initialRoomList = [];

let initialMyRoom = {
    name: '',
    peopleList: [] // [{id: String, info: Object}]
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
            case 'SET_ROOM_PEOPLE':
                return Object.assign({}, state, {
                    peopleList: action.peopleList
                });
            case 'ADD_ROOM_PEOPLE':
            {
                let newState = Object.assign({}, state);
                newState.peopleList = newState.peopleList.slice();
                let { id, info } = action.people;
                newState.peopleList.push({ id, info });
                return newState;
            }
            case 'DEL_ROOM_PEOPLE':
            {
                let newState = Object.assign({}, state);
                let { id, info } = action.people;
                newState.peopleList = newState.peopleList.filter(item => item.id !== id);
                return newState;
            }
            default:
                return state;
        }
    }
})