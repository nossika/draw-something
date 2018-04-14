import { combineReducers } from 'redux';

let initialName = '',
    initialOwner = null,
    initialPeople = [], // Array<{id: String, info: Object}>,
    initialMessageList = []; // Array<{timestamp: Number, by: People, content: String, type: String}>

export default combineReducers({
    name (state = initialName, action) {
        switch (action.type) {
            case 'SET_ROOM_INFO':
                return action.roomName !== undefined ? action.roomName : state;
            default:
                return state;
        }
    },
    owner (state = initialOwner, action) {
        switch (action.type) {
            case 'UPDATE_USER_DATA':
            {
                if (state && (state.id === action.id)) {
                    return Object.assign({}, state, {
                        id: action.id,
                        info: action.info,
                    });
                } else {
                    return state;
                }
            }
            case 'SET_ROOM_INFO':
                return action.owner !== undefined ? action.owner : state;
            default:
                return state;
        }
    },
    people (state = initialPeople, action) {
        switch (action.type) {
            case 'UPDATE_USER_DATA':
            {
                let index = state.findIndex(people => {
                    return people.id === action.id
                });

                if (index !== -1) {
                    let newState = state.slice();
                    newState.splice(index, 1, Object.assign({}, state[index], {
                        id: action.id,
                        info: action.info,
                    }));
                    return newState;
                }
                return state;
            }
            case 'SET_ROOM_INFO':
                return action.people !== undefined ? action.people : state;
            case 'ADD_ROOM_PEOPLE':
            {
                let { id, info } = action.people;
                return state.concat({ id, info });
            }
            case 'DEL_ROOM_PEOPLE':
            {
                let { id, info } = action.people;
                return state.filter(item => item.id !== id);
            }
            default:
                return state;
        }
    },
    messageList (state = initialMessageList, action) {
        switch (action.type) {
            case 'SET_ROOM_INFO':
                return action.messageList !== undefined ? action.messageList : state;
            case 'RECEIVE_ROOM_MESSAGE':
                let { by, content, timestamp, type } = action.message;
                return (state.length >= 200 ? state.slice(1, 200) : state).concat({ by, content, timestamp, type });
            default:
                return state;
        }
    }
});