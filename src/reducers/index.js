import { combineReducers } from 'redux';

import auth from './auth';
import profile from './profile';
import pokedex from './pokedex';
import ui from './ui';

export default combineReducers({
  auth,
  profile,
  pokedex,
  ui,
});
