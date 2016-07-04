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
import PokemonPc from 'components/pokemon/Pc';
import Pokedex from 'components/user/Pokedex';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import UserSettings from 'components/user/SettingsComponent';
import UserDashboard from 'components/user/Dashboard';
import UserFriends from 'components/user/Friends';
import UserPublic from 'components/user/Public';

import actions from '../actions';

addLocaleData(frLocaleData);

class App extends Component {
  constructor(props) {
    super(props);

    this.handleAuthRequired = this.handleAuthRequired.bind(this);

    props.auth();
  }

  componentWillMount() {
    const {locale, setLocale} = this.props;

    if (!locale) {
      setLocale(this.getDefaultLocale());
    }
  }

  render() {
    const {locale, isReady} = this.props;

    if (isReady && locale) {
      return this.renderApp();
    }

    return this.renderSplash();
  }

  renderSplash() {
    return (
      <div className="Splash">
        <CircularProgress size={2}/>
      </div>
    );
  }

  renderApp() {
    const {locale} = this.props;

    return (
      <IntlProvider locale={locale} messages={this.getMessages(locale)}>
        <Router history={browserHistory}>
          <Route path="/" component={Main}>
            <IndexRoute name="sign" component={SignComponent} onEnter={this.handleAuthenticated}/>
            <Route name="signout" path="signout" component={SignoutComponent}/>
            <Route path="pokedex/:username" component={Pokedex}>
              <IndexRoute name="dashboard" component={UserDashboard}/>
              <Route name="pc" path="pc(/:currentBox)" component={PokemonPc}/>
              <Route name="list" path="list(/**)" component={PageList}/>
            </Route>
            <Route name="friends" path="friends" component={UserFriends} onEnter={this.handleAuthRequired}/>
            <Route name="settings" path="settings" component={UserSettings} onEnter={this.handleAuthRequired}/>
          </Route>
        </Router>
      </IntlProvider>
    );
  }

  handleAuthenticated = (nextState, replace) => {
    const {isSignedIn, username} = this.props;

    if (isSignedIn && username) {
      replace({
        pathname: '/pokedex/' + username,
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  handleAuthRequired(nextState, replace) {
    const {isSignedIn} = this.props;

    if (!isSignedIn) {
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
    isReady: state.auth.isReady,
    isSignedIn: state.auth.isSignedIn,
    locale: state.profile.locale,
    username: state.pokedex.settings.username,
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
