'use strict';

import React, {Component, PropTypes} from 'react';

import FirebaseUtils from '../../utils/firebase-utils';

import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import CheckBox from 'material-ui/lib/svg-icons/toggle/check-box';
import CheckBoxOutlineBlank from 'material-ui/lib/svg-icons/toggle/check-box-outline-blank';
import Launch from 'material-ui/lib/svg-icons/action/launch';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

require('styles/grid/Pokemon.css');

const messages = defineMessages({
  collected: {
    id: 'pokemon.collected',
    defaultMessage: 'Collected'
  },
  preCollected: {
    id: 'pokemon.preCollected',
    defaultMessage: 'Pre-evolution collected'
  },
  externalService: {
    id: 'pokemon.externalService',
    defaultMessage: 'See on Bulbapedia'
  },
  externalUrl: {
    id: 'pokemon.externalUrl',
    defaultMessage: 'http://bulbapedia.bulbagarden.net/wiki/{name}'
  }
});

class PokemonComponent extends Component {
  constructor(props) {
    super(props);

    this.handleCollected = this.handleCollected.bind(this);
    this.handlePreCollected = this.handlePreCollected.bind(this);
    this.handleStopPropagation = this.handleStopPropagation.bind(this);

    this.state = {};

    this.collectedRef = FirebaseUtils.getUserRef().child('collected').child(props.pokemon.id);
    this.preCollectedRef = FirebaseUtils.getUserRef().child('preCollected').child(props.pokemon.id);
  }

  componentDidMount() {
    this.collectedRef.once('value', (snap) => {
      let collected = snap.val() || false;
      this.setState({ collected });
    });

    this.preCollectedRef.once('value', (snap) => {
      let preCollected = snap.val() || false;
      this.setState({ preCollected });
    });
  }

  render() {
    const {pokemon} = this.props;
    const {formatMessage} = this.props.intl;
    const dynamicMessages = defineMessages({
      name: {
        id: 'pokemon.name.' + pokemon.id
      }
    });

    const name = formatMessage(dynamicMessages.name);
    const externalUrl = formatMessage(messages.externalUrl, { name });

    let image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + pokemon.name + '.gif';

    let style = {};
    let titleColor = 'rgba(0, 188, 212, 0.7)';
    let collectedIcon = <CheckBoxOutlineBlank/>;
    let preCollectedIcon = <CheckBoxOutlineBlank/>;

    if (this.state.preCollected) {
      titleColor = 'rgba(0, 188, 212, 0.4)';
      preCollectedIcon = <CheckBox/>;
    }

    let preCollectedMenuItem = <MenuItem primaryText={formatMessage(messages.preCollected)} leftIcon={preCollectedIcon} onClick={this.handlePreCollected}/>;

    if (this.state.collected) {
      style.opacity = '0.5';
      titleColor = 'rgba(0, 0, 0, 0.4)';
      collectedIcon = <CheckBox/>;
      preCollectedMenuItem = '';
    }

    return (
      <GridTile
        className="pokemon-component pokemon-component--tile"
        style={style}
        title={name}
        titleBackground={titleColor}
        onClick={this.handleCollected}
        actionIcon={
          <IconMenu
            iconButtonElement={
              <IconButton onClick={this.handleStopPropagation}><MoreVertIcon color="#fff" /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText={formatMessage(messages.collected)} leftIcon={collectedIcon} onClick={this.handleCollected}/>
            {preCollectedMenuItem}
            <Divider/>
            <MenuItem primaryText={formatMessage(messages.externalService)} leftIcon={<Launch/>} href={externalUrl} target="_blank"/>
          </IconMenu>
        }
      >
        <img alt={pokemon.name} src={image}/>
      </GridTile>
    );
  }

  handleStopPropagation(e) {
    e.stopPropagation();
  }

  handleCollected() {
    let collected = !this.state.collected;

    if (collected) {
      this.collectedRef.set(collected);
    } else {
      this.collectedRef.remove();
    }

    this.setState({ collected });
  }

  handlePreCollected() {
    let preCollected = !this.state.preCollected;

    if (preCollected) {
      this.preCollectedRef.set(preCollected);
    } else {
      this.preCollectedRef.remove();
    }

    this.setState({ preCollected });
  }
}

PokemonComponent.displayName = 'GridPokemonComponent';

PokemonComponent.propTypes = {
    pokemon: PropTypes.any.isRequired,
    intl: intlShape.isRequired
};
PokemonComponent.defaultProps = {
  pokemon: {}
};

export default injectIntl(PokemonComponent);
