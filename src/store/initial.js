export default {
  feedback: [],
  auth: {
    currently: 'AUTH_GUEST',
    isReady: false,
    isSignedIn: false,
    data: {},
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
  },
};
