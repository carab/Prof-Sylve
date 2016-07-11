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
    filtered: Immutable.List(), // Filtered Pokémons on PC (by box) or List (by search of filters)
    selected: Immutable.Map(), // Selected Pokémons for mass-actions
    selecting: false, // true if at least one Pokémon is selected
    currentPokemon: undefined,
  },
};
