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

function getRootRef() {
  return firebase.database().ref();
}

function getUserRef() {
  if (isSignedIn()) {
    const authData = firebase.auth().currentUser;

    return getRootRef()
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
              let counter = 2;

              function setup() {
                if (--counter === 0) {
                  dispatch({
                    type: 'SET_AUTH',
                    auth: {
                      currently: 'AUTH_AUTHENTICATED',
                      isReady: true,
                      isSignedIn: true,
                      data: authData,
                    },
                  });
                }
              }

              getUserRef().child('profile').on('value', (snapshot) => {
                dispatch({
                  type: 'SET_PROFILE',
                  profile: snapshot.val(),
                });
                setup();
              });

              getUserRef().child('pokedex').on('value', (snapshot) => {
                dispatch({
                  type: 'SET_POKEDEX',
                  pokedex: snapshot.val(),
                });
                setup();
              });
            }

            getRootRef().child('config/version').once('value', (snapshot) => {
              const version = snapshot.val();

              getUserRef().child('profile').once('value', (snapshot) => {
                const profile = snapshot.val();

                getUserRef().child('pokedex').once('value', (snapshot) => {
                  const pokedex = snapshot.val();
                  const user = { profile, pokedex };

                  if (UserUpdate.check(user, version)) {
                    getRootRef().child('pokemons').once('value', (snapshot) => {
                      const pokemons = snapshot.val();

                      UserUpdate.perform(user, pokemons).then(() => {
                        getUserRef().set(user).then(listens);
                      });
                    });
                  } else {
                    listens();
                  }
                });
              });
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
          }
        });
      };
    },
    signup(email, password, locale) {
      return (dispatch) => {
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
          }).catch((error) => {
            dispatch({
              type: 'SET_AUTH_ERROR',
              errors: { signup: error },
            });
          });
      };
    },
    signin(email, password) {
      return (dispatch) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
          .catch((error) => {
            dispatch({
              type: 'SET_AUTH_ERROR',
              errors: { signin: error },
            });
          });
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
    setCollected(index, collected) {
      return () => {
        getUserRef()
          .child('pokedex')
          .child('pokemons')
          .child(index)
          .child('collected')
          .set(collected);
      };
    },
    setTag(index, tag) {
      return () => {
        getUserRef()
          .child('pokedex')
          .child('pokemons')
          .child(index)
          .child('tag')
          .set(tag);
      };
    },
    setSettingsPublic(isPublic) {
      return () => {
        getUserRef().child('pokedex/settings/public').set(isPublic);
      };
    },
    setSettingsUsername(username) {
      return () => {
        getUserRef().child('pokedex/settings/username').set(username);
        getRootRef().child('usernames').child(firebase.auth().currentUser.uid).set(username);
      };
    },
    setSettingsTagTitle(tag, title) {
      return () => {
        getUserRef().child('pokedex/settings/tags/' + tag + '/title').set(title);
      };
    },
  },
  ui: {
    setCurrentBox(currentBox) {
      return (dispatch) => {
        dispatch({ type: 'SET_CURRENT_BOX', currentBox });
      };
    },
    loadPublicPokedex(username) {
      return (dispatch) => {
        if (username) {
          getRootRef().child('usernames').orderByValue().equalTo(username).once('child_added', (snapshot) => {
            const uid = snapshot.key;

            getRootRef().child('users').child(uid).child('pokedex').once('value', (snapshot) => {
              const publicPokedex = snapshot.val();

              if (publicPokedex.settings.public) {
                dispatch({ type: 'SET_PUBLIC_POKEDEX', publicPokedex });
              } else {
                dispatch({ type: 'SET_PUBLIC_POKEDEX', publicPokedex: false });
              }
            }, () => {
              dispatch({ type: 'SET_PUBLIC_POKEDEX', publicPokedex: false });
            });
          }, () => {
            dispatch({ type: 'SET_PUBLIC_POKEDEX', publicPokedex: false });
          });
        } else {
          dispatch({ type: 'SET_PUBLIC_POKEDEX', publicPokedex: null });
        }
      };
    },
    toggleFilter(filter) {
      return (dispatch) => {
        dispatch({ type: 'TOGGLE_FILTER', filter });
      };
    },
    resetFilter() {
      return (dispatch) => {
        dispatch({ type: 'RESET_FILTER' });
      };
    }
  },
};

export default actions;
