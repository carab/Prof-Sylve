import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import Routes from './components/Routes';
import Store from './components/Store';
import User from './components/User';

import FirebaseUtils from './utils/firebase-utils';
import Translations from './utils/translations-loader';

import store from './store';
import actions from './actions';

class Root extends Component {
  constructor(props) {
    super(props);

    this.handleLocaleChanged = this.handleLocaleChanged.bind(this);
    this.handleAuthStateChanged = this.handleAuthStateChanged.bind(this);

    this.state = {
      localeLoaded: false,
      locale: Translations.locale,
      messages: Translations.messages,
    };
  }

  componentWillMount() {
    store.dispatch(actions.startListeningToUser());

    Translations.onLocaleChange(this.handleLocaleChanged);

    if (FirebaseUtils.isLoggedIn()) {
      FirebaseUtils.getUserRef().child('profile/locale').once('value', (snapshot) => {
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

  componentDidMount() {
    FirebaseUtils.onAuthStateChanged(this.handleAuth);
  }

  render() {
    if (!this.state.localeLoaded) {
      return <div></div>;
    }

    let { locale, messages } = this.state;

    return (
      <Store>
        <User>
          <Routes/>
        </User>
      </Store>
    );
  }

  handleLocaleChanged(locale, messages) {
    this.setState({ locale, messages });
  }

  handleAuthStateChanged(user) {
    if (user) {
      this.setState({
        loading: true,
      });

      FirebaseUtils.getRootRef().child('users').child(user.uid).once('value', (snapshot) => {
        const user = snapshot.val();

        if (!user.profile.locale) {
          user.profile.locale = Translations.locale;
        }

        FirebaseUtils.getRootRef().child('pokemons').once('value', (snapshot) => {
          const pokemons = snapshot.val();

          UserUpdate.perform(user, pokemons).then(() => {
            console.log(user)
            FirebaseUtils.getRootRef().child('users').child(user.uid).set(user);
            this.setState({
              loading: false,
              loggedIn: true,
            });
          });
        });
      });
    } else {
      this.setState({
        loggedIn: false,
      });

      this.context.router.replace('/sign');
    }
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
