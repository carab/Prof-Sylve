'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ImageNavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/svg-icons/image/navigate-next';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import Box from './Box';
import Toolbar from './Toolbar';

import 'styles/pokemon/Pc.css';

const messages = defineMessages({
  box: {id: 'pokemon.toolbar.box'},
  previousBox: {id: 'pokemon.toolbar.previousBox'},
  nextBox: {id: 'pokemon.toolbar.nextBox'},
});

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PokemonPc extends Component {
  constructor(props) {
    super(props);

    this.handleSelectBox = this.handleSelectBox.bind(this);
    this.handlePreviousBox = this.handlePreviousBox.bind(this);
    this.handleNextBox = this.handleNextBox.bind(this);

    this.state = {
      boxes: [],
      currentBox: 0,
    };
  }

  render() {
    const {pokemons} = this.props;
    const {formatMessage} = this.props.intl;
    const {boxes, currentBox} = this.state;

    boxes.length = 0;
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

    let toolbar;

    if (boxes[currentBox]) {
      toolbar = (
        <Toolbar
          right={
            <div>
              <IconButton tooltip={formatMessage(messages.previousBox)} onClick={this.handlePreviousBox}>
                <ImageNavigateBefore/>
              </IconButton>
              <DropDownMenu value={currentBox} onChange={this.handleSelectBox}>
                {_.map(boxes, (box, i) => (
                  <MenuItem value={i} primaryText={formatMessage(messages.box, { start: box.start, end: box.end })} key={i}/>
                ))}
              </DropDownMenu>
              <IconButton tooltip={formatMessage(messages.nextBox)} onClick={this.handleNextBox}>
                <ImageNavigateNext/>
              </IconButton>
            </div>
          }
        />
      );
    }

    return (
      <div className="pokemon-pc">
        {toolbar}
        {this.renderBox()}
      </div>
    );
  }

  renderBox() {
    const {boxes, currentBox} = this.state;

    if (boxes[currentBox]) {
      return <Box box={boxes[currentBox]} cols={BOX_COLS}/>;
    }
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
      end: 0,
    };
  }
}

PokemonPc.displayName = 'PokemonPcComponent';

PokemonPc.propTypes = {
  pokemons: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokedex,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonPc));
