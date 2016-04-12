'use strict';

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import IconButton from 'material-ui/lib/icon-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ImageNavigateBefore from 'material-ui/lib/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/lib/svg-icons/image/navigate-next';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import Box from './Box';
import Toolbar from './Toolbar';

import 'styles/pokemon/Pc.css';

const messages = defineMessages({
  box: {id: 'pokemon.toolbar.box'},
  previousBox: {id: 'pokemon.toolbar.previousBox'},
  nextBox: {id: 'pokemon.toolbar.nextBox'}
});

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PokemonPc extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelectBox = this.handleSelectBox.bind(this);
    this.handlePreviousBox = this.handlePreviousBox.bind(this);
    this.handleNextBox = this.handleNextBox.bind(this);

    this.state = {};
  }

  componentWillMount() {
    const {pokemons} = this.props;

    let boxes = [];
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
      boxes,
      currentBox: 0
    });
  }

  render() {
    const {collected, tags} = this.props;
    const {boxes, currentBox} = this.state;
    const {formatMessage} = this.props.intl;

    let box;
    let toolbar;

    if (_.isInteger(currentBox)) {
      let currentBoxObject = boxes[currentBox];
      box = <Box box={currentBoxObject} cols={BOX_COLS} collected={collected} tags={tags}/>;
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

PokemonPc.displayName = 'PokemonPcComponent';

PokemonPc.propTypes = {
    intl: intlShape.isRequired
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokemons.data
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonPc));
