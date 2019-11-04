/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import rootSaga from '../sagas';
import sagaMiddleware from './middleware';

const enhancer = (process.env.NODE_ENV !== 'development') ?
  applyMiddleware(sagaMiddleware) :
  (() => {
    const DevTools = require('../../tools/DevTools').default;
    return compose(applyMiddleware(sagaMiddleware), DevTools.instrument());
  })();

const configureStore = () => {
  const store = createStore(rootReducer, undefined, enhancer);
  let sagaTask = sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });

    module.hot.accept('../sagas', () => {
      sagaTask.cancel();
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(rootSaga);
      });
    });
  }

  return store;
};

export default configureStore;

