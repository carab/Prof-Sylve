'use strict';

import React from 'react';
import _ from 'lodash';

import {GridList} from 'material-ui/GridList';

import PokemonItem from 'components/pokemon/Item';

import 'styles/pokemon/Box.css';

class Box extends React.Component {
  render() {
    const {box, cols} = this.props;

    return (
      <div className="pokemon-box">
        <GridList
          cols={cols}
          cellHeight={150}
        >
          {_.map(box.pokemons, (pokemon) => (
            <PokemonItem key={pokemon.id} type="tile" pokemon={pokemon}/>
          ))}
        </GridList>
      </div>
    );
  }
}

Box.displayName = 'PokemonBoxComponent';

export default Box;
