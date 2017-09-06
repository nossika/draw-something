import { combineReducers } from 'redux';
import { createStore } from 'redux';
import network from './network';
import room from './room/index';
import user from './user';
import game from './game';

export default createStore(
    combineReducers({
        network,
        room,
        user,
        game
    })
)