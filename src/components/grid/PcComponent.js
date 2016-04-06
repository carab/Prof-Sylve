'use strict';

import React from 'react';
import _ from 'lodash';

import BoxComponent from 'components/grid/BoxComponent';
import ToolbarComponent from 'components/grid/ToolbarComponent';

import FirebaseUtils from '../../utils/firebase-utils';

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

    this.state = { pokemons: [] };

    this.pokemonsRef = FirebaseUtils.getRootRef().child('pokemons');
  }

  componentDidMount() {
    this.pokemonsRef.once('value', (snap) => {
      let boxes = [];
      let pokemons = snap.val();
      let box = null;

      _.each(pokemons, (pokemon) => {
        if (null === box) {
          box = this.getEmptyBox();
          box.start = pokemon.id;
          boxes.push(box);
        }

        box.pokemons.push(pokemon);
        box.end = pokemon.id;
        box.count++;

        if (box.count === BOX_SIZE) {
          box = null;
        }
      });

      this.setState({
        pokemons,
        boxes,
        currentBox: 0
      });
    });
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
        total={this.state.pokemons.length}
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

  handleSelectBox(event, index, currentBox) {
    this.setState({ currentBox });
  }

  handlePreviousBox() {
    let currentBox = this.state.currentBox - 1;

    if (this.state.currentBox >= 0) {
      this.setState({ currentBox });
    }
  }

  handleNextBox() {
    let currentBox = this.state.currentBox + 1;

    if (currentBox < this.state.boxes.length) {
      this.setState({ currentBox });
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

export default PcComponent;
