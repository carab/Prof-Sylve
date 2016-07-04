import firebase from 'firebase';

const refs = {
  root: firebase.database().ref(),
}

const actions = {
  listen(username) {
    return (dispatch) => {
      refs.root.child('username_lookup').child(username).once('value', (snapshot) => {
        const uid = snapshot.val();

        // Remove previous listening
        if (refs.pokedex) {
          refs.pokedex.off();
        }

        refs.pokedex = refs.root.child('users').child(uid).child('pokedex');
        refs.pokedex.on('value', (snapshot) => {
          const pokedex = snapshot.val();
          
          dispatch({
            type: 'SET_POKEDEX',
            payload: { pokedex },
          });
        });
      })
    };
  },
};

export default actions;
