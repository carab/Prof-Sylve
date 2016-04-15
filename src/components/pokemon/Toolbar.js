'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

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

    this.state = {
      collected: null,
    };

    this.collectedRef = FirebaseUtils.getUserRef().child('collected');
    this.tagsRef = FirebaseUtils.getUserRef().child('tags');
  }

  componentDidMount() {
    this.onCollectedChange = this.collectedRef.on('value', (snap) => {
      let collected = Object.keys(snap.val()).length;

      this.setState({ collected });
    });

    this.onTagsChange = this.tagsRef.on('value', (snap) => {
      let tags = snap.val();
      tags;
    });
  }

  componentWillUnmount() {
    this.collectedRef.off('value', this.onCollectedChange);
    this.tagsRef.off('value', this.onTagsChange);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {collected} = this.state;
    const {pokemons, filteredPokemons, right} = this.props;

    let title = formatMessage(messages.counter, { collected, pokemons: pokemons.length });

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
    pokemons: state.pokemons.data,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonToolbar));
