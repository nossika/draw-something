import { combineReducers } from 'redux';

let initialType = '';

export default combineReducers({
    type (state = initialType, action) {
        switch (action.type) {
            case 'ERROR_LOGOUT':
                return 'logout';
            default:
                return state;
        }
    }
});
