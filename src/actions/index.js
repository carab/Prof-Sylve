import { browserHistory } from 'react-router';

import FirebaseUtils from '../utils/firebase-utils';
import UserUpdate from '../utils/user-update';

const actions = {
  startListeningToUser() {
    return (dispatch) => {
      let userRef;

      FirebaseUtils.onAuthStateChanged((user) => {
        if (user) {
          // If the user signed in, check if its data needs update and perform it
          // Eitherway, listen on the user data.

          userRef = FirebaseUtils.getRootRef().child('users').child(user.uid);

          const listenToUser = () => {
            let first = true;
            userRef.on('value', (snapshot) => {
              dispatch({ type: 'RECEIVE_USER_DATA', data: snapshot.val() });
              if (first) {
                browserHistory.push('/');
                first = false;
              }
            });
          };

          userRef.once('value', (snapshot) => {
            const user = snapshot.val();

            if (UserUpdate.needs(user)) {
              FirebaseUtils.getRootRef().child('pokemons').once('value', (snapshot) => {
                const pokemons = snapshot.val();

                UserUpdate.perform(user, pokemons).then(() => {
                  userRef.set(user).then(listenToUser);
                });
              });
            } else {
              listenToUser();
            }
          });
        } else {
          // If the user signed out, cancel the listening and reset user data.
          if (userRef) {
            userRef.off('value');
          }

          dispatch({ type: 'RESET_USER_DATA' });
          browserHistory.push('/sign');
        }
      });
    };
  },

  setUserLocale(locale) {
    return (dispatch) => {
      if (FirebaseUtils.isLoggedIn()) {
        FirebaseUtils.getUserRef()
          .child('profile/locale')
          .set(locale);
      } else {
        dispatch({ type: 'SET_USER_LOCALE', locale });
      }
    };
  },

  setUserProfile(profile) {
    return () => {
      FirebaseUtils.getUserRef()
        .child('profile')
        .set(profile);
    };
  },

  setPokemonCollected(pokemon) {
    return () => {
      FirebaseUtils.getUserRef()
        .child('pokedex')
        .child(pokemon.id-1)
        .child('collected')
        .set(!pokemon.collected);
    };
  },

  setPokemonTag(pokemon, tag) {
    return () => {
      FirebaseUtils.getUserRef()
        .child('pokedex')
        .child(pokemon.id-1)
        .child('tag')
        .set(tag);
    };
  },
};

export default actions;
