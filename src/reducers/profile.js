import initial from '../store/initial';

export default (state = initial.profile, action) => {
  switch (action.type) {

    case 'SET_LOCALE':
      return Object.assign({}, state, {
        locale: action.locale,
      });

    case 'SET_PROFILE':
      return Object.assign({}, state, action.profile);

    default: return state;
  }
};
