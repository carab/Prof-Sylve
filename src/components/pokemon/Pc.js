'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactSwipe from 'react-swipe';
import _ from 'lodash';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
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
    this.handleSwipe = this.handleSwipe.bind(this);

    this.state = {
      boxes: [],
    };
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentBox: parseInt(nextProps.params.currentBox) || 0,
    })
  }

  render() {
    const {pokemons, intl} = this.props;
    const {formatMessage} = intl;
    const {boxes, currentBox} = this.state;

    boxes.length = 0;
    let box = null;

    _.each(pokemons, (pokemon) => {
      if (null === box) {
        box = this.getEmptyBox();
        box.start = pokemon.id;
        box.index = boxes.length;
        boxes.push(box);
      }

      box.pokemons.push(pokemon);
      box.end = pokemon.id;
      box.count++;

      if (box.count === BOX_SIZE) {
        box = null;
      }
    });


    const toolbar = (
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

    return (
      <div className="PokemonPc container">
        <Paper zDepth={1}>
          {toolbar}
          <ReactSwipe ref="swipe" swipeOptions={{continuous: false, startSlide: currentBox, callback: this.handleSwipe}}>
            {_.map(boxes, (box, i) => (
              <div key={i}>
                {this.renderBox(box)}
              </div>
            ))}
          </ReactSwipe>
        </Paper>
      </div>
    );
  }

  renderBox(box) {
    const {currentBox} = this.state;

    if (box.index >= currentBox-1 && box.index <= currentBox+1) {
      return <Box box={box} cols={BOX_COLS}/>;
    }

    return 'loading';
  }

  handleSwipe(index) {
    this.context.router.push('/pc/' + index);
  }

  handleSelectBox(event, index, currentBox) {
    this.refs.swipe.slide(index, 300);
  }

  handlePreviousBox() {
    this.refs.swipe.prev();
  }

  handleNextBox() {
    this.refs.swipe.next();
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
PokemonPc.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

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
