import {createStore} from 'redux';
import counter  from '@reducers/counter';
import {combineReducers} from 'redux';
import userInfo  from '@reducers/userInfo';

let store = createStore(combineReducers({counter, userInfo}));

export default store;