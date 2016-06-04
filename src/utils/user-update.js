'use strict';

import _ from 'lodash';

const updates = {
  '0.12.0': function(user, pokemons) {
    // Fill Pokédex and init profile
    // And create profile and tags

    return new Promise(function(resolve) {
      // Create profile
      user.profile = Object.assign({}, user.profile || {}, {
        // ?
      });

      // Create Pokédex
      user.pokedex = {
        public: false,
        pokemons: [],
      };

      _.forEach(pokemons, (pokemon) => {
        user.pokedex.pokemons.push({
          id: pokemon.id,
          name: pokemon.name,
          collected: user.collected && user.collected[pokemon.id] && true || false,
          tag: false,
        });
      });

      resolve();
    });
  },
  '0.16.0': function(user) {
    // Replace false value on tag by 'none'
    return new Promise(function(resolve) {
      // Create Pokédex
      _.forEach(user.pokedex.pokemons, (pokemon) => {
        if (pokemon.tag === false) {
          pokemon.tag = 'none';
        }
      });

      resolve();
    });
  },
};

class UserUpdate {
  constructor() {

  }

  check(user, appVersion) {
    const version = user.profile && user.profile.version;
    const versions = Object.keys(updates);
    const lastVersion = versions[versions.length-1];

    // Check that the last version in the file is the same than the the config
    // stored in firebase. If not, the page is reloaded to empty the cache and
    // load the updated file with the proper versions.
    if (appVersion !== lastVersion) {
      window.location.reload(true);
    }

    const versionIndex = versions.indexOf(version);

    return (versionIndex < versions.length-1);
  }

  perform(user, pokemons) {
    const version = user.profile && user.profile.version;
    const versions = Object.keys(updates);
    const nextVersionIndex = versions.indexOf(version) + 1;

    const performUpdate = function(currentVersionIndex) {
      const currentVersion = versions[currentVersionIndex];

      return new Promise((resolve) => {
        if (_.isString(currentVersion)) {
          const currentUpdate = updates[currentVersion];
          currentUpdate(user, pokemons).then(() => {
            user.profile.version = currentVersion;
            performUpdate(++currentVersionIndex).then(() => {
              resolve(user, pokemons);
            });
          });
        } else {
          resolve(user, pokemons);
        }
      });
    };

    return performUpdate(nextVersionIndex);
  }
}

export default new UserUpdate;
