import {createStore,applyMiddleware} from 'redux';
import counter  from '@reducers/counter';
import {combineReducers} from 'redux';
import userInfo  from '@reducers/userInfo';
import thunkMiddleware from 'redux-thunk';

let store = createStore(combineReducers({counter, userInfo}), applyMiddleware(thunkMiddleware));

export default store;