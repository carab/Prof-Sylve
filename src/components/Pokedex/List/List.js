import React, { memo, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/FilterList';
import PublicIcon from '@material-ui/icons/Public';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import CancelIcon from '@material-ui/icons/Cancel';
import RadioUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { defineMessages, useIntl } from 'react-intl';
import { FixedSizeList as VirtualizedList } from 'react-window';
import Autosizer from 'react-virtualized-auto-sizer';
import actions from 'actions';
import Colors from 'data/colors';
import Regions from 'data/regions';
import FilterMenuItem from 'components/Filter/MenuItem';
import PokemonSelector from 'components/Pokedex/PokemonSelector/PokemonSelector';
import PokemonRow from 'components/Pokemon/Row/Row';
import { selectCurrentUsername, selectCurrentPokedex, selectUi } from 'selectors/selectors';
import { AppbarPortal } from 'components/Ui/Appbar/AppbarPortal';
import Flex from 'components/Flex/Flex';
import PokemonSearch from './PokemonSearch';

import './List.css';

const messages = defineMessages({
  menu: { id: 'pokemon.menu' },
  noResult: { id: 'pokemon.filter.noResult' },

  search: { id: 'pokemon.filter.search' },
  all: { id: 'pokemon.filter.all' },
  collected: { id: 'pokemon.filter.collected' },
  notCollected: { id: 'pokemon.filter.notCollected' },

  region: { id: 'pokemon.region.region' },
  kanto: { id: 'pokemon.region.kanto' },
  johto: { id: 'pokemon.region.johto' },
  hoenn: { id: 'pokemon.region.hoenn' },
  sinnoh: { id: 'pokemon.region.sinnoh' },
  ulys: { id: 'pokemon.region.ulys' },
  kalos: { id: 'pokemon.region.kalos' },
  alola: { id: 'pokemon.region.alola' },
  galar: { id: 'pokemon.region.galar' },

  tag: { id: 'pokemon.tag.tag' },
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

const ListRow = memo(({ index, style }) => {
  const id = useSelector((store) => {
    return store.ui.filtered.get(index);
  });

  return (
    <div style={style}>
      <PokemonRow id={id} />
    </div>
  );
});

function PageList({ match }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { formatMessage } = useIntl();

  const currentUsername = useSelector(selectCurrentUsername);
  const currentPokedex = useSelector(selectCurrentPokedex);
  const { selecting } = useSelector(selectUi);

  const filtersConfig = useMemo(() => {
    return {
      region: {
        priority: 10,
        process: (pokemons, value) => {
          const region = Regions.find((region) => region.name === value);
          if (region) {
            return pokemons.filter((pokemon) => {
              return pokemon.id >= region.from && pokemon.id <= region.to;
            });
          }

          return pokemons;
        },
      },
      collected: {
        priority: 20,
        process: (pokemons, value) => {
          const collected = value === '✔';

          return pokemons.filter((pokemon) => {
            return pokemon.collected === collected;
          });
        },
      },
      tag: {
        priority: 30,
        process: (pokemons, value) => {
          return pokemons.filter((pokemon) => {
            return pokemon.tag === value;
          });
        },
      },
      q: {
        priority: 50,
        process: (pokemons, value) => {
          if (value.length) {
            const query = value.toLowerCase();
            return pokemons.filter((pokemon) => {
              const name = formatMessage({ id: 'pokemon.name.' + pokemon.id }).toLowerCase();
              return name.indexOf(query) > -1;
            });
          } else {
            return pokemons;
          }
        },
      },
    };
  }, [formatMessage]);

  // Parse the URL
  const splat = match?.params?.splat ?? '';

  const filters = useMemo(() => {
    const filterNames = Object.keys(filtersConfig);

    const filters = splat
      .split('/')
      .map((hash) => {
        const [name, value] = hash.split('=');
        return { name, value };
      })
      .filter((filter) => filterNames.includes(filter.name));

    return filters;
  }, [filtersConfig, splat]);

  // Add the filters in the store
  useEffect(() => {
    dispatch(actions.ui.resetFilters());

    filters.forEach((filter) => {
      dispatch(actions.ui.addFilter(filter));
    });
  }, [dispatch, filters]);

  const [anchorEl, setAnchorEl] = useState(undefined);

  // Execute filters sorted by priority
  const pokemons = currentPokedex?.pokemons ?? [];
  const filtered = useMemo(() => {
    const selectedFilters = filters.map((filter) => {
      const filterConfig = filtersConfig[filter.name];

      return {
        ...filterConfig,
        value: filter.value,
      };
    });

    const sortedFilters = selectedFilters.sort((a, b) => a.priority >= b.priority);

    const filteredPokemons = sortedFilters.reduce((tmpFilteredPokemons, filter) => {
      return filter.process(tmpFilteredPokemons, filter.value);
    }, pokemons);

    const filteredId = filteredPokemons.map((pokemon) => pokemon.id);

    return filteredId;
  }, [filters, filtersConfig, pokemons]);

  // Set the filtered pokemons in the store
  useEffect(() => {
    dispatch(actions.ui.setFiltered(filtered));
  }, [dispatch, filtered]);

  function handleSetFilters(filters) {
    handleClose();

    const url = filters.reduce(
      (path, { name, value }) => `${path}/${name}=${value}`,
      `/pokedex/${currentUsername}/list`,
    );

    history.push(url);
  }
  function handleResetFilters() {
    handleSetFilters([]);
  }

  function isFilterSelected(name, value) {
    const filter = filters.find((filter) => filter.name === name);

    return filter?.value === value;
  }

  function handleFilterChange(name, value) {
    let newFilters = [...filters];

    const index = newFilters.findIndex((filter) => filter.name === name);
    if (index >= 0) {
      newFilters.splice(index, 1);
    }

    if (value !== undefined && !isFilterSelected(name, value)) {
      newFilters.push({ name, value });
    }

    handleSetFilters(newFilters);
  }

  function handleQueryChange(query) {
    handleFilterChange('q', query || undefined);
  }

  function handleClick(event) {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const queryFilter = filters.find((filter) => filter.name === 'q');
  const query = queryFilter?.value ?? '';
  const filtersCount = filters.length - (queryFilter ? 1 : 0);

  return (
    <div className="PokemonList">
      <AppbarPortal secondary={selecting}>
        <Flex>
          <PokemonSelector showFiltered />
          {!selecting ? (
            <>
              <PokemonSearch
                query={query}
                placeholder={formatMessage(messages.search)}
                onQueryChange={handleQueryChange}
              />
              <div className="PokedexFilter">
                <IconButton
                  color="inherit"
                  aria-controls="list-menu"
                  aria-haspopup="true"
                  aria-label={formatMessage(messages.menu)}
                  onClick={handleClick}
                  edge="end"
                >
                  <Badge badgeContent={filtersCount} color="secondary">
                    <FilterIcon />
                  </Badge>
                </IconButton>
                <Menu
                  id="list-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleResetFilters}>
                    <ListItemIcon>
                      <CancelIcon />
                    </ListItemIcon>
                    <ListItemText primary={formatMessage(messages.all)} />
                  </MenuItem>
                  <Divider />
                  <FilterMenuItem
                    selected={isFilterSelected('collected', '✔')}
                    onChange={() => handleFilterChange('collected', '✔')}
                    text={formatMessage(messages.collected)}
                  />
                  <FilterMenuItem
                    selected={isFilterSelected('collected', '❌')}
                    onChange={() => handleFilterChange('collected', '❌')}
                    text={formatMessage(messages.notCollected)}
                  />
                  <Divider />
                  {Object.entries(Colors.tags).map(([tag, color]) => (
                    <FilterMenuItem
                      key={tag}
                      selected={isFilterSelected('tag', tag)}
                      onChange={() => handleFilterChange('tag', tag)}
                      text={currentPokedex?.settings?.tags?.[tag] || formatMessage(messages[tag])}
                      color={color}
                      checkedIcon={BookmarkIcon}
                      uncheckedIcon={BookmarkBorderIcon}
                    />
                  ))}
                  <Divider />
                  {Regions.map((region) => (
                    <FilterMenuItem
                      key={region.name}
                      selected={isFilterSelected('region', region.name)}
                      onChange={() => handleFilterChange('region', region.name)}
                      text={formatMessage(messages[region.name])}
                      color={region.color}
                      checkedIcon={PublicIcon}
                      uncheckedIcon={RadioUncheckedIcon}
                    />
                  ))}
                </Menu>
              </div>
            </>
          ) : null}
        </Flex>
      </AppbarPortal>
      <Paper elevation={1} className="PokemonList__paper">
        <List className="PokemonList__list">
          {filtered.length ? (
            <Autosizer>
              {({ height, width }) => (
                <VirtualizedList
                  height={height}
                  width={width}
                  itemCount={filtered.length}
                  itemSize={48}
                >
                  {ListRow}
                </VirtualizedList>
              )}
            </Autosizer>
          ) : (
            <ListItem primaryText={formatMessage(messages.noResult)} />
          )}
        </List>
      </Paper>
    </div>
  );
}

export default PageList;
