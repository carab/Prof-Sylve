import FirebaseUtils from '../utils/firebase-utils';

const pokemonsRef = FirebaseUtils.getRootRef().child('pokemons');

const pokemonsActions = {
  startListeningToPokemons() {
    return (dispatch) => {
      pokemonsRef.on('value', (snapshot) => {
        dispatch({ type: 'RECEIVE_POKEMONS_DATA', data: snapshot.val() });
      });
    };
  }
};

export default pokemonsActions;
