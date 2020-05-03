import React from "react";
import { Provider } from "react-redux";
import store from "../store";

function Store({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default Store;
