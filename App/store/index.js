import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducers';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

const middleWare = [];

middleWare.push(thunk)

// const loggerMiddleware = createLogger({
// predicate: () => process.env.NODE_ENV === 'development',
// });
// middleWare.push(loggerMiddleware)

const store = createStore(reducers, applyMiddleware(...middleWare));

export default store;
