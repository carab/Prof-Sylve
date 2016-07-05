import firebase from 'firebase';

import './configure-firebase';
import profile from './profile';
import ui from './ui';
//import pokedex from './pokedex';

function signedIn() {
  const authData = firebase.auth().currentUser;

  return authData && true;
}

function getRootRef() {
  return firebase.database().ref();
}

function getUserRef() {
  if (signedIn()) {
    const authData = firebase.auth().currentUser;

    return getRootRef()
      .child('users')
      .child(authData.uid);
  }
}

const actions = {
  profile,
  ui,
  //pokedex,
  auth: {
    listens() {
      return (dispatch) => {
        firebase.auth().onAuthStateChanged((authData) => {
          if (authData) {
            getUserRef().child('profile').on('value', (snapshot) => {
              dispatch({
                type: 'SET_PROFILE',
                profile: snapshot.val(),
              });

              dispatch({
                type: 'SET_AUTH',
                auth: {
                  currently: 'AUTH_AUTHENTICATED',
                  ready: true,
                  signedIn: true,
                  data: authData,
                },
              });
            });
          } else {
            dispatch({
              type: 'SET_AUTH',
              auth: {
                currently: 'AUTH_GUEST',
                ready: true,
                signedIn: false,
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
  pokedex: {
    setCollected(index, collected) {
      return () => {
        getUserRef().child(`pokedex/pokemons/${index}/collected`).set(collected);
      };
    },
    setTag(index, tag) {
      return () => {
        getUserRef().child(`pokedex/pokemons/${index}/tag`).set(tag);
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
        getUserRef().child(`pokedex/settings/tags/${tag}/title`).set(title);
      };
    },
  },
};

export default actions;
