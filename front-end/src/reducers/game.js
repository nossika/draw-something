import { combineReducers } from 'redux';

let initialStatus = 'pending'; // 'pending' | ''

export default combineReducers({
    status(state = initialStatus, action) {
        switch (action.type) {
            case 'SET_GAME_STATUS':
                return action.status;
            default:
                return state;
        }
    }
});