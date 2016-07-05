const actions = {
  setPokedex(pokedex) {
    return (dispatch) => {
      dispatch({
        type: 'SET_POKEDEX',
        payload: { pokedex },
      });
    };
  },
  setCurrentBox(currentBox) {
    return (dispatch) => {
      dispatch({
        type: 'SET_CURRENT_BOX',
        payload: { currentBox },
      });
    };
  },
  addFilter(filter) {
    return (dispatch) => {
      dispatch({
        type: 'ADD_FILTER',
        payload: { filter },
      });
    };
  },
  resetFilters() {
    return (dispatch) => {
      dispatch({
        type: 'RESET_FILTERS',
      });
    };
  },
};

export default actions;
