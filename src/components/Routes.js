'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import FirebaseUtils from '../utils/firebase-utils';

import App from 'components/App';
import ListComponent from 'components/list/ListComponent';
import PcComponent from 'components/grid/PcComponent';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import SettingsComponent from 'components/user/SettingsComponent';

class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={PcComponent} onEnter={requireAuth}/>
          <Route path="list" component={ListComponent} onEnter={requireAuth}/>
          <Route path="settings" component={SettingsComponent}/>
          <Route path="sign" component={SignComponent}/>
          <Route path="signout" component={SignoutComponent}/>
        </Route>
      </Router>
    );
  }
}

function requireAuth(nextState, replace) {
  if (!FirebaseUtils.isLoggedIn()) {
    replace({
      pathname: '/sign',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

Routes.displayName = 'Routes';

export default Routes;
