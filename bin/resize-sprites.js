/**
 * Script to reisze original sprites to maximum 128px.
 */
const fs = require('fs');
const sharp = require('sharp');

const srcFolder = '../sprites/';
const distFolder = '../public/sprites/128/';

function resize(name) {
  const filepath = srcFolder + name;

  return sharp(fs.readFileSync(filepath))
    .resize(128, 128, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFile(distFolder + name)
    .then(() => console.log('Resized', filepath))
    .catch((e) => console.log('Failed resizing', filepath, e));
}

const promises = fs.readdirSync(srcFolder).map((name) => resize(name));

Promise.all(promises)
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
