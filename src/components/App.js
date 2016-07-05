'use strict';

import _ from 'lodash';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {IntlProvider, addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

import CircularProgress from 'material-ui/CircularProgress';

import Main from './Main';
import PageList from './Page/List';
import Loader from 'components/Utils/Loader';
import PokemonPc from 'components/pokemon/Pc';
import Pokedex from 'components/User/Pokedex';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import PageSettings from 'components/Page/Settings';
import UserDashboard from 'components/user/Dashboard';
import UserFriends from 'components/user/Friends';

import actions from '../actions';

addLocaleData(frLocaleData);

class App extends Component {
  constructor(props) {
    super(props);

    props.auth();
  }

  componentWillMount() {
    const {profile, setLocale} = this.props;

    if (!profile.locale) {
      setLocale(this.getDefaultLocale());
    }
  }

  render() {
    const {profile, ready} = this.props;

    if (ready && profile.locale) {
      return this.renderApp();
    }

    return this.renderSplash();
  }

  renderSplash() {
    return (
      <div className="Splash">
        <Loader/>
      </div>
    );
  }

  renderApp() {
    const {profile} = this.props;

    return (
      <IntlProvider locale={profile.locale} messages={this.getMessages(profile.locale)}>
        <Router history={browserHistory}>
          <Route path="/" component={Main}>
            <IndexRoute name="sign" component={SignComponent} onEnter={this.handleAuthenticated}/>
            <Route name="signout" path="signout" component={SignoutComponent}/>
            <Route path="pokedex/:username" component={Pokedex}>
              <IndexRoute name="dashboard" component={UserDashboard}/>
              <Route name="pc" path="pc(/:currentBox)" component={PokemonPc}/>
              <Route name="list" path="list(/**)" component={PageList}/>
            </Route>
            <Route component={Pokedex}>
              <Route name="friends" path="friends" component={UserFriends} onEnter={this.handleAuthRequired}/>
              <Route name="settings" path="settings" component={PageSettings} onEnter={this.handleAuthRequired}/>
            </Route>
          </Route>
        </Router>
      </IntlProvider>
    );
  }

  handleAuthenticated = (nextState, replace) => {
    const {signedIn, profile} = this.props;

    if (signedIn) {
      replace({
        pathname: `/pokedex/${profile.username}`,
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  handleAuthRequired = (nextState, replace) => {
    const {signedIn} = this.props;

    if (!signedIn) {
      replace({
        pathname: '/sign',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  getLocaleFiles() {
    const req = require.context('../translations', true, /\.json.*$/);
    const localeFiles = {};

    req.keys().forEach((file) => {
      const locale = file.replace('./', '').replace('.json', '');
      localeFiles[locale] = () => req(file);
    });

    return localeFiles;
  }

  getDefaultLocale() {
    const locale = navigator.language.split('-')[0];

    if (_.includes(['en', 'fr'], locale)) {
      return locale;
    }

    return 'en';
  }

  getMessages(locale) {
    const localeFiles = this.getLocaleFiles();
    const file = localeFiles[locale] ? localeFiles[locale] : localeFiles['en'];

    return this.flattenMessages(file());
  }

  flattenMessages(nestedMessages, prefix = '') {
    return Object.keys(nestedMessages).reduce((messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
          messages[prefixedKey] = value;
      } else {
          Object.assign(messages, this.flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {});
  }
}

App.displayName = 'App';
App.propTypes = {};

const mapStateToProps = (state) => {
  return {
    ready: state.auth.ready,
    signedIn: state.auth.signedIn,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: (locale) => {
      dispatch(actions.profile.setLocale(locale));
    },
    auth: (locale) => {
      dispatch(actions.auth.listens(locale));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
