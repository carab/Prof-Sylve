import initial from '../store/initial';

export default (state = initial.pokemons, action) => {
  switch (action.type) {

    case 'RECEIVE_POKEMONS_DATA':
      return Object.assign({}, state, {
        hasReceived: true,
        data: action.data,
      });

    default:
      return state;
  }
};
