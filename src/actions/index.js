import FirebaseUtils from '../utils/firebase-utils';

const actions = {
  startListeningToUser() {
    return (dispatch) => {
      let userRef;

      FirebaseUtils.onAuthStateChanged((user) => {
        if (user) {
          userRef = FirebaseUtils.getRootRef().child('users').child(user.uid);
          userRef.on('value', (snapshot) => {
            dispatch({ type: 'RECEIVE_USER_DATA', data: snapshot.val() });
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

  pokemonCollected(pokemon, collected) {
    return () => {
      const collectedRef = FirebaseUtils.getUserRef().child('collected').child(pokemon.id);

      if (collected) {
        collectedRef.set(true);
      } else {
        collectedRef.remove();
      }
    };
  },

  pokemonTagRemove(pokemon) {
    return () => {
      const tagRef = FirebaseUtils.getUserRef().child('tags').child(pokemon.id);
      tagRef.remove();
    };
  },

  pokemonTagColor(pokemon, color) {
    return () => {
      const colorRef = FirebaseUtils.getUserRef().child('tags').child(pokemon.id).child('color');
      colorRef.set(color)
    };
  },

  pokemonTagForce(pokemon, force) {
    return () => {
      const forceRef = FirebaseUtils.getUserRef().child('tags').child(pokemon.id).child('force');
      forceRef.set(force)
    };
  },
};

export default actions;
