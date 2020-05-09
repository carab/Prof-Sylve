import React, { useEffect } from 'react';
import uniq from 'lodash/uniq';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LaunchIcon from '@material-ui/icons/Launch';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { BOX_SIZE } from 'components/Pokedex/Pc/Pc';
import Colors from 'data/colors';
import actions from 'actions';
import Link from 'components/utils/Link';
import { usePokemonMenuContext } from './usePokemonMenuContext';
import { selectCurrentPokedex, selectCurrentUsername } from 'selectors/selectors';
import useAutoId from 'hooks/useAutoId';

const messages = defineMessages({
  menu: { id: 'pokemon.menu' },
  cancelSelection: { id: 'pokedex.cancelSelection' },
  collected: { id: 'pokemon.collected' },
  tag: { id: 'pokemon.tag.tag' },
  none: { id: 'pokemon.tag.none' },
  externalService: { id: 'pokemon.externalService' },
  externalUrl: { id: 'pokemon.externalUrl' },
  inPc: { id: 'pokemon.inPc' },
  red: { id: 'pokemon.tag.color.red' },
  yellow: { id: 'pokemon.tag.color.yellow' },
  green: { id: 'pokemon.tag.color.green' },
  cyan: { id: 'pokemon.tag.color.cyan' },
  pink: { id: 'pokemon.tag.color.pink' },
  orange: { id: 'pokemon.tag.color.orange' },
  purple: { id: 'pokemon.tag.color.purple' },
  indigo: { id: 'pokemon.tag.color.indigo' },
  teal: { id: 'pokemon.tag.color.teal' },
  lime: { id: 'pokemon.tag.color.lime' },
  brown: { id: 'pokemon.tag.color.brown' },
});

function PokemonMenu() {
  const { formatMessage } = useIntl();
  const id = useAutoId();
  const dispatch = useDispatch();
  const currentUsername = useSelector(selectCurrentUsername);
  const currentPokedex = useSelector(selectCurrentPokedex);
  const tags = currentPokedex?.settings?.tags ?? [];
  const { pokemons, anchorEl, setAnchorEl, setMenuId } = usePokemonMenuContext();
  const pokemon = pokemons?.length === 1 ? pokemons[0] : undefined;

  const collected = pokemons?.every((pokemon) => pokemon.collected) ?? false;
  const selectedTags = uniq(pokemons?.map((pokemon) => pokemon.tag));
  const selectedTag = selectedTags.length === 1 ? selectedTags[0] : undefined;

  useEffect(() => {
    setMenuId(id);
  }, [id, setMenuId]);

  function handleClose() {
    setAnchorEl(undefined);
  }

  function handleCancelSelection() {
    handleClose();

    dispatch(actions.ui.resetSelected());
  }

  function handleCollectChange() {
    handleClose();

    if (pokemons) {
      pokemons.forEach((pokemon) => {
        dispatch(actions.pokedex.setCollected(pokemon.id, !collected));
      });
    }
  }

  function handleTagChange(tag) {
    handleClose();

    if (pokemons) {
      pokemons.forEach((pokemon) => {
        dispatch(actions.pokedex.setTag(pokemon.id, tag));
      });
    }
  }

  return (
    <div className="PokemonMenu">
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        variant="menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pokemon ? (
          <>
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={formatMessage(messages.externalUrl, {
                name: formatMessage({ id: 'pokemon.name.' + pokemon.id }),
              })}
            >
              <ListItemIcon>
                <LaunchIcon />
              </ListItemIcon>
              <ListItemText primary={formatMessage(messages.externalService)} />
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={`/pokedex/${currentUsername}/pc/${Math.ceil(pokemon.id / BOX_SIZE)}`}
            >
              <ListItemIcon>
                <ViewModuleIcon />
              </ListItemIcon>
              <ListItemText primary={formatMessage(messages.inPc)} />
            </MenuItem>
            <Divider />
          </>
        ) : (
          <>
            <MenuItem onClick={handleCancelSelection}>
              <ListItemIcon>
                <CancelIcon />
              </ListItemIcon>
              <ListItemText primary={formatMessage(messages.cancelSelection)} />
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={handleCollectChange}>
          <ListItemIcon>
            {collected ? <CheckBoxIcon color="secondary" /> : <CheckBoxOutlineBlankIcon />}
          </ListItemIcon>
          <ListItemText primary={formatMessage(messages.collected)} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleTagChange(undefined)} selected={selectedTag === undefined}>
          <ListItemIcon>
            <BookmarkIcon style={{ color: Colors.default }} />
          </ListItemIcon>
          <ListItemText primary={formatMessage(messages.none)} />
        </MenuItem>
        {Object.entries(Colors.tags).map(([name, color]) => (
          <MenuItem
            key={name}
            onClick={() => handleTagChange(name)}
            value={name}
            selected={name === selectedTag}
          >
            <ListItemIcon>
              <BookmarkIcon style={{ color: color }} />
            </ListItemIcon>
            <ListItemText primary={tags?.[name] || formatMessage(messages[name])} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default PokemonMenu;
