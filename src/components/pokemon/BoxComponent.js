'use strict';

import React from 'react';
import _ from 'lodash';

import GridList from 'material-ui/lib/grid-list/grid-list';

import PokemonComponent from 'components/pokemon/PokemonComponent';

require('styles/pokemon/Box.css');

class BoxComponent extends React.Component {
  render() {
    let box = this.props.box;
    let cols = this.props.cols;

    return (
      <div className="pokemon-box">
        <GridList
          cols={cols}
          cellHeight={150}
        >
          {_.map(box.pokemons, (pokemon) => (
            <PokemonComponent
              key={pokemon.id}
              type="tile"
              pokemon={pokemon}/>
          ))}
        </GridList>
      </div>
    );
  }
}

BoxComponent.displayName = 'PokemonBoxComponent';

export default BoxComponent;
