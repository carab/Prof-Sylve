import initial from '../store/initial';

export default (state = initial.user, action) => {
  switch (action.type) {

    case 'RECEIVE_USER_DATA':
      return Object.assign({}, state, {
        hasReceived: true,
        data: action.data,
      });

    case 'RESET_USER_DATA':
      return Object.assign({}, state, initial.user);

    default: return state;
  }
};
