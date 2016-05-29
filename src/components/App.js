'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {IntlProvider, addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import _ from 'lodash';

import CircularProgress from 'material-ui/CircularProgress';

import Main from './Main';
import PokemonList from './pokemon/List';
import PokemonPc from 'components/pokemon/Pc';
import SignComponent from 'components/user/SignComponent';
import SignoutComponent from 'components/user/SignoutComponent';
import SettingsComponent from 'components/user/SettingsComponent';

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
            <IndexRoute name="pc" component={PokemonPc} onEnter={this.handleAuthRequired}/>
            <Route name="list" path="list" component={PokemonList} onEnter={this.handleAuthRequired}/>
            <Route name="settings" path="settings" component={SettingsComponent} onEnter={this.handleAuthRequired}/>
            <Route name="sign" path="sign" component={SignComponent}/>
            <Route name="signout" path="signout" component={SignoutComponent} onEnter={this.handleAuthRequired}/>
          </Route>
        </Router>
      </IntlProvider>
    );
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
App.propTypes = {
  isReady: PropTypes.bool.isRequired,
  isSignedIn: PropTypes.bool.isRequired,
  locale: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    isReady: state.auth.isReady,
    isSignedIn: state.auth.isSignedIn,
    locale: state.profile.locale,
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
