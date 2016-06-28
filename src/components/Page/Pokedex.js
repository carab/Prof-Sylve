'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import PublicIcon from 'material-ui/svg-icons/social/public';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import ArrowDropRightIcon from 'material-ui/svg-icons/navigation-arrow-drop-right';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import TextField from 'material-ui/TextField';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {VirtualScroll, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css';

import Colors from '../../utils/colors';
import actions from '../../actions';
import Regions from '../../utils/regions';

import FilterMenuItem from 'components/Filter/MenuItem';
import PokemonItem from 'components/pokemon/Item';
import Toolbar from 'components/pokemon/Toolbar';

import 'styles/Page/Pokedex.css';

const messages = defineMessages({
  noResult: {id: 'pokemon.filter.noResult'},

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

class PagePokedex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all',
    };
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, tags, filters} = this.props;

    const filtersConfig = {
      search: {
        filter: (pokemons, options) => {
          if (options.query.length) {
            const query = options.query.toLowerCase();
            return _.filter(pokemons, (pokemon) => {
              const name = formatMessage({ id: 'pokemon.name.' + pokemon.id }).toLowerCase();
              return (name.indexOf(query) > -1);
            });
          } else {
            return pokemons;
          }
        },
      },
      collected: {
        filter: (pokemons, options) => {
          return _.filter(pokemons, (pokemon) => {
            return (pokemon.collected === options.collected);
          });
        },
      },
      tag: {
        filter: (pokemons, options) => {
          return _.filter(pokemons, (pokemon) => {
            return (pokemon.tag === options.tag);
          });
        },
      },
      region: {
        filter: (pokemons, options) => {
          const region = Regions[options.region];
          return _.slice(pokemons, region.from-1, region.to);
        },
      },
    };

    const currentFilters = {};

    this.filteredPokemons = pokemons;

    filters.forEach((filter) => {
      this.filteredPokemons = filtersConfig[filter.name].filter(this.filteredPokemons, filter.options);

      if (filter.name === 'tag') {
        currentFilters.tags = Colors.tags[filter.options.tag];
      }

      if (filter.name === 'region') {
        currentFilters.regions = Colors.default;
      }

      if (filter.name === 'search' && filter.options.query.length) {
        currentFilters.search = <IconButton onTouchTap={this.handleFilterSearchCancel}><CancelIcon/></IconButton>;
      }
    });

    return (
      <div className="PokemonList container">
        <Paper zDepth={1} className="PokemonList__paper">
          <Toolbar pokemons={pokemons} filteredPokemons={this.filteredPokemons} right={
            <div>
              <div className="FilterSearch">
                <TextField ref="search" hintText="Recherche" onChange={this.handleFilterSearchChange}/>
                <div className="FilterSearch_cancel">
                  {currentFilters.search}
                </div>
              </div>
              <IconMenu iconButtonElement={<IconButton><FilterIcon/></IconButton>}>
                <MenuItem primaryText={formatMessage(messages.all)} leftIcon={<CancelIcon/>} onTouchTap={this.handleFilterReset}/>
                <Divider/>
                <FilterMenuItem
                  name="collected"
                  options={{collected: true}}
                  text={formatMessage(messages.collected)}
                />
                <FilterMenuItem
                  name="collected"
                  options={{collected: false}}
                  text={formatMessage(messages.notCollected)}
                />
                <Divider/>
                <MenuItem
                  primaryText={formatMessage(messages.region)}
                  leftIcon={<PublicIcon color={currentFilters.regions}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Regions, (region, index) => (
                    <FilterMenuItem
                      key={region.name}
                      name="region"
                      options={{region: index}}
                      text={formatMessage(messages[region.name])}
                    />
                  ))}
                />
                <MenuItem
                  primaryText={formatMessage(messages.tag)}
                  leftIcon={<BookmarkIcon color={currentFilters.tags}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Colors.tags, (color, name) => (
                    <FilterMenuItem
                      key={name}
                      name="tag"
                      options={{tag: name}}
                      color={color}
                      text={tags && tags[name] && tags[name].title || formatMessage(messages[name])}
                    />
                  ))}
                />
              </IconMenu>
            </div>
          }/>
          <List className="PokemonList__list">
            <AutoSizer>
              {({ height, width }) => (
                <VirtualScroll
                  height={height}
                  width={width}
                  overscanRowsCount={5}
                  noRowsRenderer={this.noItemRenderer}
                  rowsCount={this.filteredPokemons.length}
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

  handleFilterSearchCancel = () => {
    this.refs.search.input.value = '';
    this.handleFilterSearch('');
  }

  handleFilterSearchChange = (e) => {
    this.handleFilterSearch(e.target.value);
  }

  handleFilterSearch(query) {
    const name = 'search';
    const options = { query };
    const hash = name + '-' + options.query;

    this.props.onFilterToggle({ name, options, hash });
  }

  handleFilterReset = () => {
    this.props.onFilterReset();
  }

  noItemRenderer = () => {
    const {formatMessage} = this.props.intl;

    return (
      <ListItem primaryText={formatMessage(messages.noResult)}/>
    )
  }

  itemRenderer = (index) => {
    const pokemon = this.filteredPokemons[index];

    return (
      <PokemonItem key={pokemon.id} id={pokemon.id} type="row"/>
    )
  }
}

PagePokedex.displayName = 'PagePokedex';
PagePokedex.propTypes = {
  pokemons: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokedex.pokemons,
    tags: state.pokedex.settings.tags,
    filters: state.ui.filters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFilterToggle: (filter) => {
      dispatch(actions.ui.toggleFilter(filter));
    },
    onFilterReset: () => {
      dispatch(actions.ui.resetFilter());
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PagePokedex));
