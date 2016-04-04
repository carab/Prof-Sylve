'use strict';

import React from 'react';
import _ from 'lodash';

import FirebaseUtils from '../../utils/firebase-utils';

import BoxComponent from 'components/grid/BoxComponent';
import ToolbarComponent from 'components/grid/ToolbarComponent';

require('styles/grid/Pc.css');

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PcComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelectBox = this.handleSelectBox.bind(this);
    this.handlePreviousBox = this.handlePreviousBox.bind(this);
    this.handleNextBox = this.handleNextBox.bind(this);

    this.state = {
      pokemons: []
    };

    let pokemonsRef = FirebaseUtils.getRootRef().child('pokemons');

    pokemonsRef.once('value', (snap) => {
      let boxes = [];
      let pokemons = snap.val();
      let currentBox = null;

      _.each(pokemons, (pokemon) => {
        if (null === currentBox) {
          currentBox = this.getEmptyBox();
          currentBox.start = pokemon.id;
          boxes.push(currentBox);
        }

        currentBox.pokemons.push(pokemon);
        currentBox.end = pokemon.id;
        currentBox.count++;

        if (currentBox.count === BOX_SIZE) {
          currentBox = null;
        }
      });

      this.setState({
        pokemons,
        boxes,
        currentBox: 0
      });
    });

    this.state = {};
  }

  render() {
    let box;
    let toolbar;

    if (_.isInteger(this.state.currentBox)) {
      let currentBox = this.state.boxes[this.state.currentBox];
      box = <BoxComponent box={currentBox} cols={BOX_COLS}/>;
      toolbar = <ToolbarComponent
        onPreviousBox={this.handlePreviousBox}
        onNextBox={this.handleNextBox}
        onSelectBox={this.handleSelectBox}
        pokemons={this.state.pokemons}
        boxes={this.state.boxes}
        currentBox={this.state.currentBox}
      />;
    }

    return (
      <div className="pc-component">
        {toolbar}
        {box}
      </div>
    );
  }

  handleSelectBox(event, index, value) {
    this.state.currentBox = value;
    this.setState(this.state);
  }

  handlePreviousBox() {
    this.state.currentBox--;

    if (this.state.currentBox >= 0) {
      this.setState(this.state);
    } else {
      this.state.currentBox = 0;
    }
  }

  handleNextBox() {
    this.state.currentBox++;

    if (this.state.currentBox < this.state.boxes.length) {
      this.setState(this.state);
    } else {
      this.state.currentBox = this.state.boxes.length - 1;
    }
  }

  getEmptyBox() {
    return {
      pokemons: [],
      count: 0,
      start: 0,
      end: 0
    };
  }
}

PcComponent.displayName = 'GridPcComponent';

// Uncomment properties you need
// PcComponent.propTypes = {};
// PcComponent.defaultProps = {};

export default PcComponent;
