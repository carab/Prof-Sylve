'use strict';

require('styles/pokemon/grid/Tile.css');

import Firebase from 'firebase/lib/firebase-web';

import React from 'react';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Checkbox from 'material-ui/lib/checkbox';

const firebaseUrl = 'https://prof-sylve.firebaseio.com';

class TileComponent extends React.Component {
  constructor(props) {
    super(props);

    this.addCollected = this.addCollected.bind(this);

    this.collectedRef = new Firebase(firebaseUrl + '/carab/collected');
    this.state = {};
  }

  componentWillReceiveProps(props) {
    this.setState({
      collected: props.collected
    });
  }

  render() {
    return (
      <GridTile
        title={this.props.pokemon.name}
        subtitle={this.props.id}
        actionIcon={<Checkbox checked={this.state.collected} onCheck={this.addCollected}/>}
      >
        <img alt={this.props.pokemon.name} src={this.props.pokemon.img}/>
      </GridTile>
    );
  }

  addCollected() {
    this.collectedRef
      .child(this.props.id)
      .set(!this.state.collected);
  }
}

TileComponent.displayName = 'PokemonGridTileComponent';

// Uncomment properties you need
// TileComponent.propTypes = {};
TileComponent.defaultProps = {
  id: null,
  pokemon: {},
  collected: false
};

export default TileComponent;
