'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import 'styles/pokemon/Toolbar.css';

const messages = defineMessages({
  counter: {id: 'pokemon.toolbar.counter'},
  filteredPokemons: {id: 'pokemon.toolbar.filteredPokemons'},
  box: {id: 'pokemon.toolbar.box'},
});

class PokemonToolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, filteredPokemons} = this.props;

    const collected = _.reduce(pokemons, (collected, pokemon) => {
      return collected + (pokemon.collected ? 1 : 0);
    }, 0);

    let title = formatMessage(messages.counter, { collected, pokemons: pokemons.length });

    if (_.isArray(filteredPokemons) && filteredPokemons.length < pokemons.length) {
      title = formatMessage(messages.filteredPokemons, { filteredPokemons: filteredPokemons.length });
    }

    return (
      <div className="PokemonToolbar">
        <Toolbar>
          <ToolbarGroup float="left">
            <ToolbarTitle text={title}/>
          </ToolbarGroup>
          <ToolbarGroup float="right">
            {this.renderBoxes()}
            {this.renderFilter()}
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }

  renderFilter() {
    return this.props.right;
  }

  renderBoxes() {
    const {formatMessage} = this.props.intl;
    const {boxes, currentBox, onSelectBox} = this.props;

    if (!boxes) {
      return;
    }

    return (
      <div>
        <DropDownMenu value={currentBox} onChange={onSelectBox}>
          {_.map(boxes, (box, i) => (
            <MenuItem value={i} primaryText={formatMessage(messages.box, { start: box.start, end: box.end })} key={i}/>
          ))}
        </DropDownMenu>
      </div>
    );
  }
}

PokemonToolbar.displayName = 'PokemonToolbarComponent';
PokemonToolbar.propTypes = {};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    currentBox: state.ui.currentBox,
    pokemons: currentPokedex.pokemons,
    locale: state.profile.locale,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonToolbar));
