import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import Store from './components/Store';

class Root extends Component {
  render() {
    return (
      <Store/>
    );
  }

  /*/handleAuthStateChanged(user) {
    if (user) {
      this.setState({
        loading: true,
      });

      FirebaseUtils.getRootRef().child('users').child(user.uid).once('value', (snapshot) => {
        const user = snapshot.val();

        FirebaseUtils.getRootRef().child('pokemons').once('value', (snapshot) => {
          const pokemons = snapshot.val();

          UserUpdate.perform(user, pokemons).then(() => {
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
  }/**/
}

ReactDOM.render(<Root/>, document.getElementById('app'));
