'use strict';

import React from 'react';
import _ from 'lodash';

import FirebaseUtils from '../../utils/firebase-utils';

import List from 'material-ui/lib/lists/list';

import PokemonComponent from 'components/list/PokemonComponent';

require('styles/list/List.css');

class ListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { pokemons: [] };

    this.pokemonsRef = FirebaseUtils.getRootRef().child('pokemons');
  }

  componentDidMount() {
    this.pokemonsRef.once('value', (snap) => {
      let pokemons = snap.val();
      this.setState({ pokemons });
    });
  }

  render() {
    return (
      <List>
        {_.map(this.state.pokemons, (pokemon) => (
          <PokemonComponent
            key={pokemon.id}
            pokemon={pokemon}/>
        ))}
      </List>
    );
  }
}

ListComponent.displayName = 'ListListComponent';

export default ListComponent;
