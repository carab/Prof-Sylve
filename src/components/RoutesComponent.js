'use strict';

import React from 'react';

import { Router, Route, Link, browserHistory } from 'react-router';

import App from 'components/App';
import PcComponent from 'components/grid/PcComponent';

class RoutesComponent extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="livingdex" component={PcComponent}/>
        </Route>
      </Router>
    );
  }
}

RoutesComponent.displayName = 'RoutesComponent';

export default RoutesComponent;
