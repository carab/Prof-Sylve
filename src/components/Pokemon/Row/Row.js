'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import classnames from 'classnames';

import Checkbox from 'material-ui/Checkbox';

import PokemonMenu from 'components/Pokemon/Menu/Menu';
import Pokeball from 'components/Pokemon/Pokeball';

import actions from 'actions';
import Colors from 'utils/colors';

import './Row.css';

class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {locale, selected, selecting, disabled} = this.props;
    const {collected, tag} = this.props.pokemon;
    const {hover} = this.state;

    return (
      collected !== nextProps.pokemon.collected ||
      tag !== nextProps.pokemon.tag ||
      locale !== nextProps.locale ||
      selected !== nextProps.selected ||
      selecting !== nextProps.selecting ||
      disabled !== nextProps.disabled ||
      hover !== nextState.hover
    );
  }

  render() {
    const {pokemon, selected, selecting, disabled} = this.props;
    const {formatMessage} = this.props.intl;
    const {hover} = this.state;

    const id = pokemon.id;
    const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });

    const styles = {
      tile: {},
      footer: {},
      id: { background: Colors.default },
    };

    if (pokemon.tag !== 'none') {
      styles.id.background = Colors.tags[pokemon.tag];
    }

    if (pokemon.collected) {

    }

    const classes = classnames({
      'PokemonRow': true,
      'PokemonRow--collected': pokemon.collected,
      'PokemonRow--selected': selected,
      'PokemonRow--selecting': selecting,
      'PokemonRow--hover': hover,
      'PokemonRow--disabled': disabled,
    });

    return (
      <div className={classes} style={styles.tile}
        onTouchTap={this.handleTouch}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.renderSelector()}
        {this.renderPokeball()}
        <div className="Pokemon__id" style={styles.id}>
          {id}
        </div>
        <div className="PokemonRow__name">
          {name}
        </div>
        {this.renderMenu()}
      </div>
    );
  }

  renderPokeball() {
    return (
      <div className="PokemonRow__pokeball">
        <Pokeball />
      </div>
    );
  }

  renderSelector() {
    const {selected} = this.props;

    return (
      <div className="PokemonRow__selector" onTouchTap={this.handleStopPropagation}>
        <Checkbox checked={selected} onCheck={this.handleSelected}/>
      </div>
    );
  }

  renderMenu() {
    const {pokemon} = this.props;

    return (
      <div className="PokemonRow__menu">
        <PokemonMenu pokemon={pokemon} showPcLink={true}/>
      </div>
    );
  }

  handleMouseEnter = () => {
    this.setState({
      hover: true,
    });
  }

  handleMouseLeave = () => {
    this.setState({
      hover: false,
    });
  }

  handleTouch = () => {
    const {selecting} = this.props;
    const {collected} = this.props.pokemon;

    if (selecting) {
      this.handleSelected();
    } else {
      this.props.onCollected(!collected);
    }
  }

  handleSelected = () => {
    const {selected} = this.props;
    this.props.onSelected(!selected);
  }

  handleStopPropagation = (event) => {
    event.stopPropagation();
  }
}

Row.displayName = 'PokemonRow';
Row.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    disabled: state.ui.currentUsername !== state.profile.username,
    pokemon: currentPokedex.pokemons[ownProps.id-1],
    locale: state.profile.locale,
    selected: state.ui.selected.get(ownProps.id) || false,
    selecting: state.ui.selecting,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollected: (collected) => {
      dispatch(actions.pokedex.setCollected(ownProps.id, collected));
    },
    onSelected: (selected) => {
      dispatch(actions.ui.setSelected(ownProps.id, selected));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Row));
