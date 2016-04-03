'use strict';

import React from 'react';
import Firebase from 'firebase/lib/firebase-web';

import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Checkbox from 'material-ui/lib/checkbox';

const firebaseUrl = 'https://prof-sylve.firebaseio.com';

require('styles/grid/Pokemon.css');

class PokemonComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleCollected = this.handleCollected.bind(this);

    this.collectedRef = new Firebase(firebaseUrl + '/carab/collected').child(props.pokemon.id);
    this.collectedRef.once('value', (snap) => {
      let collected = snap.val() || false;
      this.state.collected = collected;
      this.setState(this.state);
    });
  }

  render() {
    let image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + this.props.pokemon.name + '.gif';

    let style = {};

    if (!this.state.collected) {
      style.opacity = '0.5';
    }

    return (
      <GridTile
        className="pokemon-component"
        style={style}
        title={this.props.pokemon.name}
        subtitle={this.props.pokemon.id}
        actionIcon={<Checkbox checked={this.state.collected} onCheck={this.handleCollected}/>}
      >
        <img alt={this.props.pokemon.name} src={image}/>
      </GridTile>
    );
  }

  handleCollected() {
    this.state.collected = !this.state.collected;
    this.collectedRef.set(this.state.collected);
    this.setState(this.state);
  }
}

PokemonComponent.displayName = 'GridPokemonComponent';

PokemonComponent.propTypes = {};
PokemonComponent.defaultProps = {
  pokemon: {}
};

export default PokemonComponent;
