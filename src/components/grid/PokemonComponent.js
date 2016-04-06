'use strict';

import React from 'react';

import FirebaseUtils from '../../utils/firebase-utils';

import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import CheckBox from 'material-ui/lib/svg-icons/toggle/check-box';
import CheckBoxOutlineBlank from 'material-ui/lib/svg-icons/toggle/check-box-outline-blank';

require('styles/grid/Pokemon.css');

class PokemonComponent extends React.Component {
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
    let image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + this.props.pokemon.name + '.gif';

    let style = {};
    let titleColor = 'rgba(0, 188, 212, 0.7)';
    let collectedIcon = <CheckBoxOutlineBlank/>;
    let preCollectedIcon = <CheckBoxOutlineBlank/>;

    if (this.state.preCollected) {
      titleColor = 'rgba(0, 188, 212, 0.4)';
      preCollectedIcon = <CheckBox/>;
    }

    let preCollectedMenuItem = <MenuItem primaryText="Pre-evolution collected" leftIcon={preCollectedIcon} onClick={this.handlePreCollected}/>;

    if (this.state.collected) {
      style.opacity = '0.5';
      titleColor = 'rgba(0, 0, 0, 0.4)';
      collectedIcon = <CheckBox/>;
      preCollectedMenuItem = '';
    }

    return (
      <GridTile
        className="pokemon-component"
        style={style}
        title={this.props.pokemon.name}
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
            <MenuItem primaryText="Collected" leftIcon={collectedIcon} onClick={this.handleCollected}/>
            {preCollectedMenuItem}
            <Divider/>
            <MenuItem primaryText="See Pokepedia page"/>
          </IconMenu>
        }
      >
        <img alt={this.props.pokemon.name} src={image}/>
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

PokemonComponent.propTypes = {};
PokemonComponent.defaultProps = {
  pokemon: {}
};

export default PokemonComponent;
