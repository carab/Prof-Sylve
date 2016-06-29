import Immutable from 'immutable';

import initial from '../store/initial';

export default (state = initial.ui, action) => {
  let index, filters;

  switch (action.type) {

    case 'SET_CURRENT_BOX':
      return Object.assign({}, state, {
        currentBox: action.currentBox,
      });

    case 'SET_PUBLIC_POKEDEX':
      return Object.assign({}, state, {
        publicPokedex: action.publicPokedex,
      });

    case 'ADD_FILTER':
      return Object.assign({}, state, {
        filters: state.filters.set(action.filter.name, action.filter),
      });

    case 'RESET_FILTERS':
      return Object.assign({}, state, {
        filters: initial.ui.filters,
      });

    default: return state;
  }
};
