Prof. Sylve's Living Dex
========================

This webapp allows you to keep track of the Pokémon you already collected for your Living Dex.
If you don't know what is a Living Dex, here is the explanation : http://bulbapedia.bulbagarden.net/wiki/Living_Pokédex

This project was born because none of the existing tools fit my expectations :

- Simple
- Mobile-friendly

So please enjoy using this if you need it too, and don't hesitate to ask for features or even to contribute.

## Features

- [x] Mobile-friendly.
- [x] User accounts.
- [x] Pokémons listed in grids to replicate in-game boxes.
- [x] Checkbox by Pokémon to mark them as collected.
- [ ] Implement a search.
- [ ] Multi-language support.
- [ ] Location data.
- [ ] Filters on simple list (by Region, collected or not, ...).
- [ ] Share user progress.
- [ ] Exchange market place ?

## Technical todos

- Use Redux instead of playing stupidly with Firebase.
- Add left sidebar to navigate between grid and list.
- Add settings page (language, password, email, delete account, reset living dex).
- Add unit-tests maybe ?
- Better grid on mobile would help.

## Changelog

### v0.5.0

- Fusion sign in and sign up pages.

### v0.4.0

- Fix some Pokémon names to match their image file name.
- Improve the grid UI by adding navigation through boxes and a user menu.
- Fix Firebase index rewrite.

### v0.3.0

- Add router.
- Add user account.
- Add opacity change for collected Pokémon.

### v0.2.0

- Technical fixes.

### v0.1.0

- Grid of all Pokémon.
- Mark a Pokémon as collected.

## Contributing

As the project is built on the react-webpack Yeoman generator, you can read its readme to know how to start developing : https://github.com/newtriks/generator-react-webpack
I'm open to suggestions and reviews concerning the code, as it is my first React application.

## Why "Prof. Sylve" ?

Because a good friend of mine once said "I should be a Pokémon Professor".

## Credits

Thanks to [PkParaiso](http://www.pkparaiso.com/) for creating the awesome gifs used in this app.
