import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import actions from 'actions';
import PokemonMenuButton from 'components/Pokemon/Menu/PokemonMenuButton';
import {
  selectUi,
  selectProfile,
  selectCurrentUsername,
  selectCurrentPokedex,
} from 'selectors/selectors';

import './PokemonSelector.scss';

const messages = defineMessages({
  counter: { id: 'pokemon.selector.counter' },
  filtered: { id: 'pokemon.selector.filtered' },
  selected: { id: 'pokedex.selected' },
  selectAll: { id: 'pokedex.selectAll' },
  unselectAll: { id: 'pokedex.unselectAll' },
});

function PokemonSelector({ showFiltered }) {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const currentUsername = useSelector(selectCurrentUsername);
  const currentPokedex = useSelector(selectCurrentPokedex);
  const pokemons = currentPokedex?.pokemons ?? [];
  const { filtered, selecting, selected, mediaQuery } = useSelector(selectUi);
  const profile = useSelector(selectProfile);

  const classes = classnames('PokemonSelector', {
    'PokemonSelector--selecting': selecting,
  });

  return pokemons.length ? (
    <div className={classes}>
      {renderSelector()}
      {renderTitle()}
    </div>
  ) : null;

  function renderSelector() {
    if (selecting && currentUsername === profile.username) {
      const filteredAndSelected = filtered.filter((id) => selected.get(id));
      const checked = filtered.size > 0 && filteredAndSelected.size === filtered.size;

      return (
        <div className="PokemonSelector__selector">
          <Checkbox
            color="default"
            edge="start"
            checked={checked}
            onChange={handleSelectorCheck}
            inputProps={{
              'aria-label': formatMessage(checked ? messages.unselectAll : messages.selectAll),
            }}
          />
        </div>
      );
    }

    return null;
  }

  function renderTitle() {
    if (selecting) {
      const selectedPokemons = pokemons.filter((pokemon) => selected.get(pokemon.id));

      return (
        <div className="PokemonSelector__selection">
          {formatMessage(messages.selected, { selected: selected.size })}
          <PokemonMenuButton pokemons={selectedPokemons} icon={<ExpandMoreIcon />} />
        </div>
      );
    }

    if (mediaQuery.downSm) {
      return null;
    }

    if (showFiltered && filtered && filtered.size < pokemons.length) {
      return formatMessage(messages.filtered, { filtered: filtered.size });
    }

    const collected = pokemons.filter((pokemon) => pokemon.collected);

    return formatMessage(messages.counter, {
      collected: collected.length,
      pokemons: pokemons.length,
    });
  }

  function handleSelectorCheck(event) {
    filtered.forEach((id) => {
      dispatch(actions.ui.setSelected(id, event.target.checked));
    });
  }
}

export default PokemonSelector;
