Prof. Sylve's Living Dex
========================

This webapp allows you to keep track of the Pokémon you already collected for your Living Dex.
If you don't know what is a Living Dex, here is the explanation : http://bulbapedia.bulbagarden.net/wiki/Living_Pokédex

This project was born because none of the existing tools fit my expectations :

- Simple
- Mobile-friendly

So please enjoy using this if you need it too, and don't hesitate to ask for features or even to contribute.

## Features

- [x] Pokémons listed in grids to replicate in-game boxes.
- [x] Pokémon can be marked as "collected".
- [x] Pokémon can be tagged with a color. Use case is to match a color to a category, such as "to be evolved", "to breed" or "to capture in XY".
- [x] Multi-language support (app: en/fr, Pokémon names: en/fr/es/it/de/jp/ko/cn)
- [x] Link to language-specific wiki to find location data or other information.
- [x] Mobile-friendly.
- [x] User accounts.
- [ ] Implement a search.
- [ ] Location data.
- [ ] Filters on simple list (by generation/region, by location, collected or not, ...).
- [ ] Share user progress.
- [ ] Exchange market place ?

## Technical todos

- Use Redux instead of playing stupidly with Firebase.
- Add left sidebar to navigate between grid and list.
- Add settings page (language, password, email, delete account, reset living dex).
- Add unit-tests maybe ?
- Better grid on mobile would help.

## Contributing

As the project is built on the react-webpack Yeoman generator, you can read its readme to know how to start developing : https://github.com/newtriks/generator-react-webpack
I'm open to suggestions and reviews concerning the code, as it is my first React application.

## Why "Prof. Sylve" ?

Because a good friend of mine once said "I should be a Pokémon Professor".

## Credits

Thanks to [PkParaiso](http://www.pkparaiso.com/) for creating the awesome gifs used in this app.
Thanks to [Veekun's Pokédex](https://github.com/veekun/pokedex) for providing all the data needed in this app.
