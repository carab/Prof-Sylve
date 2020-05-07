import firebase from 'utils/firebase';

let unsubscribeFromAuth;

const actions = {
  startAuth() {
    return (dispatch) => {
      if (!unsubscribeFromAuth) {
        unsubscribeFromAuth = firebase.auth().onAuthStateChanged((user, error) => {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              ready: true,
              signed: Boolean(user),
              user,
            },
          });
        });
      }
    };
  },
  stopAuth() {
    return () => {
      if (unsubscribeFromAuth) {
        unsubscribeFromAuth();
      }
    };
  },
  signup(email, password) {
    return async (dispatch) => {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);

        return await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        dispatch({
          type: 'SET_AUTH_ERROR',
          errors: { signup: error },
        });
      }
    };
  },
  signin(email, password) {
    return async (dispatch) => {
      try {
        return await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (error) {
        dispatch({
          type: 'SET_AUTH_ERROR',
          errors: { signin: error },
        });
      }
    };
  },
  signout() {
    return (dispatch) => {
      dispatch({
        type: 'SET_AUTH',
        payload: {
          ready: true,
          signed: false,
          user: {},
        },
      });

      return firebase.auth().signOut();
    };
  },
};

export default actions;
