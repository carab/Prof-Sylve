'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';

import Locale from './Locale';

import store from '../store';
import actions from '../actions';

class StoreComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    store.dispatch(actions.startListeningToUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Locale/>
      </Provider>
    );
  }
}

export default StoreComponent;
