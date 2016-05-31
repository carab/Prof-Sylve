'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import 'styles/pokemon/Toolbar.css';

const messages = defineMessages({
  counter: {id: 'pokemon.toolbar.counter'},
  filteredPokemons: {id: 'pokemon.toolbar.filteredPokemons'},
});

class PokemonToolbar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, filteredPokemons, right} = this.props;

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
            {right}
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

PokemonToolbar.displayName = 'PokemonToolbarComponent';

PokemonToolbar.propTypes = {
    pokemons: PropTypes.array.isRequired,
    right: PropTypes.object,
    intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokedex,
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
