import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export type RouterProviderProps = {
  children: React.ReactNode;
};

function RouterProvider({ children }: RouterProviderProps) {
  return <Router history={history}>{children}</Router>;
}

export default RouterProvider;
