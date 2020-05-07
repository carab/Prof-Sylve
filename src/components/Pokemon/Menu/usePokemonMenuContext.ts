import { useContext } from 'react';
import { PokemonMenuContextType, PokemonMenuContext } from './PokemonMenuContextProvider';

export function usePokemonMenuContext(): PokemonMenuContextType {
  return useContext(PokemonMenuContext);
}
