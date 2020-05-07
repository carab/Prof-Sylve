import firebase from 'utils/firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
};

const actions = {
  setCollected(id, collected) {
    return () => {
      if (collected) {
        refs.user().child(`pokedex/pokemons/${id}/collected`).set(collected);
      } else {
        refs.user().child(`pokedex/pokemons/${id}/collected`).remove();
      }
    };
  },
  setTag(id, tag) {
    return () => {
      if (tag) {
        refs.user().child(`pokedex/pokemons/${id}/tag`).set(tag);
      } else {
        refs.user().child(`pokedex/pokemons/${id}/tag`).remove();
      }
    };
  },
  setSettingsPublic(_public) {
    return () => {
      const uid = firebase.auth().currentUser.uid;

      if (_public) {
        refs.user().child('pokedex/settings/public').set(_public);
        return refs.root().child(`public_pokedex_lookup/${uid}`).set(_public);
      } else {
        refs.user().child('pokedex/settings/public').remove();
        return refs.root().child(`public_pokedex_lookup/${uid}`).remove();
      }
    };
  },
  setSettingsTag(tag, title) {
    return () => {
      if (title) {
        refs.user().child(`pokedex/settings/tags/${tag}`).set(title);
      } else {
        refs.user().child(`pokedex/settings/tags/${tag}`).remove();
      }
    };
  },
};

export default actions;
