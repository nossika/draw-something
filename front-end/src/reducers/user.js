import { combineReducers } from 'redux';

let initialUserInfo = {
    id: '',
    info: {}
};

export default combineReducers({
    info (state = initialUserInfo, action) {
        switch (action.type) {
            case 'SET_USER_INFO':
                return {
                    id: action.userInfo.id,
                    info: action.userInfo.info
                };
            default:
                return state;
        }
    }
});
