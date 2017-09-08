import { combineReducers } from 'redux';

let initialId = '';
let initialInfo = {};

export default combineReducers({
    id (state = initialId, action) {
        switch (action.type) {
            case 'SET_USER_INFO':
                return action.userInfo.id;
            default:
                return state;
        }
    },
    info (state = initialInfo, action) {
        switch (action.type) {
            case 'SET_USER_INFO':
                return action.userInfo.info;
            default:
                return state;
        }
    }
});
