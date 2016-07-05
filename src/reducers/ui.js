import Immutable from 'immutable';

import initial from '../store/initial';

export default (state = initial.ui, action) => {
  switch (action.type) {

    case 'SET_CURRENT_BOX':
      return Object.assign({}, state, action.payload);

    case 'SET_POKEDEX':
      return Object.assign({}, state, {
        pokedexes: state.pokedexes.set(action.meta.username, action.payload),
      });

    case 'SET_CURRENT_USERNAME':
      return Object.assign({}, state, { currentUsername: action.payload });

    case 'SET_TITLE':
      return Object.assign({}, state, { title: action.payload });

    case 'ADD_FILTER':
      return Object.assign({}, state, {
        filters: state.filters.set(action.payload.filter.name, action.payload.filter),
      });

    case 'RESET_FILTERS':
      return Object.assign({}, state, {
        filters: initial.ui.filters,
      });

    default: return state;
  }
};
