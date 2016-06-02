'use strict';

import _ from 'lodash';

const updates = {
  'v0.12.0': function(user, pokemons) {
    // Create Pokédex from old collected and tags array
    // And create profile and tags

    return new Promise(function(resolve) {
      // Update tags
      const tags = {};

      if (user.settings) {
        _.forEach(user.settings.colors, (title, color) => {
          tags[color] = {
            color,
            title,
          };
        });
      }

      // Create profile
      user.profile = Object.assign({}, user.profile || {}, {
        public: false,
        tags: tags,
      });

      // Create Pokédex
      user.pokedex = [];
      _.forEach(pokemons, (pokemon) => {
        user.pokedex.push({
          id: pokemon.id,
          name: pokemon.name,
          collected: user.collected && user.collected[pokemon.id] && true || false,
          tag: 'none',
        });
      });

      resolve();
    });
  },
  'v0.16.0': function(user) {
    // Replace false value on tag by 'none'
    return new Promise(function(resolve) {
      // Create Pokédex
      _.forEach(user.pokedex, (pokemon) => {
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

  needs(user) {
    const version = user.profile && user.profile.version;
    const versions = Object.keys(updates);
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
