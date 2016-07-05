import firebase from 'firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
}

const actions = {
  listen(username) {
    return (dispatch) => {
      refs.root().child('username_lookup').child(username).once('value', (snapshot) => {
        // Remove previous listening
        if (refs.pokedex) {
          refs.pokedex.off();
        }

        const uid = snapshot.val();

        if (uid) {
          refs.pokedex = refs.root().child('users').child(uid).child('pokedex');
          refs.pokedex.on('value', (snapshot) => {
            const pokedex = snapshot.val();

            dispatch({
              type: 'SET_POKEDEX',
              payload: {
                pokedex,
                username,
                ready: true,
              },
            });
          });
        }
      })
    };
  },
};

export default actions;
