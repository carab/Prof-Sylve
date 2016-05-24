import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import Routes from './components/Routes';

import FirebaseUtils from './utils/firebase-utils';
import Translations from './utils/translations-loader';

import store from './store';
import actions from './actions';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      localeLoaded: false,
      locale: Translations.locale,
      messages: Translations.messages,
    };
  }

  componentWillMount() {
    store.dispatch(actions.startListeningToPokemons());
    store.dispatch(actions.startListeningToUser());

    Translations.onLocaleChange(this.handleLocaleChange.bind(this));

    if (FirebaseUtils.isLoggedIn()) {
      FirebaseUtils.getUserRef().child('settings/locale').once('value', (snapshot) => {
        Translations.changeLocale(snapshot.val());
        this.setState({ localeLoaded: true });
      });
    } else {
      this.setState({ localeLoaded: true });
    }
  }

  componentWillUnmount() {
    // remove onLocaleChange callback
  }

  render() {
    if (!this.state.localeLoaded) {
      return <div></div>;
    }

    let { locale, messages } = this.state;

    return (
      <Provider store={store}>
        <IntlProvider locale={locale} messages={messages}>
          <Routes/>
        </IntlProvider>
      </Provider>
    );
  }

  handleLocaleChange(locale, messages) {
    this.setState({ locale, messages });
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
