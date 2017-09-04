import { combineReducers } from 'redux';
import { createStore } from 'redux';
import network from './network';
import room from './room';
import user from './user';

export default createStore(
    combineReducers({
        network,
        room,
        user
    })
)