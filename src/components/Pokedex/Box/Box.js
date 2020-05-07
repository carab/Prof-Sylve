import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import PokemonTile from 'components/Pokemon/Tile/Tile';
import actions from 'actions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  selectCurrentPokedex,
  selectCurrentUsername,
  selectUi,
  selectProfile,
} from 'selectors/selectors';

import './Box.css';

function Box({ box }) {
  const dispatch = useDispatch();
  const pokedex = useSelector(selectCurrentPokedex);
  const currentUsername = useSelector(selectCurrentUsername);
  const profile = useSelector(selectProfile);
  const { selecting, selected, mediaQuery } = useSelector(selectUi);
  const disabled = currentUsername !== profile.username;
  const withHover = useMediaQuery('(hover: hover)');

  const pokemons = pokedex?.pokemons ?? [];
  const filteredPokemons = useMemo(() => {
    return pokemons.slice(box.start, box.end);
  }, [box.end, box.start, pokemons]);

  useEffect(() => {
    dispatch(actions.ui.setFiltered(filteredPokemons.map((pokemon) => pokemon.id)));
  }, [dispatch, filteredPokemons]);

  const handleCollect = useCallback(
    (id, collected) => {
      dispatch(actions.pokedex.setCollected(id, collected));
    },
    [dispatch],
  );

  const handleSelect = useCallback(
    (id, selected) => {
      dispatch(actions.ui.setSelected(id, selected));
    },
    [dispatch],
  );

  if (!pokedex) {
    return null;
  }

  const classes = classnames('PokedexBox', {
    'PokedexBox--condensed': mediaQuery.downMd,
  });

  return (
    <div className={classes}>
      {filteredPokemons.map((pokemon) => (
        <PokemonTile
          key={pokemon.id}
          pokemon={pokemon}
          condensed={mediaQuery.downMd}
          selecting={selecting}
          disabled={disabled}
          withHover={withHover}
          selected={selected.get(pokemon.id) || false}
          onCollect={handleCollect}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

export default memo(Box);
