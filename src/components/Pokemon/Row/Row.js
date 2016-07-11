'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import classnames from 'classnames';

import Checkbox from 'material-ui/Checkbox';

import PokemonMenu from 'components/Pokemon/Menu/Menu';

import actions from 'actions';
import Colors from 'utils/colors';

import 'prof-sylve-sprites/sprite/sprite.css';

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
        <svg viewBox="92.412 180.844 427.177 430.313">
          <path d="M369.448,395.99c0,35.041-28.407,63.448-63.448,63.448c-35.042,0-63.449-28.407-63.449-63.448 c0-35.042,28.407-63.448,63.449-63.448C341.041,332.542,369.448,360.949,369.448,395.99L369.448,395.99z M305.972,180.844 c-109.894,0-200.541,82.37-213.561,188.743h115.612c11.616-43.213,51.065-75.002,97.948-75.002 c46.884,0,86.375,31.789,98.004,75.002h115.612C506.561,263.214,415.866,180.844,305.972,180.844z M92.412,422.412 c13.02,106.373,103.667,188.744,213.561,188.744s200.589-82.371,213.616-188.744H403.976c-11.629,43.213-51.12,75.003-98.004,75.003 c-46.883,0-86.332-31.79-97.948-75.003H92.412L92.412,422.412z"/>
        </svg>
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
        <PokemonMenu pokemon={pokemon}/>
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
