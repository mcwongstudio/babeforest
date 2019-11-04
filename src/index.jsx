/* eslint-disable global-require */
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
// import 'normalize.css';
import 'antd-mobile/dist/antd-mobile.css';
import routes from './routes';
import configureStore from './models/store/configureStore';
import './styles/base.css';

const store = configureStore();

const render = (r) => {
  const content = (process.env.NODE_ENV !== 'development') ? (
    <Provider store={store}>
      { r }
    </Provider>
  ) : (() => {
    const { AppContainer } = require('react-hot-loader');
    const DevTools = require('./tools/DevTools').default;
    return (
      <AppContainer>
        <Provider store={store}>
          <div className="dev-only" style={{ height: '100%', overflow: 'hidden' }}>
            { r }
            <DevTools />
          </div>
        </Provider>
      </AppContainer>
    );
  })();

  ReactDOM.render(
    content,
    document.getElementById('app'),
  );
};

render(routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    const newRoutes = require('./routes').default;
    render(newRoutes);
  });
}
