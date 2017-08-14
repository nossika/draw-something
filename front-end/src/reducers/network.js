import { combineReducers } from 'redux';

let initialLoadingStatus = false;

let initialWebSocketStatus = false;

export default combineReducers({
    loadingStatus (state = initialLoadingStatus, action) {
        switch (action.type) {
            case 'LOADING':
                return true;
            case 'LOADED':
                return false;
            default:
                return state;
        }
    },
    webSocketStatus (state = initialWebSocketStatus, action) {
        switch (action.type) {
            case 'WS_CONNECT':
                return true;
            case 'WS_DISCONNECT':
                return false;
            default:
                return state;
        }
    }
})