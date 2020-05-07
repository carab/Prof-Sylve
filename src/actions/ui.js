const actions = {
  setLocale(locale) {
    return {
      type: 'SET_LOCALE',
      payload: locale,
    };
  },
  setCurrentUsername(currentUsername) {
    return {
      type: 'SET_CURRENT_USERNAME',
      payload: currentUsername,
    };
  },
  setCurrentPokedex(currentPokedex) {
    return {
      type: 'SET_CURRENT_POKEDEX',
      payload: currentPokedex,
    };
  },
  setCurrentBox(currentBox) {
    return {
      type: 'SET_CURRENT_BOX',
      payload: currentBox,
    };
  },
  setCurrentPokemon(currentPokemon) {
    return {
      type: 'SET_CURRENT_POKEMON',
      payload: currentPokemon,
    };
  },
  addFilter(filter) {
    return {
      type: 'ADD_FILTER',
      payload: { filter },
    };
  },
  resetFilters() {
    return {
      type: 'RESET_FILTERS',
    };
  },
  setTitle(title) {
    return {
      type: 'SET_TITLE',
      payload: title,
    };
  },
  setFiltered(filtered) {
    return {
      type: 'SET_FILTERED',
      payload: filtered,
    };
  },
  setSelected(id, selected) {
    return {
      type: 'SET_SELECTED',
      payload: { id, selected },
    };
  },
  resetSelected() {
    return {
      type: 'RESET_SELECTED',
    };
  },
  setMenuOpen(id) {
    return {
      type: 'SET_MENU_OPEN',
      payload: id,
    };
  },
  setMediaQuery(name, value) {
    return {
      type: 'SET_MEDIA_QUERY',
      payload: { name, value },
    };
  },
};

export default actions;
