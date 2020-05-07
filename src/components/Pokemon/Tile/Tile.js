import React, { memo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import PokemonMenuButton from 'components/Pokemon/Menu/PokemonMenuButton';
import Pokeball from 'components/Pokemon/Pokeball';
import Colors from 'data/colors';

import './Tile.scss';

const messages = defineMessages({
  collect: { id: 'pokemon.collect' },
  uncollect: { id: 'pokemon.uncollect' },
  select: { id: 'pokemon.select' },
  unselect: { id: 'pokemon.unselect' },
});

function Tile({
  condensed,
  pokemon,
  selected,
  selecting,
  disabled,
  withHover,
  onCollect,
  onSelect,
}) {
  const [hover, setHover] = useState(false);
  const { formatMessage } = useIntl();

  const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });
  const clickLabel = selecting
    ? formatMessage(pokemon.selected ? messages.unselect : messages.select, {
        name,
      })
    : formatMessage(pokemon.collected ? messages.uncollect : messages.collect, {
        name,
      });

  const classes = classnames({
    PokemonTile: true,
    'PokemonTile--collected': pokemon.collected,
    'PokemonTile--selected': selected,
    'PokemonTile--selecting': selecting,
    'PokemonTile--hover': hover && withHover,
    'PokemonTile--disabled': disabled,
    'PokemonTile--condensed': condensed,
  });

  return (
    <div className={classes} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className="PokemonTile__content"
        role="button"
        aria-label={clickLabel}
        onClick={handleCollect}
      >
        {renderPokeball()}
        <div className="PokemonTile__image">
          <img
            src={`${process.env.PUBLIC_URL}/sprites/128/${pokemon.id.padStart(4, 0)}.png`}
            alt={name}
          />
        </div>
      </div>
      <div
        className="PokemonTile__footer"
        role="button"
        aria-label={clickLabel}
        onClick={handleCollect}
      >
        {renderId()}
        <div className="PokemonTile__name">{name}</div>
      </div>
      {renderSelector()}
      {renderMenu()}
    </div>
  );

  function renderId() {
    const style = {
      background: Colors.default,
    };

    if (pokemon.tag) {
      style.background = Colors.tags[pokemon.tag];
    }

    return (
      <div className="Pokemon__id" style={style}>
        {pokemon.id}
      </div>
    );
  }

  function renderPokeball() {
    return (
      <div className="PokemonTile__pokeball">
        <Pokeball />
      </div>
    );
  }

  function renderSelector() {
    if (disabled) {
      return null;
    }

    return (
      <div className="PokemonTile__selector">
        <Checkbox
          checked={selected}
          onChange={handleSelect}
          inputProps={{
            'aria-label': formatMessage(selected ? messages.unselect : messages.select, { name }),
          }}
        />
      </div>
    );
  }

  function renderMenu() {
    if (disabled) {
      return null;
    }

    return (
      <div className="PokemonTile__menu">
        <PokemonMenuButton pokemons={[pokemon]} />
      </div>
    );
  }

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleCollect() {
    if (disabled) {
      return;
    }

    if (selecting) {
      handleSelect();
    } else {
      onCollect(pokemon.id, !pokemon.collected);
    }
  }

  function handleSelect() {
    if (disabled) {
      return;
    }

    onSelect(pokemon.id, !selected);
  }
}

export default memo(Tile);
