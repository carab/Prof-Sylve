import initial from '../store/initial';

export default (state = initial.profile, action) => {
  switch (action.type) {

    case 'SET_PROFILE':
      return Object.assign({}, state, action.payload);

    default: return state;
  }
};
