import { useState, useEffect } from 'react';
import firebase from 'utils/firebase';
import PokemonData from 'data/pokemons.json';

export type PokemonModel = {
  id: string;
  name: string;
  collected?: boolean;
  tag?: string;
};

export type PokedexModel = {
  pokemons: PokemonModel[];
  settings: {
    public: boolean;
    username?: string;
    tags?: Record<string, string | undefined>;
  };
};

function useFirebasePokedex(uid: string | undefined) {
  const [pokedex, setPokedex] = useState<PokedexModel | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Start listening to pokedex
  useEffect(() => {
    setPokedex(undefined);
    setError(undefined);

    if (!uid) {
      return;
    }

    const ref = firebase.database().ref().child(`users/${uid}/pokedex`);

    const onValueChange = ref.on(
      'value',
      (snapshot) => {
        const pokedex = snapshot.val();

        const pokemons = PokemonData.map((pokemon) => ({
          ...pokemon,
          collected: false,
          tag: undefined,
          ...pokedex?.pokemons?.[pokemon.id],
        }));

        const settings = {
          public: false,
          ...pokedex?.settings,
        };

        setPokedex({
          ...pokedex,
          settings,
          pokemons,
        });
      },
      (error: Error) => {
        setError(error);
      },
    );

    return () => {
      ref.off('value', onValueChange);
    };
  }, [uid]);

  return [pokedex, error];
}

export default useFirebasePokedex;
