import firebase from 'utils/firebase';

const rootRef = firebase.database().ref();

const actions = {
  setProfile(profile) {
    return {
      type: 'SET_PROFILE',
      payload: profile,
    };
  },
  setLocale(locale) {
    return (dispatch) => {
      dispatch({
        type: 'SET_PROFILE',
        payload: { locale },
      });

      const uid = firebase.auth().currentUser?.uid;

      if (uid) {
        rootRef.child(`users/${uid}/profile/locale`).set(locale);
      }
    };
  },
  setUsername(username, previousUsername) {
    return async () => {
      const uid = firebase.auth().currentUser?.uid;

      if (uid) {
        if (previousUsername) {
          try {
            await rootRef.child(`username_lookup/${previousUsername}`).remove();
          } catch (error) {
            console.error(error);
          }
        }

        try {
          await rootRef.child(`username_lookup/${username}`).set(uid);

          return await rootRef.child(`users/${uid}/profile/username`).set(username);
        } catch (error) {
          console.error(error);
        }
      }
    };
  },
};

export default actions;
