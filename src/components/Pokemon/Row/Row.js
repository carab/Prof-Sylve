import React, { memo, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import Pokeball from 'components/Pokemon/Pokeball';
import actions from 'actions';
import Colors from 'data/colors';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import './Row.scss';
import PokemonMenuButton from '../Menu/PokemonMenuButton';

const messages = defineMessages({
  collect: { id: 'pokemon.collect' },
  uncollect: { id: 'pokemon.uncollect' },
  select: { id: 'pokemon.select' },
  unselect: { id: 'pokemon.unselect' },
});

function Row({ pokemon, selected, selecting, disabled }) {
  const { formatMessage } = useIntl();
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const hasHover = useMediaQuery('(hover: hover)');

  if (!pokemon) {
    return null;
  }

  const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });
  const clickLabel = selecting
    ? formatMessage(pokemon.selected ? messages.unselect : messages.select, {
        name,
      })
    : formatMessage(pokemon.collected ? messages.uncollect : messages.collect, {
        name,
      });

  const styles = {
    tile: {},
    footer: {},
    id: { background: Colors.default },
  };

  if (pokemon.tag) {
    styles.id.background = Colors.tags[pokemon.tag];
  }

  if (pokemon.collected) {
  }

  const classes = classnames('PokemonRow', {
    'PokemonRow--collected': pokemon.collected,
    'PokemonRow--selected': selected,
    'PokemonRow--selecting': selecting,
    'PokemonRow--hover': !hasHover || hover,
    'PokemonRow--disabled': disabled,
  });

  return (
    <div
      className={classes}
      style={styles.tile}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="PokemonRow__selector">
        <Checkbox
          checked={selected}
          onChange={handleSelected}
          inputProps={{
            'aria-label': formatMessage(selected ? messages.unselect : messages.select, { name }),
          }}
        />
      </div>
      <div
        role="button"
        aria-label={clickLabel}
        className="PokemonRow__pokeball"
        onClick={handleClick}
      >
        <Pokeball />
      </div>
      <div
        role="button"
        aria-label={clickLabel}
        className="Pokemon__id"
        style={styles.id}
        onClick={handleClick}
      >
        {pokemon.id}
      </div>
      <div role="button" aria-label={clickLabel} className="PokemonRow__name" onClick={handleClick}>
        {name}
      </div>
      <div className="PokemonRow__menu">
        <PokemonMenuButton pokemons={[pokemon]} />
      </div>
    </div>
  );

  function handleMouseEnter() {
    setHover(true);
  }

  function handleMouseLeave() {
    setHover(false);
  }

  function handleClick() {
    if (disabled) {
      return;
    }

    if (selecting) {
      handleSelected();
    } else {
      dispatch(actions.pokedex.setCollected(pokemon.id, !pokemon.collected));
    }
  }

  function handleSelected() {
    if (disabled) {
      return;
    }

    dispatch(actions.ui.setSelected(pokemon.id, !selected));
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    disabled: state.ui.currentUsername !== state.profile.username,
    pokemon: state.ui.currentPokedex?.pokemons?.find((p) => p.id === ownProps.id),
    selected: state.ui.selected.get(ownProps.id) ?? false,
    selecting: state.ui.selecting,
  };
};

export default connect(mapStateToProps)(memo(Row));
