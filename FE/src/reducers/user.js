import { combineReducers } from 'redux';

let initialId = '';
let initialInfo = {};

export default combineReducers({
    id (state = initialId, action) {
        switch (action.type) {
            case 'SET_USER_DATA':
                return action.userData.id !== undefined ? action.userData.id : state;
            default:
                return state;
        }
    },
    info (state = initialInfo, action) {
        switch (action.type) {
            case 'SET_USER_DATA':
                return Object.assign({}, state, action.userData.info);
            default:
                return state;
        }
    }
});
