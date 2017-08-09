import { combineReducers } from 'redux';
import card from './card';
import { createStore } from 'redux';

export default createStore(
    combineReducers({
        card
    })
)