import { combineReducers } from 'redux';
import currentRoom from './currentRoom';

let initialRoomList = [];

export default combineReducers({
    roomList (state = initialRoomList, action) {
        switch (action.type) {
            case 'UPDATE_ROOM_LIST':
                return action.roomList;
            default:
                return state;
        }
    },
    currentRoom
})