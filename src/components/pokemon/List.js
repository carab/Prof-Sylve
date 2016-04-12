'use strict';

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import FilterIcon from 'material-ui/lib/svg-icons/content/filter-list';
import BookmarkIcon from 'material-ui/lib/svg-icons/action/bookmark';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import { VirtualScroll, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import Colors from '../../utils/colors';

import PokemonItem from 'components/pokemon/Item';
import Toolbar from './Toolbar';

import 'styles/pokemon/List.css';

const messages = defineMessages({
  red: {id: 'pokemon.tag.color.red'},
  orange: {id: 'pokemon.tag.color.orange'},
  green: {id: 'pokemon.tag.color.green'},
  indigo: {id: 'pokemon.tag.color.indigo'},
  purple: {id: 'pokemon.tag.color.purple'}
});

class ListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.itemRenderer = this.itemRenderer.bind(this);
    this.noItemRenderer = this.noItemRenderer.bind(this);

    this.state = {
      filter: 'all'
    };
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, collected, tags, colors} = this.props;
    const {filter} = this.state;
    const filters = {
      all: () => {
        return true;
      },
      collected: (pokemon) => {
        return !!collected[pokemon.id];
      },
      notCollected: (pokemon) => {
        return !collected[pokemon.id];
      }
    };

    const colorsList = _.map(Colors.tags, (color) => {
      const key = 'color-' + color.name;

      filters[key] = (pokemon) => {
        return (tags[pokemon.id] && tags[pokemon.id].color == color.value && !collected[pokemon.id]);
      };

      return {
        text: colors[color.name] || formatMessage(messages[color.name]),
        value: color.value,
        key: key
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
            <MenuItem value="notCollected" primaryText="Not Collected" insetChildren={true}/>
            <MenuItem value="collected" primaryText="Collected" insetChildren={true}/>
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
      filter: value
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
  intl: intlShape.isRequired
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokemons.data,
    collected: state.user.data.collected,
    tags: state.user.data.tags,
    colors: state.user.data.settings.colors
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponent));
