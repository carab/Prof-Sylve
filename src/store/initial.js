import Immutable from 'immutable';

export default {
  feedback: [],
  auth: {
    currently: 'AUTH_GUEST',
    ready: false,
    signedIn: false,
    data: {},
    errors: {},
  },
  profile: {
    locale: null,
    username: undefined,
    email: undefined,
    friends: [],
  },
  pokedex: {
    settings: {
      public: false,
      tags: {},
    },
    pokemons: [],
  },
  ui: {
    pokedexes: Immutable.Map(),
    currentPokedex: undefined,
    currentBox: 0,
    publicPokedex: null,
    filters: Immutable.Map(),
  },
};
