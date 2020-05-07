import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { usePokemonMenuContext } from './usePokemonMenuContext';

const messages = defineMessages({
  menu: { id: 'pokemon.menu' },
});

function PokemonMenuButton({ pokemons, icon }) {
  const { menuId, setPokemons, setAnchorEl } = usePokemonMenuContext();
  const { formatMessage } = useIntl();

  function handleClick(event) {
    setPokemons(pokemons);
    setAnchorEl(event.currentTarget);
  }

  return (
    <div className="PokemonMenuButton">
      <IconButton
        color="inherit"
        aria-controls={menuId}
        aria-haspopup="true"
        aria-label={formatMessage(messages.menu)}
        onClick={handleClick}
      >
        {icon ? icon : <MoreVertIcon />}
      </IconButton>
    </div>
  );
}

export default PokemonMenuButton;
