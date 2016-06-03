import initial from '../store/initial';

export default (state = initial.ui, action) => {
  switch (action.type) {

    case 'SET_CURRENT_BOX':
      return Object.assign({}, state, {
        currentBox: action.currentBox,
      });

    case 'SET_PUBLIC_POKEDEX':
      return Object.assign({}, state, {
        publicPokedex: action.publicPokedex,
      });

    default: return state;
  }
};
