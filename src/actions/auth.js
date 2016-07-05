import firebase from 'firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
}

const actions = {
  listenToAuth() {
    return (dispatch) => {
      firebase.auth().onAuthStateChanged((authData) => {
        // Is signed in
        if (authData) {

          // Load user profile
          refs.user().child('profile').on('value', (snapshot) => {
            const profile = snapshot.val();

            dispatch({
              type: 'SET_PROFILE',
              payload: profile,
            });

            // Load user pokedex and add it to the pokedexes
            refs.user().child('pokedex').on('value', (snapshot) => {
              const pokedex = snapshot.val();

              dispatch({
                type: 'SET_POKEDEX',
                payload: pokedex,
                meta: { username: profile.username },
              });
            });
          });

          dispatch({
            type: 'SET_AUTH',
            payload: {
              ready: true,
              signedIn: true,
              data: authData,
            },
          });
        } else {
          dispatch({
            type: 'SET_AUTH',
            payload: {
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
          refs.root().child('users').child(user.uid).set({
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
};

export default actions;
