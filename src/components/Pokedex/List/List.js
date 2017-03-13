'use strict';

import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import PublicIcon from 'material-ui/svg-icons/social/public';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ArrowDropRightIcon from 'material-ui/svg-icons/navigation-arrow-drop-right';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import RadioUncheckedIcon from 'material-ui/svg-icons/toggle/radio-button-unchecked';

import {injectIntl, defineMessages} from 'react-intl';

import {VirtualScroll, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css';

import actions from 'actions';
import Colors from 'utils/colors';
import Regions from 'utils/regions';

import FilterMenuItem from 'components/Filter/MenuItem';
import PokedexToolbar from 'components/Pokedex/Toolbar/Toolbar';
import PokemonRow from 'components/Pokemon/Row/Row';

import './List.css';

const messages = defineMessages({
  noResult: {id: 'pokemon.filter.noResult'},

  search: {id: 'pokemon.filter.search'},
  all: {id: 'pokemon.filter.all'},
  collected: {id: 'pokemon.filter.collected'},
  notCollected: {id: 'pokemon.filter.notCollected'},

  region: {id: 'pokemon.region.region'},
  kanto: {id: 'pokemon.region.kanto'},
  johto: {id: 'pokemon.region.johto'},
  hoenn: {id: 'pokemon.region.hoenn'},
  sinnoh: {id: 'pokemon.region.sinnoh'},
  ulys: {id: 'pokemon.region.ulys'},
  kalos: {id: 'pokemon.region.kalos'},
  alola: {id: 'pokemon.region.alola'},

  tag: {id: 'pokemon.tag.tag'},
  red: {id: 'pokemon.tag.color.red'},
  yellow: {id: 'pokemon.tag.color.yellow'},
  green: {id: 'pokemon.tag.color.green'},
  cyan: {id: 'pokemon.tag.color.cyan'},
  pink: {id: 'pokemon.tag.color.pink'},
  orange: {id: 'pokemon.tag.color.orange'},
  purple: {id: 'pokemon.tag.color.purple'},
  indigo: {id: 'pokemon.tag.color.indigo'},
  teal: {id: 'pokemon.tag.color.teal'},
  lime: {id: 'pokemon.tag.color.lime'},
  brown: {id: 'pokemon.tag.color.brown'},
});

class PageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };
  }

  componentWillMount() {
    const {splat} = this.props.params;
    this.parseSplatParam(splat);
  }

  componentWillReceiveProps(nextProps) {
    const {splat} = nextProps.params;

    if (splat !== this.props.params.splat) {
      this.parseSplatParam(splat);
    }
  }

  parseSplatParam(splat) {
    this.props.onResetFilters();
    if (_.isString(splat) && splat.length) {
      splat.split('/').forEach((hash) => {
        const [name, value] = hash.split('=');
        this.props.onAddFilter({ name, value });
      });
    }
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, tags, filters, currentUsername, onFiltered} = this.props;

    const filtersConfig = {
      region: {
        priority: 10, // Very important that's it's first, because the process relies on Pokemon index
        process: (pokemons, value) => {
          const region = _.find(Regions, { name: value });
          return _.slice(pokemons, region.from-1, region.to); // That's why !
        },
      },
      collected: {
        priority: 20,
        process: (pokemons, value) => {
          const collected = (value === '✔');

          return _.filter(pokemons, (pokemon) => {
            return (pokemon.collected === collected);
          });
        },
      },
      tag: {
        priority: 30,
        process: (pokemons, value) => {
          return _.filter(pokemons, (pokemon) => {
            return (pokemon.tag === value);
          });
        },
      },
      q: {
        priority: 50,
        process: (pokemons, value) => {
          if (value.length) {
            const query = value.toLowerCase();
            return _.filter(pokemons, (pokemon) => {
              const name = formatMessage({ id: 'pokemon.name.' + pokemon.id }).toLowerCase();
              return (name.indexOf(query) > -1);
            });
          } else {
            return pokemons;
          }
        },
      },
    };

    // Build filters to execute from current filters and config
    const filtersToExecute = [];

    filters.forEach((filter) => {
      const filterConfig = filtersConfig[filter.name];

      filtersToExecute.push({
        priority: filterConfig.priority,
        process: filterConfig.process,
        value: filter.value,
      });
    });

    // Execute filters sorted by priority
    const filtered = _.map(_.reduce(_.sortBy(filtersToExecute, 'priority'), (pokemons, filter) => {
      return filter.process(pokemons, filter.value);
    }, pokemons), 'id');

    this.filtered = filtered;
    onFiltered(filtered);

    let query = this.state.query;
    const queryFilter = filters.get('q');

    if (!query.length && queryFilter) {
      query = queryFilter.value;
    }

    // Build reset path
    let resetPath = `/pokedex/${currentUsername}/list`;

    if (query.length) {
      resetPath += `/q=${query}`;
    }

    // Find colors
    const active = {};
    const activeRegionFilter = this.getFilterActive('region');
    const activeTagFilter = this.getFilterActive('tag');

    if (activeRegionFilter) {
      active.region = _.find(Regions, { name: activeRegionFilter.value });
    }

    if (activeTagFilter) {
      active.tag = Colors.tags[activeTagFilter.value];
    }

    return (
      <div className="PokemonList container">
        <Paper zDepth={1} className="PokemonList__paper">
          <PokedexToolbar showFiltered={true} right={[
            <div key="search" className="PokedexSearch">
              <div className="PokedexSearch__icon">
                <SearchIcon/>
              </div>
              <TextField value={query} hintText={formatMessage(messages.search)} onChange={this.handleFilterSearchChange}/>
              <div className="PokedexSearch__cancel">
                {query.length ? <IconButton onTouchTap={this.handleFilterSearchCancel}><CancelIcon/></IconButton> : ''}
              </div>
            </div>,
            <div key="filter" className="PokedexFilter">
              <IconMenu iconButtonElement={<IconButton><FilterIcon/></IconButton>}>
                <MenuItem primaryText={formatMessage(messages.all)} leftIcon={<CancelIcon/>} containerElement={<Link to={resetPath} />}/>
                <Divider/>
                <FilterMenuItem
                  name="collected"
                  value="✔"
                  text={formatMessage(messages.collected)}
                />
                <FilterMenuItem
                  name="collected"
                  value="❌"
                  text={formatMessage(messages.notCollected)}
                />
                <Divider/>
                <MenuItem
                  primaryText={formatMessage(messages.region)}
                  leftIcon={<PublicIcon color={active.region ? active.region.color : ''}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Regions, (region) => (
                    <FilterMenuItem
                      key={region.name}
                      name="region"
                      value={region.name}
                      color={region.color}
                      text={formatMessage(messages[region.name])}
                      checkedIcon={<PublicIcon/>}
                      uncheckedIcon={<RadioUncheckedIcon/>}
                    />
                  ))}
                />
                <MenuItem
                  primaryText={formatMessage(messages.tag)}
                  leftIcon={<BookmarkIcon color={active.tag ? active.tag : ''}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Colors.tags, (color, name) => (
                    <FilterMenuItem
                      key={name}
                      name="tag"
                      value={name}
                      color={color}
                      text={tags && tags[name] && tags[name].title || formatMessage(messages[name])}
                      checkedIcon={<BookmarkIcon/>}
                      uncheckedIcon={<BookmarkBorderIcon/>}
                    />
                  ))}
                />
              </IconMenu>
            </div>,
          ]}/>
          <List className="PokemonList__list">
            <AutoSizer>
              {({ height, width }) => (
                <VirtualScroll
                  height={height}
                  width={width}
                  overscanRowsCount={5}
                  noRowsRenderer={this.noItemRenderer}
                  rowsCount={filtered.length}
                  rowHeight={48}
                  rowRenderer={this.itemRenderer}
                />
              )}
            </AutoSizer>
          </List>
        </Paper>
      </div>
    );
  }

  getFilterActive(name) {
    return this.props.filters.get(name);
  }

  handleFilterSearchCancel = () => {
    this.setState({ query: '' });
    this.handleFilterSearch('');
    this.handleFilterSearch.flush();
  }

  handleFilterSearchChange = (e) => {
    this.handleFilterSearch(e.target.value);
  }

  handleFilterSearchChange = (event, query) => {
    this.setState({ query });
    this.handleFilterSearch(query);
  }

  handleFilterSearch = _.debounce((query) => {
    const {filters, currentUsername} = this.props;
    const splat = {};

    filters.forEach((filter) => {
      splat[filter.name] = filter.value;
    });

    if (query.length) {
      splat.q = query;
    } else {
      delete splat.q;
    }

    const path = _.reduce(splat, function(path, value, name) {
      return path + '/' + name + '=' + value;
    }, `/pokedex/${currentUsername}/list`);

    this.context.router.push(path);
  }, 300)

  handleFilterReset = () => {
    this.props.onResetFilters();
  }

  noItemRenderer = () => {
    const {formatMessage} = this.props.intl;

    return (
      <ListItem primaryText={formatMessage(messages.noResult)}/>
    )
  }

  itemRenderer = (index) => {
    const id = this.filtered[index];

    return (
      <PokemonRow key={id} id={id}/>
    );
  }
}

PageList.displayName = 'PageList';
PageList.propTypes = {};
PageList.contextTypes = {
  router: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    currentUsername: state.ui.currentUsername,
    pokemons: currentPokedex.pokemons,
    tags: currentPokedex.settings.tags,
    filters: state.ui.filters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFiltered: (filtered) => {
      dispatch(actions.ui.setFiltered(filtered));
    },
    onAddFilter: (filter) => {
      dispatch(actions.ui.addFilter(filter));
    },
    onResetFilters: () => {
      dispatch(actions.ui.resetFilters());
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PageList));
