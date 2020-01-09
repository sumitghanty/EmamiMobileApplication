import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger'
import axiosMiddleware from 'redux-axios-middleware'
import { Api } from '../services'
import reducers from './reducers'

const logger = createLogger({predicate: (getState, action)=> __DEV__});
const reducer = combineReducers(reducers);

const store = createStore(reducer, applyMiddleware(axiosMiddleware(Api),logger));

export default store;
