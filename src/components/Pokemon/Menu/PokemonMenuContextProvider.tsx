import React, { useState, useMemo } from 'react';
import { PopoverProps } from '@material-ui/core/Popover';

export type PokemonMenuContextType = {
  pokemons?: string[];
  setPokemons(pokemons: string[]): void;
  anchorEl?: PopoverProps['anchorEl'];
  setAnchorEl(anchorEl: PopoverProps['anchorEl']): void;
  menuId?: string;
  setMenuId(menuId: string): void;
};

export const PokemonMenuContext = React.createContext<PokemonMenuContextType>({
  pokemons: undefined,
  setPokemons: () => {},
  anchorEl: undefined,
  setAnchorEl: () => {},
  menuId: undefined,
  setMenuId: () => {},
});

export type PokemonMenuContextProviderProps = {
  children: React.ReactNode;
};

export function PokemonMenuContextProvider({ children }: PokemonMenuContextProviderProps) {
  const [pokemons, setPokemons] = useState<PokemonMenuContextType['pokemons']>(undefined);
  const [anchorEl, setAnchorEl] = useState<PokemonMenuContextType['anchorEl']>(undefined);
  const [menuId, setMenuId] = useState<PokemonMenuContextType['menuId']>(undefined);

  const value: PokemonMenuContextType = useMemo((): PokemonMenuContextType => {
    return {
      pokemons,
      setPokemons,
      anchorEl,
      setAnchorEl,
      menuId,
      setMenuId,
    };
  }, [anchorEl, menuId, pokemons]);

  return <PokemonMenuContext.Provider value={value}>{children}</PokemonMenuContext.Provider>;
}
