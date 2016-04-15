import { combineReducers } from 'redux';
import pokemons from './pokemons';
import user from './user';

const ProfSylveApp = combineReducers({
  pokemons,
  user,
})

export default ProfSylveApp;
