import initial from '../store/initial';

export default (state = initial.auth, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        ...action.payload,
        user: action.payload.user ?? {},
      };

    case 'SET_AUTH_ERROR':
      return {
        ...state,
        errors: action.errors,
      };

    default:
      return state;
  }
};
