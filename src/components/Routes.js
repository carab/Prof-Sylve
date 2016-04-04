'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import FirebaseUtils from '../utils/firebase-utils';

import App from 'components/App';
import PcComponent from 'components/grid/PcComponent';
import SigninComponent from 'components/user/SigninComponent';
import SignupComponent from 'components/user/SignupComponent';
import SignoutComponent from 'components/user/SignoutComponent';

class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={PcComponent} onEnter={requireAuth}/>
          <Route path="signup" component={SignupComponent}/>
          <Route path="signin" component={SigninComponent}/>
          <Route path="signout" component={SignoutComponent}/>
        </Route>
      </Router>
    );
  }
}

function requireAuth(nextState, replace) {
  if (!FirebaseUtils.getRootRef().getAuth()) {
    replace({
      pathname: '/signin',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

Routes.displayName = 'Routes';

export default Routes;
