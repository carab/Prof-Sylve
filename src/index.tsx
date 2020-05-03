import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import App from "./components/App";
import Store from "./components/Store";
import Theme from "./components/Theme";
import RouterProvider from "components/RouterProvider";
import { HelmetProvider } from "react-helmet-async";

const providers = [
  React.StrictMode,
  HelmetProvider,
  RouterProvider,
  Theme,
  Store,
];

const app = providers.reduceRight(
  (children, Component) => <Component>{children}</Component>,
  <App/>,
);

ReactDOM.render(
  app,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
