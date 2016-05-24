import FirebaseUtils from '../utils/firebase-utils';

const actions = {
  startListeningToUser() {
    return (dispatch) => {
      let userRef;

      FirebaseUtils.onAuthStateChanged((user) => {
        if (user) {
          userRef = FirebaseUtils.getRootRef().child('users').child(user.uid);
          userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            dispatch({ type: 'RECEIVE_USER_DATA', data });
          });
        } else {
          if (userRef) {
            userRef.off('value');
          }

          dispatch({ type: 'RESET_USER_DATA' });
        }
      });
    };
  },

  userProfileSet(profile) {
    return () => {
      FirebaseUtils.getUserRef()
        .child('profile')
        .set(profile);
    };
  },

  pokemonCollected(pokemon) {
    return () => {
      FirebaseUtils.getUserRef()
        .child('pokedex')
        .child(pokemon.id-1)
        .child('collected')
        .set(!pokemon.collected);
    };
  },

  pokemonTag(pokemon, tag) {
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
