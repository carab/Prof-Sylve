Prof. Sylve's Living Dex
========================

This webapp allows you to keep track of the Pokémon you already collected for your Living Dex.
If you don't know what is a Living Dex, here is the explanation : http://bulbapedia.bulbagarden.net/wiki/Living_Pokédex

This project was born because none of the existing tools fit my expectations :

- Simple
- Mobile-friendly

So please enjoy using this if you need it too, and don't hesitate to ask for features or even to contribute.

## Features

- [x] Pokémon can be marked as "collected".
- [x] Pokémon can be tagged with a color. You can rename a color to match your specific needs, such as "to evolve", "to breed" or "to capture in XY".
- [x] Pokémons listed in grids to replicate in-game boxes.
- [x] Simple list with filters (collected, not collected, by tag).
- [x] Multi-language support (app: en/fr, Pokémon names: en/fr/es/it/de/jp/ko/cn)
- [x] Link to language-specific wiki to find location data or other information.
- [x] Mobile-friendly.
- [x] User accounts.
- [ ] Add more filters (by generation/region, by location, ...).
- [ ] Implement a search.
- [ ] Location data.
- [ ] Share user progress.
- [ ] Exchange market place ?

## Technical todos

- Show "cancel" button when marking a Pokémon collected or tagging it.
- Add current box and filters in URL to keep them in history.
- Review box navigation and layout on mobile.
- Review list layout in desktop.
- Review settings layout and add account settings.
- Improve transitions when signing in, loading Pokémons, etc.
- Allow filters in grid, removing boxes when applied.
- Use Redux instead of playing stupidly with Firebase.
- Add unit-tests.

## Contributing

As the project is built on the react-webpack Yeoman generator, you can read its readme to know how to start developing : https://github.com/newtriks/generator-react-webpack
I'm open to suggestions and reviews concerning the code, as it is my first React application.

## Why "Prof. Sylve" ?

Because a good friend of mine once said "I should be a Pokémon Professor".

## Credits

Thanks to [PkParaiso](http://www.pkparaiso.com/) for creating the awesome gifs used in this app.
Thanks to [Veekun's Pokédex](https://github.com/veekun/pokedex) for providing all the data needed in this app.
