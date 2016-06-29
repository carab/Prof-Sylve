'use strict';

import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

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
    const {pokemons, tags, filters} = this.props;

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
    this.filteredPokemons = _.reduce(_.sortBy(filtersToExecute, 'priority'), (pokemons, filter) => {
      return filter.process(pokemons, filter.value);
    }, pokemons);

    let q = '';
    const qFilter = filters.get('q');

    if (qFilter) {
      q = qFilter.value;
    }

    return (
      <div className="PokemonList container">
        <Paper zDepth={1} className="PokemonList__paper">
          <Toolbar pokemons={pokemons} filteredPokemons={this.filteredPokemons} right={
            <div>
              <div className="FilterSearch">
                <TextField value={q} hintText={formatMessage(messages.search)} onChange={this.handleFilterSearchChange}/>
                <div className="FilterSearch_cancel">
                  {q.length ? <IconButton onTouchTap={this.handleFilterSearchCancel}><CancelIcon/></IconButton> : ''}
                </div>
              </div>
              <IconMenu iconButtonElement={<IconButton><FilterIcon/></IconButton>}>
                <MenuItem primaryText={formatMessage(messages.all)} leftIcon={<CancelIcon/>} containerElement={<Link to="/pokedex" />}/>
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
                  leftIcon={<PublicIcon color={this.isFilterActive('region') ? Colors.default : ''}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Regions, (region, index) => (
                    <FilterMenuItem
                      key={region.name}
                      name="region"
                      value={region.name}
                      text={formatMessage(messages[region.name])}
                    />
                  ))}
                />
                <MenuItem
                  primaryText={formatMessage(messages.tag)}
                  leftIcon={<BookmarkIcon color={this.isFilterActive('tag') ? Colors.default : ''}/>}
                  rightIcon={<ArrowDropRightIcon/>}
                  menuItems={_.map(Colors.tags, (color, name) => (
                    <FilterMenuItem
                      key={name}
                      name="tag"
                      value={name}
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

  isFilterActive(name) {
    return (true && this.props.filters.get(name));
  }

  handleFilterSearchCancel = () => {
    this.handleFilterSearch('');
  }

  handleFilterSearchChange = (e) => {
    this.handleFilterSearch(e.target.value);
  }

  handleFilterSearch(query) {
    const {filters} = this.props;
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
    }, '/pokedex');

    this.context.router.push(path);
  }

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
PagePokedex.contextTypes = {
  router: React.PropTypes.object,
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
)(PagePokedex));
