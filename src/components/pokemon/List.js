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
import Checkbox from 'material-ui/Checkbox';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';
import ArrowDropRightIcon from 'material-ui/svg-icons/navigation-arrow-drop-right';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {VirtualScroll, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css';

import Colors from '../../utils/colors';
import actions from '../../actions';
import Regions from '../../utils/regions';

import PokemonItem from 'components/pokemon/Item';
import Toolbar from './Toolbar';

import 'styles/pokemon/List.css';

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

class ListComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleFilterToggle = this.handleFilterToggle.bind(this);
    this.itemRenderer = this.itemRenderer.bind(this);
    this.noItemRenderer = this.noItemRenderer.bind(this);

    this.state = {
      filter: 'all',
    };
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, tags, filters} = this.props;

    const filterCallbacks = {
      collected: (options) => {
        return (pokemon) => {
          return (pokemon.collected === options.collected);
        };
      },
      tag: (options) => {
        return (pokemon) => {
          return (pokemon.tag === options.tag);
        };
      },
      region: (options) => {
        return (pokemon) => {
          return (pokemon.id >= options.region.from && pokemon.id <= options.region.to);
        };
      },
    };

    this.filteredPokemons = pokemons;

    const hashes = [];
    filters.forEach((filter) => {
      hashes.push(filter.hash);
      this.filteredPokemons = _.filter(this.filteredPokemons, filterCallbacks[filter.name](filter.options));
    });

    return (
      <div className="PokemonList container">
        <Paper zDepth={1} className="PokemonList__paper">
          <Toolbar pokemons={pokemons} filteredPokemons={this.filteredPokemons} right={
            <IconMenu iconButtonElement={<IconButton><FilterIcon/></IconButton>}>
              <MenuItem primaryText={formatMessage(messages.all)} leftIcon={<CancelIcon/>} onTouchTap={this.handleFilterReset}/>
              <Divider/>
              <FilterItem
                hash="collected-true"
                name="collected"
                options={{collected: true}}
                color={Colors.collected}
                toggle={hashes.indexOf('collected-true') >= 0}
                text={formatMessage(messages.collected)}
                onFilterToggle={this.handleFilterToggle}
              />
              <FilterItem
                hash="collected-false"
                name="collected"
                options={{collected: false}}
                color={Colors.default}
                toggle={hashes.indexOf('collected-false') >= 0}
                text={formatMessage(messages.notCollected)}
                onFilterToggle={this.handleFilterToggle}
              />
              <Divider/>
              <MenuItem
                primaryText={formatMessage(messages.region)}
                leftIcon={<PlaceIcon/>}
                rightIcon={<ArrowDropRightIcon/>}
                menuItems={_.map(Regions, (region) => (
                  <FilterItem
                    key={region.name}
                    hash={'region-' + region.name}
                    name="region"
                    options={{region: region}}
                    toggle={hashes.indexOf('region-' + region.name) >= 0}
                    text={formatMessage(messages[region.name])}
                    onFilterToggle={this.handleFilterToggle}
                  />
                ))}
              />
              <MenuItem
                primaryText={formatMessage(messages.tag)}
                leftIcon={<BookmarkBorderIcon/>}
                rightIcon={<ArrowDropRightIcon/>}
                menuItems={_.map(Colors.tags, (color, name) => (
                  <FilterItem
                    key={name}
                    hash={'tag-' + name}
                    name="tag"
                    options={{tag: name}}
                    toggle={hashes.indexOf('tag-' + name) >= 0}
                    color={color}
                    text={tags && tags[name] && tags[name].title || formatMessage(messages[name])}
                    checkedIcon={<BookmarkIcon/>}
                    uncheckedIcon={<BookmarkBorderIcon/>}
                    onFilterToggle={this.handleFilterToggle}
                  />
                ))}
              />
            </IconMenu>
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

  handleFilterToggle(filter) {
    this.props.onFilterToggle(filter);
  }

  handleFilterReset() {
    this.props.onFilterReset();
  }

  noItemRenderer() {
    const {formatMessage} = this.props.intl;

    return (
      <ListItem primaryText={formatMessage(messages.noResult)}/>
    )
  }

  itemRenderer(index) {
    const pokemon = this.filteredPokemons[index];

    return (
      <PokemonItem key={pokemon.id} id={pokemon.id} type="row"/>
    )
  }
}

function FilterItem(props) {
  const {hash, name, options, toggle, text, color, checkedIcon, uncheckedIcon, onFilterToggle} = props;
  const style = {}, iconStyle = {};

  if (color) {
    iconStyle.fill = color;

    if (toggle) {
      style.color = color;
    }
  }

  return (
    <MenuItem primaryText={text}
      leftIcon={<Checkbox checked={toggle} iconStyle={iconStyle} checkedIcon={checkedIcon} uncheckedIcon={uncheckedIcon}/>}
      style={style}
      onTouchTap={() => onFilterToggle({ name, hash, options })}
    />
  );
}

ListComponent.displayName = 'PokemonListComponent';
ListComponent.propTypes = {
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
)(ListComponent));
