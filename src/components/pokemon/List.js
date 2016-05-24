'use strict';

import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {VirtualScroll, AutoSizer} from 'react-virtualized';
import 'react-virtualized/styles.css';

import Colors from '../../utils/colors';

import PokemonItem from 'components/pokemon/Item';
import Toolbar from './Toolbar';

import 'styles/pokemon/List.css';

const messages = defineMessages({
  collected: {id: 'pokemon.collected'},
  notCollected: {id: 'pokemon.notCollected'},
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

class ListComponent extends React.Component {
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

    const colorsList = _.map(Colors.tags, (color, name) => {
      const key = 'color-' + name;

      filters[key] = (pokemon) => {
        return (pokemon.tag == name && !pokemon.collected);
      };

      return {
        text: tags[name] && tags[name].title || formatMessage(messages[name]),
        value: color,
        key: key,
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
            <MenuItem value="all" primaryText="All" insetChildren={true}/>
            <MenuItem value="collected" primaryText={formatMessage(messages.collected)} insetChildren={true}/>
            <MenuItem value="notCollected" primaryText={formatMessage(messages.notCollected)} insetChildren={true}/>
            <Divider/>
            {_.map(colorsList, (color) => (
              <MenuItem primaryText={color.text}
                key={color.key}
                value={color.key}
                leftIcon={<BookmarkIcon style={{fill: color.value}}/>}
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
    return (
      <ListItem primaryText="No Pokémon"/>
    )
  }

  itemRenderer(index) {
    const pokemon = this.filteredPokemons[index];

    return (
      <PokemonItem key={pokemon.id} type="row" pokemon={pokemon}/>
    )
  }
}

ListComponent.displayName = 'PokemonListComponent';

ListComponent.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.user.data.pokedex,
    tags: state.user.data.profile.tags
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent));
