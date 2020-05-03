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

import './Tile.css';

class Tile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {locale, selected, selecting, disabled, touch} = this.props;
    const {collected, tag} = this.props.pokemon;
    const {hover} = this.state;

    return (
      collected !== nextProps.pokemon.collected ||
      tag !== nextProps.pokemon.tag ||
      locale !== nextProps.locale ||
      selected !== nextProps.selected ||
      selecting !== nextProps.selecting ||
      disabled !== nextProps.disabled ||
      touch !== nextProps.touch ||
      hover !== nextState.hover
    );
  }

  render() {
    const {pokemon, selected, selecting, disabled, touch} = this.props;
    const {hover} = this.state;

    const classes = classnames({
      'PokemonTile': true,
      'PokemonTile--collected': pokemon.collected,
      'PokemonTile--selected': selected,
      'PokemonTile--selecting': selecting,
      'PokemonTile--hover': hover && !touch,
      'PokemonTile--disabled': disabled,
    });

    return (
      <div className={classes}
        onTouchTap={this.handleTouch}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="PokemonTile__content">
          {this.renderPokeball()}
          <div className="PokemonTile__image">
            <span className={`Sprite Sprite--${pokemon.name}`}></span>
          </div>
        </div>
        {this.renderSelector()}
        {this.renderMenu()}
        <div className="PokemonTile__footer">
          {this.renderId()}
          {this.renderName()}
        </div>
      </div>
    );
  }

  renderId() {
    const {pokemon} = this.props;

    const style = {
      background: Colors.default,
    };

    if (pokemon.tag && pokemon.tag !== 'none') {
      style.background = Colors.tags[pokemon.tag];
    }

    return (
      <div className="Pokemon__id" style={style}>
        {pokemon.id}
      </div>
    );
  }

  renderName() {
    const {touch, pokemon} = this.props;
    
    if (!touch) {
      const {formatMessage} = this.props.intl;
      const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });

      return (
        <div className="PokemonTile__name">
          {name}
        </div>
      );
    }
  }

  renderPokeball() {
    return (
      <div className="PokemonTile__pokeball">
        <Pokeball />
      </div>
    );
  }

  renderSelector() {
    const {selected, disabled} = this.props;

    if (!disabled) {
      return (
        <div className="PokemonTile__selector" onTouchTap={this.handleStopPropagation}>
          <Checkbox checked={selected} onCheck={this.handleSelected}/>
        </div>
      );
    }
  }

  renderMenu() {
    const {pokemon, disabled} = this.props;

    if (!disabled) {
      return (
        <div className="PokemonTile__menu">
          <PokemonMenu pokemon={pokemon}/>
        </div>
      );
    }
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

Tile.displayName = 'PokemonTile';
Tile.propTypes = {};

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
)(Tile));
