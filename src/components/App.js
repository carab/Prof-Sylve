'use strict';

import _ from 'lodash';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';
import {IntlProvider, addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

import CircularProgress from 'material-ui/CircularProgress';

import Main from './Main';
import Pokedex from './Pokedex/Pokedex';
import PageList from './Page/List';
import PagePc from 'components/Page/Pc';
import PageDashboard from 'components/Page/Dashboard';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import PageSettings from 'components/Page/Settings';
import UserFriends from 'components/user/Friends';
import Loader from 'components/Utils/Loader';

import actions from '../actions';

addLocaleData(frLocaleData);

class App extends Component {
  componentWillMount() {
    const {locale, setLocale, listenToAuth} = this.props;

    listenToAuth();

    if (!locale) {
      setLocale(this.getDefaultLocale());
    }
  }

  render() {
    const {auth, locale, loaded} = this.props;

    // Render the app or the splash
    if (
      locale // User locale has been found
      && auth.ready // User is ready (either signed in or not)
      && (
        !auth.signedIn // The user is not signed in
        || auth.signedIn && loaded // The user is signed in and his Pokédex has been loaded.
      )
    ) {
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
    const {locale} = this.props;

    return (
      <IntlProvider locale={locale} messages={this.getMessages(locale)}>
        <Router history={browserHistory}>
          <Route path="/" component={Main}>
            <IndexRoute name="sign" component={SignComponent} onEnter={this.handleAuthenticated}/>
            <Route name="signout" path="signout" component={SignoutComponent}/>
            <Route path="pokedex/:username" component={Pokedex}>
              <IndexRedirect to="dashboard" />
              <Route name="dashboard" path="dashboard" component={PageDashboard}/>
              <Route name="pc" path="pc(/:currentBox)" component={PagePc}/>
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
    const {auth, username} = this.props;

    if (auth.signedIn) {
      replace({
        pathname: `/pokedex/${username}`,
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  handleAuthRequired = (nextState, replace) => {
    const {auth} = this.props;

    if (!auth.signedIn) {
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
  const pokedex = state.ui.pokedexes.get(state.profile.username);

  return {
    auth: state.auth,
    locale: state.profile.locale,
    username: state.profile.username,
    loaded: !!pokedex, // Force boolean
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: (locale) => {
      dispatch(actions.profile.setLocale(locale));
    },
    listenToAuth: () => {
      dispatch(actions.auth.listenToAuth());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
