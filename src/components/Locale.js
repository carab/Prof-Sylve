'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IntlProvider, addLocaleData} from 'react-intl';
import frLocaleData from 'react-intl/locale-data/fr';
import _ from 'lodash';

import Routes from './Routes';

import actions from '../actions';

addLocaleData(frLocaleData);

class LocaleComponent extends Component {
  constructor(props) {
    super(props);
    this.localeFiles = this.getLocaleFiles();
  }

  componentWillMount() {
    const {locale, onLocaleChanged} = this.props;

    if (!locale) {
      onLocaleChanged(this.getBrowserLocale());
    }
  }

  render() {
    const {locale} = this.props;
    const messages = this.getMessages(locale);

    if (locale) {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <Routes/>
        </IntlProvider>
      );
    }

    return null;
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

  getBrowserLocale() {
    const locale = navigator.language.split('-')[0];

    if (_.includes(['en', 'fr'], locale)) {
      return locale;
    }

    return 'en';
  }

  getMessages() {
    const {locale} = this.props;
    let file = this.localeFiles[locale] ? this.localeFiles[locale] : this.localeFiles['en'];
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

const mapStateToProps = (state) => {
  return {
    isLoaded: state.user.isLoaded,
    locale: state.user.data.profile.locale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLocaleChanged: (locale) => {
      dispatch(actions.setUserLocale(locale));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocaleComponent);
