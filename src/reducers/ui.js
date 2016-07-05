import Immutable from 'immutable';

import initial from '../store/initial';

export default (state = initial.ui, action) => {
  switch (action.type) {

    case 'SET_CURRENT_BOX':
      return Object.assign({}, state, action.payload);

    case 'SET_POKEDEX':
      return Object.assign({}, state, action.payload);

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
