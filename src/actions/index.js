import { browserHistory } from 'react-router';
import firebase from 'firebase';

import UserUpdate from '../utils/user-update';

const config = {
  apiKey: 'AIzaSyAa2dt9-n6blULUhfZ1WEm7AC9L_V8f0QM',
  authDomain: 'prof-sylve.firebaseapp.com',
  databaseURL: 'https://prof-sylve.firebaseio.com',
  storageBucket: 'prof-sylve.appspot.com',
};

firebase.initializeApp(config);

function isSignedIn() {
  const authData = firebase.auth().currentUser;

  return authData && true;
}

function getUserRef() {
  if (isSignedIn()) {
    const authData = firebase.auth().currentUser;

    return firebase.database().ref()
      .child('users')
      .child(authData.uid);
  }
}

const actions = {
  auth: {
    listens() {
      return (dispatch) => {
        firebase.auth().onAuthStateChanged((authData) => {
          if (authData) {
            function listens() {
              getUserRef().on('value', (snapshot) => {
                const user = snapshot.val();

                dispatch({
                  type: 'SET_PROFILE',
                  profile: user.profile,
                });

                dispatch({
                  type: 'SET_POKEDEX',
                  pokedex: user.pokedex,
                });

                dispatch({
                  type: 'SET_AUTH',
                  auth: {
                    currently: 'AUTH_AUTHENTICATED',
                    isReady: true,
                    isSignedIn: true,
                    data: authData,
                  },
                });

                browserHistory.push('/');
              });
            }

            getUserRef().once('value', (snapshot) => {
              const user = snapshot.val();

              if (UserUpdate.needs(user)) {
                firebase.database().ref().child('pokemons').once('value', (snapshot) => {
                  const pokemons = snapshot.val();

                  UserUpdate.perform(user, pokemons).then(() => {
                    getUserRef().set(user).then(listens);
                  });
                });
              } else {
                listens();
              }
            });
          } else {
            dispatch({
              type: 'SET_AUTH',
              auth: {
                currently: 'AUTH_GUEST',
                isReady: true,
                isSignedIn: false,
                data: {},
              },
            });

            browserHistory.push('/sign');
          }
        });
      };
    },
    signup(email, password, locale) {
      return () => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((user) => {
            firebase.database().ref().child('users').child(user.uid).set({
              profile: {
                email: user.email,
                uid: user.uid,
                locale,
              },
            }).then(() => {
              firebase.auth().signInWithEmailAndPassword(email, password);
            });
          })
      };
    },
    signin(email, password) {
      return () => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      };
    },
    signout() {
      return () => {
        return firebase.auth().signOut();
      };
    },
  },
  profile: {
    setLocale(locale) {
      return (dispatch) => {
        dispatch({ type: 'SET_LOCALE', locale });

        if (isSignedIn()) {
          getUserRef()
            .child('profile/locale')
            .set(locale);
        }
      };
    },

    setProfile(profile) {
      return (dispatch) => {
        dispatch({ type: 'SET_PROFILE', profile });

        getUserRef()
          .child('profile')
          .set(profile);
      };
    },
  },
  pokedex: {
    setCollected(pokemon) {
      return () => {
        getUserRef()
          .child('pokedex')
          .child(pokemon.id-1)
          .child('collected')
          .set(!pokemon.collected);
      };
    },

    setTag(pokemon, tag) {
      return () => {
        getUserRef()
          .child('pokedex')
          .child(pokemon.id-1)
          .child('tag')
          .set(tag);
      };
    },
  },
};

export default actions;
