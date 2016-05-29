import initial from '../store/initial';

export default (state = initial.pokedex, action) => {
  switch (action.type) {

    case 'SET_POKEDEX':
      return action.pokedex || state;

    default: return state;
  }
};
