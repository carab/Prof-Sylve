import Immutable from 'immutable';

export default {
  feedback: [],
  auth: {
    currently: 'AUTH_GUEST',
    isReady: false,
    isSignedIn: false,
    data: {},
    errors: {},
  },
  profile: {
    locale: null,
    friends: [],
  },
  pokedex: {
    settings: {
      username: '',
      public: false,
      tags: {},
    },
    pokemons: [],
  },
  ui: {
    currentBox: 0,
    publicPokedex: null,
    filters: Immutable.List([]),
  },
};
