import Immutable from 'immutable';
import { getDefaultLocale } from 'components/LocaleProvider';

export const initialState = {
  locale: getDefaultLocale(),
  currentUsername: undefined,
  currentPokedex: undefined,
  currentPokemon: undefined,
  mediaQuery: {
    downSm: false,
    upSm: true,
    downMd: false,
    upMd: true,
  },
  currentBox: 1,
  filters: Immutable.Map(),
  title: undefined,
  filtered: Immutable.List(), // Filtered Pokémons on PC (by box) or List (by search of filters)
  selected: Immutable.Map(), // Selected Pokémons for mass-actions
  selecting: false, // true if at least one Pokémon is selected
};

export default (state = initialState, action) => {
  let selected;

  switch (action.type) {
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload,
      };

    case 'SET_CURRENT_BOX':
      return {
        ...state,
        currentBox: action.payload,
      };

    case 'SET_CURRENT_POKEDEX':
      return {
        ...state,
        currentPokedex: action.payload,
      };

    case 'SET_CURRENT_USERNAME':
      return {
        ...state,
        currentUsername: action.payload,
      };

    case 'SET_CURRENT_POKEMON':
      return {
        ...state,
        currentPokemon: action.payload,
      };

    case 'SET_TITLE':
      return Object.assign({}, state, { title: action.payload });

    case 'ADD_FILTER':
      return Object.assign({}, state, {
        filters: state.filters.set(action.payload.filter.name, action.payload.filter),
      });

    case 'RESET_FILTERS':
      return Object.assign({}, state, {
        filters: initialState.filters,
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
        selecting: selected.size > 0,
      });

    case 'RESET_SELECTED':
      return Object.assign({}, state, {
        selected: initialState.selected,
        selecting: false,
      });

    case 'SET_MEDIA_QUERY':
      return {
        ...state,
        mediaQuery: {
          ...state.mediaQuery,
          [action.payload.name]: action.payload.value,
        },
      };

    default:
      return state;
  }
};
