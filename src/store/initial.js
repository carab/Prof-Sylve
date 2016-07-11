import Immutable from 'immutable';

export default {
  feedback: [],
  auth: {
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
  ui: {
    pokedexes: Immutable.Map(),
    currentUsername: undefined,
    currentBox: 0,
    filters: Immutable.Map(),
    title: undefined,
    selected: Immutable.Map(), // Selected Pokémons for mass-actions
    selectionMode: false, // true if Pokémons are selected
  },
};
