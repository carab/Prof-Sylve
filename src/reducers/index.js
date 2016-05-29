import { combineReducers } from 'redux';

import auth from './auth';
import profile from './profile';
import pokedex from './pokedex';

export default combineReducers({
  auth,
  profile,
  pokedex,
});
