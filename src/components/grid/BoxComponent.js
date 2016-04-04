'use strict';

import React from 'react';
import _ from 'lodash';

import GridList from 'material-ui/lib/grid-list/grid-list';

import PokemonComponent from 'components/grid/PokemonComponent';

require('styles/grid/Box.css');

class BoxComponent extends React.Component {
  render() {
    let box = this.props.box;
    let cols = this.props.cols;

    return (
      <div className="box-component">
        <GridList
          cols={cols}
          cellHeight={150}
        >
          {_.map(box.pokemons, (pokemon) => (
            <PokemonComponent
              key={pokemon.id}
              pokemon={pokemon}/>
          ))}
        </GridList>
      </div>
    );
  }
}

BoxComponent.displayName = 'GridBoxComponent';

// Uncomment properties you need
// BoxComponent.propTypes = {};
// BoxComponent.defaultProps = {};

export default BoxComponent;
