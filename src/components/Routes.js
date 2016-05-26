'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from 'components/App';
import PokemonList from './pokemon/List';
import PokemonPc from 'components/pokemon/Pc';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import SettingsComponent from 'components/user/SettingsComponent';

class Routes extends Component {
  constructor(props) {
    super(props);

    this.handleAuthRequired = this.handleAuthRequired.bind(this);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute name="pc" component={PokemonPc} onEnter={this.handleAuthRequired}/>
          <Route name="list" path="list" component={PokemonList} onEnter={this.handleAuthRequired}/>
          <Route name="settings" path="settings" component={SettingsComponent} onEnter={this.handleAuthRequired}/>
          <Route name="sign" path="sign" component={SignComponent}/>
          <Route name="signout" path="signout" component={SignoutComponent} onEnter={this.handleAuthRequired}/>
        </Route>
      </Router>
    );
  }

  handleAuthRequired(nextState, replace) {
    const {signedIn} = this.props;

    if (!signedIn) {
      replace({
        pathname: '/sign',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }
}

Routes.displayName = 'Routes';

const mapStateToProps = (state) => {
  return {
    signedIn: state.user.signedIn,
  };
};

export default connect(mapStateToProps)(Routes);
