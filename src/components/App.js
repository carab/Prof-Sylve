'use strict';

import _ from 'lodash';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IntlProvider, addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';

import Main from 'components/Main/Main';
import Loader from 'components/Utils/Loader/Loader';

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
        <Main/>
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
