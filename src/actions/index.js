import firebase from 'firebase';

import './configure-firebase';

import auth from './auth';
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
  auth,
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
