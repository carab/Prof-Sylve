const initialState = {
  locale: undefined,
  username: undefined,
  friends: [],
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        ...(action.payload ?? initialState),
      };

    default:
      return state;
  }
}
