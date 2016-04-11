'use strict';

import React from 'react';
import _ from 'lodash';

import IconButton from 'material-ui/lib/icon-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ImageNavigateBefore from 'material-ui/lib/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/lib/svg-icons/image/navigate-next';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import BoxComponent from 'components/pokemon/BoxComponent';
import ToolbarComponent from 'components/pokemon/ToolbarComponent';

import FirebaseUtils from '../../utils/firebase-utils';

import 'styles/pokemon/Pc.css';

const messages = defineMessages({
  box: {id: 'pokemon.toolbar.box'},
  previousBox: {id: 'pokemon.toolbar.previousBox'},
  nextBox: {id: 'pokemon.toolbar.nextBox'}
});

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
    const {pokemons, boxes, currentBox} = this.state;
    const {formatMessage} = this.props.intl;

    let box;
    let toolbar;

    if (_.isInteger(currentBox)) {
      let currentBoxObject = boxes[currentBox];
      box = <BoxComponent box={currentBoxObject} cols={BOX_COLS}/>;
      toolbar = (
        <ToolbarComponent
          pokemons={pokemons}
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

PcComponent.displayName = 'PokemonPcComponent';

PcComponent.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(PcComponent);
