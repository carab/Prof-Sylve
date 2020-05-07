/**
 * Script to move and rename every needed sprite from https://www.pokekalos.fr/jeux/tools/download.html
 */

const fs = require('fs');
const pokemons = require('../data/pokemons.json');

const srcFolder = '../../home_sprites/';
const distFolder = '../sprites/';

const srcFilenameTemplates = [
  'poke_capture_{id}_000_mf_n_00000000_f_n.png',
  'poke_capture_{id}_000_fo_n_00000000_f_n.png',
  'poke_capture_{id}_000_uk_n_00000000_f_n.png',
  'poke_capture_{id}_000_fd_n_00000000_f_n.png',
  'poke_capture_{id}_000_mo_n_00000000_f_n.png',
];

const distFilenameTemplate = '{id}.png';

const iterateSrcFilenameTemplates = (id, srcFilenameTemplates, resolve, reject) => {
  const srcFilenameTemplate = srcFilenameTemplates[0];

  const srcFilename = srcFilenameTemplate.replace('{id}', id);
  const distFilename = distFilenameTemplate.replace('{id}', id);

  fs.copyFile(srcFolder + srcFilename, distFolder + distFilename, (err) => {
    if (err) {
      const slicedSrcFilenameTemplates = srcFilenameTemplates.slice(1);
      if (slicedSrcFilenameTemplates.length) {
        iterateSrcFilenameTemplates(id, slicedSrcFilenameTemplates, resolve, reject);
      } else {
        reject();
      }
    } else {
      resolve();
    }
  });
};

pokemons.forEach((value) => {
  const id = value.id.padStart(4, 0);

  const promise = new Promise((resolve, reject) => {
    iterateSrcFilenameTemplates(id, srcFilenameTemplates, resolve, reject);
  });

  promise.catch(() => {
    console.error(`Sprite not found for #${id}`);
  });
});
