'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ReactSwipe from 'react-swipe';
import {injectIntl, defineMessages} from 'react-intl';
import _ from 'lodash';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import NavigateBeforeIcon from 'material-ui/svg-icons/image/navigate-before';
import NavigateNextIcon from 'material-ui/svg-icons/image/navigate-next';

import PokedexBox from 'components/Pokedex/Box/Box';
import PokedexToolbar from 'components/Pokedex/Toolbar/Toolbar';

import actions from 'actions';

import './Pc.css';

const messages = defineMessages({
  previousBox: {id: 'pokemon.toolbar.previousBox'},
  nextBox: {id: 'pokemon.toolbar.nextBox'},
  box: {id: 'pokemon.toolbar.box'},
});

export const BOX_COLS = 6;
export const BOX_ROWS = 5;
export const BOX_SIZE = BOX_COLS * BOX_ROWS;

class PokedexPc extends Component {
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
    const {params} = this.props;
    const {pokemons, setCurrentBox} = this.props;
    const currentBox = parseInt(params.currentBox) || this.props.currentBox;

    if (currentBox !== this.props.currentBox) {
      setCurrentBox(currentBox);
    }

    const count = Math.ceil(pokemons / BOX_SIZE);
    const boxes = [];

    for (let i = 0; i < count; i++) {
      boxes.push({
        index: i,
        start: i * BOX_SIZE,
        end: (i + 1) * BOX_SIZE,
      });
    }

    this.setState({
      currentBox,
      boxes,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.params.currentBox !== this.props.currentBox) {
      this.handleSelectBox(undefined, nextProps.params.currentBox);
    }

    return (nextProps.currentBox !== this.props.currentBox);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {currentBox, boxes} = this.state;

    return (
      <div className="PokedexPc container">
        <Paper zDepth={1} className="PokedexPc__paper">
          <PokedexToolbar showFiltered={false} right={this.renderBoxes()}/>
          <div className="PokedexPc__view">
            <div className="PokedexPc__previousBox">
              <IconButton onClick={this.handlePreviousBox} tooltip={formatMessage(messages.previousBox)}>
                <NavigateBeforeIcon/>
              </IconButton>
            </div>
            <div className="PokedexPc__boxes">
              <ReactSwipe ref="swipe" swipeOptions={{continuous: false, startSlide: currentBox, transitionEnd: this.handleSwipe}}>
                {_.map(boxes, (box) => (
                  <div key={box.index}>
                    <PokedexBox box={box}/>
                  </div>
                ))}
              </ReactSwipe>
            </div>
            <div className="PokedexPc__nextBox">
              <IconButton onClick={this.handleNextBox} tooltip={formatMessage(messages.nextBox)}>
                <NavigateNextIcon/>
              </IconButton>
            </div>
          </div>
        </Paper>
      </div>
    );
  }

  renderBoxes() {
    const {formatMessage} = this.props.intl;
    const {currentBox} = this.props;
    const {boxes} = this.state;

    if (boxes) {
      return (
        <div className="PokemonToolbar__boxes">
          <DropDownMenu value={currentBox} onChange={this.handleSelectBox}>
            {_.map(boxes, (box) => (
              <MenuItem value={box.index} primaryText={formatMessage(messages.box, { start: box.start + 1, end: box.end })} key={box.index}/>
            ))}
          </DropDownMenu>
        </div>
      );
    }
  }

  handleSwipe(currentBox) {
    this.context.router.push(`/pokedex/${this.props.currentUsername}/pc/${currentBox}`);
    this.props.setCurrentBox(currentBox);
  }

  handleSelectBox(event, index) {
    this.refs.swipe.slide(index, 300);
  }

  handlePreviousBox() {
    this.refs.swipe.prev();
  }

  handleNextBox() {
    this.refs.swipe.next();
  }
}

PokedexPc.displayName = 'PokedexPc';
PokedexPc.propTypes = {};
PokedexPc.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    currentBox: state.ui.currentBox,
    pokemons: currentPokedex.pokemons.length,
    currentUsername: state.ui.currentUsername,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentBox(currentBox) {
      dispatch(actions.ui.setCurrentBox(currentBox));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokedexPc));
