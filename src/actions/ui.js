import firebase from 'utils/firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
};

const actions = {
  loadPokedex(username) {
    return (dispatch) => {
      var handleError = (error) => {
        dispatch({
          type: 'SET_POKEDEX',
          payload: error,
          error: true,
          meta: { username },
        });
      };

      refs.root().child(`username_lookup/${username}`).once('value', (snapshot) => {
        const uid = snapshot.val();

        if (uid) {
          refs.root().child(`users/${uid}/pokedex`).once('value', (snapshot) => {
            const pokedex = snapshot.val();

            dispatch({
              type: 'SET_POKEDEX',
              payload: pokedex,
              meta: { username },
            });
          }, handleError);
        } else {
          handleError(new Error('Username does not exist.'));
        }
      }, handleError);
    };
  },
  setCurrentUsername(currentUsername) {
    return (dispatch) => {
      dispatch({
        type: 'SET_CURRENT_USERNAME',
        payload: currentUsername,
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
  setTitle(title) {
    return (dispatch) => {
      dispatch({
        type: 'SET_TITLE',
        payload: title,
      });
    };
  },
  setFiltered(filtered) {
    return (dispatch) => {
      dispatch({
        type: 'SET_FILTERED',
        payload: filtered,
      });
    };
  },
  setSelected(id, selected) {
    return (dispatch) => {
      dispatch({
        type: 'SET_SELECTED',
        payload: { id, selected },
      });
    };
  },
  resetSelected() {
    return (dispatch) => {
      dispatch({
        type: 'RESET_SELECTED',
      });
    };
  },
  setCurrentPokemon(id) {
    return (dispatch) => {
      dispatch({
        type: 'SET_CURRENT_POKEMON',
        payload: id,
      });
    };
  },
  setMenuOpen(id) {
    return (dispatch) => {
      dispatch({
        type: 'SET_MENU_OPEN',
        payload: id,
      });
    };
  },
};

export default actions;
