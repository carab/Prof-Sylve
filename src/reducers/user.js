import initial from '../store/initial';

export default (state = initial.user, action) => {
  switch (action.type) {

    case 'SET_USER_LOCALE':
      const newState = Object.assign({}, state);
      newState.data.profile.locale = action.locale;
      return newState;

    case 'RECEIVE_USER_DATA':
      return Object.assign({}, state, {
        isLoaded: true,
        currently: 'AUTH_AUTHENTICATED',
        signedIn: true,
        data: action.data,
      });

    case 'RESET_USER_DATA':
      return Object.assign({}, state, initial.user, {
        isLoaded: true,
      });

    case 'RESET_USER_DATA':
      return Object.assign({}, state, initial.user);

    default: return state;
  }
};
