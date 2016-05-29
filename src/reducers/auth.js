import initial from '../store/initial';

export default (state = initial.auth, action) => {
  switch (action.type) {

    case 'SET_AUTH':
      return Object.assign({}, state, action.auth);

    default: return state;
  }
};
