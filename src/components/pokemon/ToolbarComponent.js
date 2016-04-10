'use strict';

import React, {Component, PropTypes} from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

const messages = defineMessages({
  counter: {
    id: 'pokemon.toolbar.counter',
    defaultMessage: '{collected} on {total}'
  }
});

require('styles/pokemon/Toolbar.css');

class ToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collected: null
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
    const {pokemons, right} = this.props;

    return (
      <div className="pokemon-toolbar">
        <Toolbar>
          <ToolbarGroup float="left">
            <ToolbarTitle text={formatMessage(messages.counter, { collected, total: pokemons.length })}/>
          </ToolbarGroup>
          <ToolbarGroup float="right">
            {right}
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

ToolbarComponent.displayName = 'GridToolbarComponent';

ToolbarComponent.propTypes = {
    pokemons: PropTypes.array.isRequired,
    right: PropTypes.object,
    intl: intlShape.isRequired
};

export default injectIntl(ToolbarComponent);
