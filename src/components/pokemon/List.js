'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import AllInclusiveIcon from 'material-ui/svg-icons/places/all-inclusive';
import Checkbox from 'material-ui/Checkbox';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {VirtualScroll, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css';

import Colors from '../../utils/colors';

import PokemonItem from 'components/pokemon/Item';
import Toolbar from './Toolbar';

import 'styles/pokemon/List.css';

const messages = defineMessages({
  all: {id: 'pokemon.filter.all'},
  collected: {id: 'pokemon.filter.collected'},
  notCollected: {id: 'pokemon.filter.notCollected'},
  noResult: {id: 'pokemon.filter.noResult'},
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

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.itemRenderer = this.itemRenderer.bind(this);
    this.noItemRenderer = this.noItemRenderer.bind(this);

    this.state = {
      filter: 'all',
    };
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, tags} = this.props;
    const {filter} = this.state;

    const filters = {
      all: () => {
        return true;
      },
      collected: (pokemon) => {
        return pokemon.collected;
      },
      notCollected: (pokemon) => {
        return !pokemon.collected;
      },
    };

    _.each(Colors.tags, (color, name) => {
      filters[name] = (pokemon) => {
        return (pokemon.tag == name && !pokemon.collected);
      };
    });

    const filteredPokemons = _.filter(pokemons, filters[filter]);
    this.filteredPokemons = filteredPokemons;

    return (
      <div className="pokemon-list">
        <Toolbar pokemons={pokemons} filteredPokemons={filteredPokemons} right={
          <IconMenu
            iconButtonElement={<IconButton><FilterIcon/></IconButton>}
            value={filter}
            onChange={this.handleFilterChange}
          >
            <MenuItem value="all" primaryText={formatMessage(messages.all)} leftIcon={<AllInclusiveIcon/>}/>
            <MenuItem value="collected" primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={true}/>}/>
            <MenuItem value="notCollected" primaryText={formatMessage(messages.notCollected)} leftIcon={<Checkbox checked={false}/>}/>
            <Divider/>
            {_.map(Colors.tags, (color, name) => (
              <MenuItem primaryText={tags && tags[name] && tags[name].title || formatMessage(messages[name])}
                key={name}
                value={name}
                leftIcon={<BookmarkIcon style={{fill: color}}/>}
              />
            ))}
          </IconMenu>
        }/>
        <List className="pokemon-list__list">
          <AutoSizer>
            {({ height, width }) => (
              <VirtualScroll
                height={height}
                width={width}
                overscanRowsCount={5}
                noRowsRenderer={this.noItemRenderer}
                rowsCount={filteredPokemons.length}
                rowHeight={48}
                rowRenderer={this.itemRenderer}
              />
            )}
          </AutoSizer>
        </List>
      </div>
    );
  }

  handleFilterChange(event, value) {
    this.setState({
      filter: value,
    });
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
      <PokemonItem key={pokemon.id} pokemon={pokemon} type="row"/>
    )
  }
}

ListComponent.displayName = 'PokemonListComponent';
ListComponent.propTypes = {
  pokemons: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokedex,
    tags: state.profile.tags,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent));
