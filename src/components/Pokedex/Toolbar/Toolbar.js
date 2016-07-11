'use strict';

import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import classnames from 'classnames';

import Checkbox from 'material-ui/Checkbox';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import PokemonMenu from 'components/Pokemon/Menu/Menu';

import actions from 'actions';

import './Toolbar.css';

const messages = defineMessages({
  counter: {id: 'pokemon.toolbar.counter'},
  filteredPokemons: {id: 'pokemon.toolbar.filteredPokemons'},
  selected: {id: 'pokedex.selected'},
});

class PokemonToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  render() {
    const {selecting} = this.props;

    const classes = classnames({
      'PokemonToolbar': true,
      'PokemonToolbar--selecting': selecting,
    });

    return (
      <div className={classes}>
        <div className="PokemonToolbar__group">
          {this.renderSelector()}
          {this.renderTitle()}
        </div>
        <div className="PokemonToolbar__group">
          {this.renderRight()}
        </div>
      </div>
    );
  }

  renderSelector() {
    const {filtered, selected, profile, currentUsername} = this.props;

    if (currentUsername === profile.username) {
      const filteredAndSelected = filtered.reduce((filteredAndSelected, id) => {
        return (selected.get(id)) ? ++filteredAndSelected : filteredAndSelected;
      }, 0);

      const checked = (filtered.size > 0 && filteredAndSelected === filtered.size);

      return (
        <div className="PokemonToolbar__selector">
          <Checkbox checked={checked} onCheck={this.handleSelectorCheck}/>
        </div>
      );
    }
  }

  renderTitle() {
    const {pokemons, filtered, showFiltered, selecting, selected} = this.props;
    const {formatMessage} = this.props.intl;

    if (selecting) {
      return (
        <div className="PokemonToolbar__selection">
          {formatMessage(messages.selected, { selected: selected.size })}
          <PokemonMenu icon={<ExpandMoreIcon/>}/>
        </div>
      );
    }

    if (showFiltered && filtered && filtered.size < pokemons.length) {
      return formatMessage(messages.filteredPokemons, { filteredPokemons: filtered.size });
    }

    const collected = _.reduce(pokemons, (collected, pokemon) => {
      return collected + (pokemon.collected ? 1 : 0);
    }, 0);

    return formatMessage(messages.counter, { collected, pokemons: pokemons.length });
  }

  renderRight() {
    const {right} = this.props;
    return right;
  }

  handleSelectorCheck = (event, checked) => {
    const {filtered, onSelected} = this.props;

    filtered.forEach((id) => {
      onSelected(id, checked);
    });
  }

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchor: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
}

PokemonToolbar.displayName = 'PokemonToolbarComponent';
PokemonToolbar.propTypes = {};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    currentBox: state.ui.currentBox,
    currentUsername: state.ui.currentUsername,
    pokemons: currentPokedex.pokemons,
    filtered: state.ui.filtered,
    profile: state.profile,
    selecting: state.ui.selecting,
    selected: state.ui.selected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelected: (id, selected) => {
      dispatch(actions.ui.setSelected(id, selected));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonToolbar));
