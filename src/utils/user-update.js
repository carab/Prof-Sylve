'use strict';

import _ from 'lodash';

const updates = {
  'v0.12.0': function(user, pokemons) {
    // Create Pokédex from old collected and tags array
    // And create profile and tags

    return new Promise(function(resolve, reject) {
      // Update tags
      const tags = {};

      if (user.settings) {
        let i = 0;
        _.forEach(user.settings.colors, (title, color) => {
          tags[color] = {
            color,
            title,
          };
        });
      }

      // Create profile
      user.profile = {
        locale: user.settings && user.settings.locale || user.profile.locale,
        friends: [],
        public: false,
        tags: tags,
      };

      // Create Pokédex
      user.pokedex = [];
      _.forEach(pokemons, (pokemon, index) => {
        user.pokedex.push({
          id: pokemon.id,
          name: pokemon.name,
          collected: user.collected && user.collected[pokemon.id] && true || false,
          tag: false,
        });
      });

      resolve();
    });
  },
};

class UserUpdate {
  constructor() {

  }

  needs(user) {
    const version = user.version;
    const versions = Object.keys(updates);
    const versionIndex = versions.indexOf(version);

    return (versionIndex < versions.length-1);
  }

  perform(user, pokemons) {
    const version = user.version;
    const versions = Object.keys(updates);
    const nextVersionIndex = versions.indexOf(version) + 1;

    const performUpdate = function(currentVersionIndex) {
      const currentVersion = versions[currentVersionIndex];

      return new Promise((resolve, reject) => {
        if (_.isString(currentVersion)) {
          const currentUpdate = updates[currentVersion];
          currentUpdate(user, pokemons).then(() => {
            user.version = currentVersion;
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
