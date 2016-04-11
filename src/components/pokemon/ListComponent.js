'use strict';

import React from 'react';
import _ from 'lodash';

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

import FirebaseUtils from '../../utils/firebase-utils';
import Colors from '../../utils/colors';

import PokemonComponent from 'components/pokemon/PokemonComponent';
import ToolbarComponent from 'components/pokemon/ToolbarComponent';

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
      pokemons: [],
      collected: {},
      colors: {},
      tags: {},
      filter: 'all'
    };

    this.pokemonsRef = FirebaseUtils.getRootRef().child('pokemons');
    this.collectedRef = FirebaseUtils.getUserRef().child('collected');
    this.colorsRef = FirebaseUtils.getUserRef().child('settings/colors');
    this.tagsRef = FirebaseUtils.getUserRef().child('tags');

    this.onTagsChange = this.tagsRef.on('value', (snap) => {
      let tags = snap.val();
      tags;
    });
  }

  componentDidMount() {
    this.pokemonsRef.once('value', (snap) => {
      let pokemons = snap.val();
      this.setState({ pokemons });
    });

    this.colorsRef.once('value', (snap) => {
      let colors = snap.val() || {};
      this.setState({ colors });
    });

    this.onCollectedChange = this.collectedRef.on('value', (snap) => {
      let collected = snap.val();
      this.setState({ collected });
    });

    this.onTagsChange = this.tagsRef.on('value', (snap) => {
      let tags = snap.val();
      this.setState({ tags });
    });
  }

  componentWillUnmount() {
    this.collectedRef.off('value', this.onCollectedChange);
    this.tagsRef.off('value', this.onTagsChange);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, collected, tags, colors, filter} = this.state;
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
        <ToolbarComponent pokemons={pokemons} filteredPokemons={filteredPokemons} right={
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
                ref='VirtualScroll'
                height={height}
                overscanRowsCount={5}
                noRowsRenderer={this.noItemRenderer}
                rowsCount={filteredPokemons.length}
                rowHeight={48}
                rowRenderer={this.itemRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        </List>
      </div>
    );
  }

  noItemRenderer() {
    return (
      <ListItem primaryText="No Pokémon"/>
    )
  }

  itemRenderer(index) {
    const pokemon = this.filteredPokemons[index];

    return (
      <PokemonComponent
        key={pokemon.id}
        type="item"
        pokemon={pokemon}/>
    )
  }

  handleFilterChange(event, value) {
    this.setState({
      filter: value
    });
  }
}

ListComponent.displayName = 'PokemonListComponent';

ListComponent.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(ListComponent);
