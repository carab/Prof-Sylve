'use strict';

import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import classnames from 'classnames';

import Checkbox from 'material-ui/Checkbox';

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
    const {locale, selected} = this.props;
    const {collected, tag} = this.props.pokemon;
    const {hover} = this.state;

    return (
      collected !== nextProps.pokemon.collected ||
      tag !== nextProps.pokemon.tag ||
      locale !== nextProps.locale ||
      hover !== nextState.hover ||
      selected !== nextProps.selected
    );
  }

  render() {
    const {pokemon, selected} = this.props;
    const {formatMessage} = this.props.intl;

    const id = pokemon.id;
    const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });
    const image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + pokemon.name + '.gif';

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
      'PokemonTile': true,
      'PokemonTile--collected': pokemon.collected,
      'PokemonTile--selected': selected,
    });

    return (
      <div className={classes} style={styles.tile}
        onTouchTap={this.handleCollected}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.renderCheckbox()}
        <div className="PokemonTile__content">
          <img className="PokemonTile__image" alt={name} src={image}/>
        </div>
        <div className="PokemonTile__footer" style={styles.footer}>
          <div className="PokemonTile__id" style={styles.id}>
          {id}
          </div>
          <div className="PokemonTile__name">
            {name}
          </div>
        </div>
      </div>
    );
  }

  renderCheckbox() {
    const {selected} = this.props;
    const {hover} = this.state;

    if (hover) {
      return (
        <div className="PokemonTile__checkbox" onTouchTap={this.handleStopPropagation}>
          <Checkbox checked={selected} onCheck={this.handleSelected}/>
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

  handleCollected = () => {
    const {collected} = this.props.pokemon;
    this.props.onCollected(!collected);
  }

  handleSelected = () => {
    const {selected} = this.props;
    console.log(selected);
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
    pokemon: currentPokedex.pokemons[ownProps.id-1],
    locale: state.profile.locale,
    selected: state.ui.selected.get(ownProps.id) || false,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollected: (collected) => {
      dispatch(actions.pokedex.setCollected(ownProps.id, collected));
    },
    onTag: (color) => {
      dispatch(actions.pokedex.setTag(ownProps.id, color));
    },
    onSelected: (selected) => {
      console.log(selected);
      dispatch(actions.ui.setSelected(ownProps.id, selected));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Tile));
