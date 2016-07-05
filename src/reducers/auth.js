import initial from '../store/initial';

export default (state = initial.auth, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return Object.assign({}, state, action.payload);

    case 'SET_AUTH_ERROR':
      return Object.assign({}, state, { errors: action.errors });

    default: return state;
  }
};
