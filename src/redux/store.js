import {createStore} from 'redux';
import counter  from '@reducers/counter';
import {combineReducers} from 'redux';

let store = createStore(combineReducers({counter}));

export default store;