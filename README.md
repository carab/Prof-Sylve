Prof. Sylve's Living Dex
========================

This webapp allows you to keep track of the Pokémon you collected for your Living Dex.
If you don't know what is a Living Dex, here is the explanation : http://bulbapedia.bulbagarden.net/wiki/Living_Pokédex

This project was born because none of the existing tools fit my expectations :

- Simple
- Mobile-friendly

So please enjoy using this if you need it too, and don't hesitate to ask for features or even to contribute.

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

Thanks to the team behind [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
