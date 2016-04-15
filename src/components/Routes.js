'use strict';

import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import FirebaseUtils from '../utils/firebase-utils';

import App from 'components/App';
import PokemonList from './pokemon/List';
import PokemonPc from 'components/pokemon/Pc';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import SettingsComponent from 'components/user/SettingsComponent';

class Routes extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute name="pc" component={PokemonPc} onEnter={requireAuth}/>
          <Route name="list" path="list" component={PokemonList} onEnter={requireAuth}/>
          <Route name="settings" path="settings" component={SettingsComponent}/>
          <Route name="sign" path="sign" component={SignComponent}/>
          <Route name="signout" path="signout" component={SignoutComponent}/>
        </Route>
      </Router>
    );
  }
}

function requireAuth(nextState, replace) {
  if (!FirebaseUtils.isLoggedIn()) {
    replace({
      pathname: '/sign',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

Routes.displayName = 'Routes';

export default Routes;
