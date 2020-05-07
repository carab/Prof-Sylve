import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AuthProvider from './components/AuthProvider';
import Store from './components/Store';
import Theme from './components/Theme';
import RouterProvider from 'components/RouterProvider';
import { HelmetProvider } from 'react-helmet-async';
import LocaleProvider from 'components/LocaleProvider';
import Main from 'components/Main/Main';

import './index.css';

const providers = [
  React.StrictMode,
  HelmetProvider,
  RouterProvider,
  Theme,
  Store,
  LocaleProvider,
  AuthProvider,
];

const app = providers.reduceRight(
  (children, Component) => <Component>{children}</Component>,
  <Main />,
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
