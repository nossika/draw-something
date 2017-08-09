import { combineReducers } from 'redux';

let initialCardList = [];

export default combineReducers({
    list (state = initialCardList, action) {
        switch (action.type) {
            case 'ADD_CARD':
                return [...state, action.card];
            case 'CLEAR_CARD':
                return [];
            default:
                return state;
        }
    }
})