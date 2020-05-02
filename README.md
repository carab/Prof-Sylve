Prof. Sylve's Living Dex
========================

This webapp allows you to keep track of the Pokémon you collected for your Living Dex.
If you don't know what is a Living Dex, here is the explanation : http://bulbapedia.bulbagarden.net/wiki/Living_Pokédex

This project was born because none of the existing tools fit my expectations :

- Simple
- Mobile-friendly

So please enjoy using this if you need it too, and don't hesitate to ask for features or even to contribute.

## Features

- [x] Pokémon can be marked as "collected" (not all of them are really captured!).
- [x] Pokémon can be tagged with a color. You can rename a color to match your specific needs, such as "to evolve", "to breed" or "to capture in XY".
- [x] Pokémons listed in grids to replicate in-game boxes.
- [x] Simple list with filters (collected, not collected, by tag).
- [x] Multi-language support (app: en/fr, Pokémon names: en/fr/es/it/de/jp/ko/cn)
- [x] Link to language-specific wiki to find location data or other information.
- [x] Mobile-friendly.
- [x] User accounts.
- [x] Easy search.
- [x] Share Pokédex progress.
- [ ] Location data.
- [ ] List public Pokédexes.
- [ ] Exchange market place ?

## Contributing

As the project is built on the react-webpack Yeoman generator, you can read its readme to know how to start developing : https://github.com/newtriks/generator-react-webpack
I'm open to suggestions and reviews concerning the code, as it is my first React application.

## Why "Prof. Sylve" ?

Because a good friend of mine once said "I should be a Pokémon Professor".

## How to add a Pokémon ?

1. Update the file `data/pokemons.json` with the Pokémon identifier from [Veekun's Pokédex pokemon.csv](https://github.com/veekun/pokedex/blob/master/pokedex/data/csv/pokemon.csv).
2. Update the translation files in `src/translations/*.json` with the localized Pokémon name from [Veekun's Pokédex pokemon_species_names.csv](https://github.com/veekun/pokedex/blob/master/pokedex/data/csv/pokemon_species_names.csv).
3. Follow instructions on [Prof-Sylve-Sprites](https://github.com/carab/Prof-Sylve-Sprites) to add Pokémon image.
4. Import `data/pokemons.json` in [Firebase](https://console.firebase.google.com/u/0/project/prof-sylve/database/prof-sylve/data/~2Fpokemons) on the path `/pokemons`.

## Credits

Thanks to [PkParaiso](http://www.pkparaiso.com/) for creating the awesome gifs used in this app.
Thanks to [Veekun's Pokédex](https://github.com/veekun/pokedex) for providing all the data needed in this app.
