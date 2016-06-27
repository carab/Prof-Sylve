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

    case 'TOGGLE_FILTER':
      index = state.filters.findIndex(function(_filter) {
        return _filter.name === action.filter.name;
      });

      if (index === -1) {
        // If the filter is not present, just add it
        filters = state.filters.push(action.filter);
      } else if (state.filters.get(index).hash === action.filter.hash) {
        // If the filter is present and has the same hash, remove it
        filters = state.filters.splice(index, 1);
      } else {
        // If the filter is present and has a different hash, replace it
        filters = state.filters.set(index, action.filter);
      }

      return Object.assign({}, state, {
        filters: filters,
      });

    case 'RESET_FILTER':
      return Object.assign({}, state, {
        filters: initial.ui.filters,
      });

    default: return state;
  }
};
