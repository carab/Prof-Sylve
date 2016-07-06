import firebase from 'firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
};

const actions = {
  setLocale(locale) {
    return (dispatch) => {
      dispatch({
        type: 'SET_PROFILE',
        payload: { locale },
      });

      if (firebase.auth().currentUser) {
        refs.user().child('profile/locale').set(locale);
      }
    };
  },
  setProfile(profile) {
    return (dispatch) => {
      dispatch({
        type: 'SET_PROFILE',
        payload: profile,
      });

      refs.user().child('profile').set(profile);
    };
  },
  setUsername(username, oldUsername) {
    return () => {
      // Add the new username and remove the old one only if it succeed
      refs.root().child(`username_lookup/${username}`).set(firebase.auth().currentUser.uid).then(() => {
        if (oldUsername) {
          refs.root().child(`username_lookup/${oldUsername}`).remove();
        }

        refs.user().child('profile/username').set(username);
      });
    };
  },
};

export default actions;
