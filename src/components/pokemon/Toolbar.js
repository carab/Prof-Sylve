'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

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

    let title = formatMessage(messages.counter, { collected: 1, pokemons: pokemons.length });

    if (_.isArray(filteredPokemons) && filteredPokemons.length < pokemons.length) {
      title = formatMessage(messages.filteredPokemons, { filteredPokemons: filteredPokemons.length });
    }

    return (
      <div className="pokemon-toolbar">
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
    pokemons: state.user.data.pokedex,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonToolbar));
