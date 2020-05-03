import _ from 'lodash';
import firebase from 'utils/firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
}

const actions = {
  listenToAuth() {
    return (dispatch) => {
      firebase.auth().onAuthStateChanged((authData) => {
        // Is signed in
        if (authData) {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              ready: true,
              signedIn: true,
              data: authData,
            },
          });

          // Load user profile and Pokédex
          refs.user().child('profile').on('value', (snapshot) => {
            const profile = snapshot.val();

            // Handle first sign in and create username
            if (!profile.username) {
              const to = profile.email.indexOf('@');
              const username = profile.email.substring(0, to).replace(/[\+\.\$\#\[\/]/g, '');
              const setUsername = (increment) => {
                let computedUsername = username;

                if (increment > 1) {
                  computedUsername = computedUsername + '' + increment;
                }

                refs.root().child(`username_lookup/${computedUsername}`).set(authData.uid)
                  .then(() => {
                    refs.user().child('profile/username').set(computedUsername);
                  })
                  .catch(() => {
                    setUsername(++increment);
                  });
              };

              setUsername(1);
            } else {
              dispatch({
                type: 'SET_PROFILE',
                payload: profile,
              });

              // Load user pokedex and add it to the available pokedexes
              refs.user().child('pokedex').on('value', (snapshot) => {
                const pokedex = snapshot.val();

                if (pokedex) {
                  dispatch({
                    type: 'SET_POKEDEX',
                    payload: pokedex,
                    meta: { username: profile.username },
                  });
                  
                  // Complete the Pokédex if needed
                  refs.root().child('pokemons').once('value', (snapshot) => {
                    const pokemons = snapshot.val();

                    if (pokedex.pokemons.length != pokemons.length) {
                      // Build an index of name => pokemon to ease matching old to new pokemons
                      const nameToPokemonIndex = {};
                      _.forEach(pokedex.pokemons, (pokemon) => {
                        nameToPokemonIndex[pokemon.name] = pokemon;
                      });

                      const newPokemons = [];

                      _.forEach(pokemons, (pokemon) => {
                        const _pokemon = nameToPokemonIndex[pokemon.name];
                        if (undefined !== _pokemon) {
                          newPokemons.push(_pokemon);
                        } else {
                          newPokemons.push({
                            id: pokemon.id,
                            name: pokemon.name,
                            collected: false,
                            tag: 'none',
                          });
                        }
                      });

                      refs.user().child('pokedex/pokemons').set(newPokemons);
                    }
                  });
                } else {
                  // Create the Pokédex if it doesn't exist
                  refs.root().child('pokemons').once('value', (snapshot) => {
                    const pokemons = snapshot.val();
                    const pokedex = {
                      pokemons: [],
                      settings: {
                        public: false,
                      },
                    };

                    _.forEach(pokemons, (pokemon) => {
                      pokedex.pokemons.push({
                        id: pokemon.id,
                        name: pokemon.name,
                        collected: false,
                        tag: 'none',
                      });
                    });

                    refs.user().child('pokedex').set(pokedex);
                  });
                }
              });
            }
          });
        } else {
          dispatch({
            type: 'SET_AUTH',
            payload: {
              ready: true,
              signedIn: false,
              data: {},
            },
          });
        }
      });
    };
  },
  signup(email, password, locale) {
    return (dispatch) => {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          refs.root().child('users').child(user.uid).set({
            profile: {
              email: user.email,
              uid: user.uid,
              locale,
            },
          }).then(() => {
            firebase.auth().signInWithEmailAndPassword(email, password);
          });
        }).catch((error) => {
          dispatch({
            type: 'SET_AUTH_ERROR',
            errors: { signup: error },
          });
        });
    };
  },
  signin(email, password) {
    return (dispatch) => {
      return firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((error) => {
          dispatch({
            type: 'SET_AUTH_ERROR',
            errors: { signin: error },
          });
        });
    };
  },
  signout() {
    return (dispatch) => {
      dispatch({
        type: 'SET_CURRENT_USERNAME',
        payload: null,
      });

      return firebase.auth().signOut();
    };
  },
};

export default actions;
