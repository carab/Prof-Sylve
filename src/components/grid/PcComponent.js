'use strict';

import React from 'react';
import _ from 'lodash';

import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import IconButton from 'material-ui/lib/icon-button';
import ImageNavigateBefore from 'material-ui/lib/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/lib/svg-icons/image/navigate-next';

import BoxComponent from 'components/grid/BoxComponent';

require('styles/grid/Pc.css');

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PcComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handlePreviousBox = this.handlePreviousBox.bind(this);
    this.handleNextBox = this.handleNextBox.bind(this);

    this.state = {};
  }

  componentWillReceiveProps(props) {
    let boxes = [];
    let pokemons = props.pokemons;
    let currentBox = null;

    _.each(pokemons, (pokemon) => {
      if (null === currentBox) {
        currentBox = this.getEmptyBox();
        currentBox.start = pokemon.id;
      }

      currentBox.pokemons.push(pokemon);
      currentBox.end = pokemon.id;
      currentBox.count++;

      if (currentBox.count === BOX_SIZE) {
        boxes.push(currentBox);
        currentBox = null;
      }
    });

    this.setState({
      boxes: boxes,
      currentBox: 0
    });
  }

  render() {
    let box = 'Loading';

    if (_.isInteger(this.state.currentBox)) {
      let currentBox = this.state.boxes[this.state.currentBox];
      let navigation =
        <ToolbarGroup float="right">
          <IconButton tooltip="Previous Box" onClick={this.handlePreviousBox}>
            <ImageNavigateBefore/>
          </IconButton>
          <IconButton tooltip="Next Box" onClick={this.handleNextBox}>
            <ImageNavigateNext/>
          </IconButton>
        </ToolbarGroup>;

      box = <BoxComponent box={currentBox} cols={BOX_COLS} navigation={navigation}/>
    }

    return (
      <div className="pc-component">
        {box}
      </div>
    );
  }

  handlePreviousBox() {
    this.state.currentBox--;

    if (this.state.currentBox < 0) {
      this.state.currentBox = 0;
    }

    this.setState(this.state);
  }

  handleNextBox() {
    this.state.currentBox++;

    if (this.state.currentBox >= this.state.boxes.length) {
      this.state.currentBox = this.state.boxes.length - 1;
    }

    this.setState(this.state);
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
