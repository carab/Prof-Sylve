import Immutable from 'immutable';

import initial from '../store/initial';

export default (state = initial.ui, action) => {
  let selected;

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

    case 'SET_FILTERED':
      return Object.assign({}, state, {
        filtered: Immutable.List(action.payload),
      });

    case 'SET_SELECTED':
      if (action.payload.selected) {
        selected = state.selected.set(action.payload.id, action.payload.selected);
      } else {
        selected = state.selected.delete(action.payload.id);
      }

      return Object.assign({}, state, {
        selected,
        selecting: (selected.size > 0),
      });

    case 'RESET_SELECTED':
      return Object.assign({}, state, {
        selected: initial.ui.selected,
        selecting: false,
      });

    case 'SET_CURRENT_POKEMON':
      return Object.assign({}, state, {
        currentPokemon: action.payload,
      });

    default: return state;
  }
};
