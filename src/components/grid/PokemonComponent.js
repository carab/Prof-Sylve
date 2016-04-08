'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import FirebaseUtils from '../../utils/firebase-utils';

import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Checkbox from 'material-ui/lib/checkbox';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import LaunchIcon from 'material-ui/lib/svg-icons/action/launch';
import BookmarkIcon from 'material-ui/lib/svg-icons/action/bookmark';
import DoneIcon from 'material-ui/lib/svg-icons/action/done';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

require('styles/grid/Pokemon.css');

const colors = {
  default: 'rgba(0, 188, 212, 0.7)',
  collected: 'rgba(0, 0, 0, 0.4)',
  tags: [
    { name: 'red', value: '#F44336' },
    //{ name: 'yellow', value: '#FFEB3B' },
    { name: 'green', value: '#4CAF50' },
    //{ name: 'cyan', value: '#00BCD4' },
    //{ name: 'pink', value: '#E91E63' },
    { name: 'orange', value: '#FF9800' },
    //{ name: 'purple', value: '#9C27B0' },
    { name: 'indigo', value: '#3F51B5' }
    //{ name: 'teal', value: '#009688' },
    //{ name: 'lime', value: '#CDDC39' },
    //{ name: 'brown', value: '#795548' }
  ]
};

const messages = defineMessages({
  collected: {
    id: 'pokemon.collected',
    defaultMessage: 'Collected'
  },
  tag: {
    id: 'pokemon.tag.tag',
    defaultMessage: 'Tag'
  },
  force: {
    id: 'pokemon.tag.force',
    defaultMessage: 'Force color'
  },
  none: {
    id: 'pokemon.tag.none',
    defaultMessage: 'None'
  },
  externalService: {
    id: 'pokemon.externalService',
    defaultMessage: 'See on Bulbapedia'
  },
  externalUrl: {
    id: 'pokemon.externalUrl',
    defaultMessage: 'http://bulbapedia.bulbagarden.net/wiki/{name}'
  },
  red: {
    id: 'pokemon.tag.color.red',
    defaultMessage: 'Red'
  },
  orange: {
    id: 'pokemon.tag.color.orange',
    defaultMessage: 'Orange'
  },
  green: {
    id: 'pokemon.tag.color.green',
    defaultMessage: 'Green'
  },
  indigo: {
    id: 'pokemon.tag.color.indigo',
    defaultMessage: 'Indigo'
  }
});

class PokemonComponent extends Component {
  constructor(props) {
    super(props);

    this.handleCollected = this.handleCollected.bind(this);
    this.handleStopPropagation = this.handleStopPropagation.bind(this);

    this.state = {
      tag: {}
    };

    this.collectedRef = FirebaseUtils.getUserRef().child('collected').child(props.pokemon.id);
    this.tagRef = FirebaseUtils.getUserRef().child('tags').child(props.pokemon.id);
  }

  componentDidMount() {
    this.collectedRef.once('value', (snap) => {
      let collected = snap.val() || false;
      this.setState({ collected });
    });

    this.tagRef.once('value', (snap) => {
      let tag = snap.val() || {};
      this.setState({ tag });
    });
  }

  render() {
    const {pokemon} = this.props;
    const {collected, tag} = this.state;
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
    let defaultColor = colors.default;
    let tagColor = tag.color || false;
    let force = tag.force || false;
    let color;

    if (collected) {
      style.opacity = '0.7';
      defaultColor = colors.collected;
    }

    if (tagColor && (!collected || force)) {
      color = tagColor;
    } else {
      color = defaultColor;
    }

    let getColorIcon = (color, referenceColor) => {
      if (color === referenceColor) {
        return <DoneIcon/>;
      }
    };

    return (
      <GridTile
        className="pokemon-component pokemon-component--tile"
        style={style}
        title={name}
        titleBackground={color}
        onTouchTap={this.handleCollected}
        actionIcon={
          <IconMenu
            iconButtonElement={
              <IconButton onTouchTap={this.handleStopPropagation}><MoreVertIcon color="#fff" /></IconButton>
            }
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={collected}/>} onClick={this.handleCollected}/>
            <MenuItem primaryText={formatMessage(messages.externalService)} leftIcon={<LaunchIcon/>} href={externalUrl} target="_blank"/>
            <Divider/>
            <MenuItem primaryText={formatMessage(messages.none)}
              leftIcon={<BookmarkIcon style={{fill: defaultColor}}/>}
              onTouchTap={() => this.handleTagRemove()}
              rightIcon={getColorIcon(defaultColor, color)}
            />
            {_.map(colors.tags, (color) => (
              <MenuItem primaryText={formatMessage(messages[color.name])}
                key={color.name}
                leftIcon={<BookmarkIcon style={{fill: color.value}}/>}
                onTouchTap={() => this.handleTagColor(color.value)}
                rightIcon={getColorIcon(color.value, tagColor)}
              />
            ))}
            <Divider/>
            <MenuItem primaryText={formatMessage(messages.force)} disabled={!tagColor} leftIcon={<Checkbox disabled={!tagColor} checked={force}/>} onTouchTap={() => this.handleTagForce(!force)}/>
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

  handleTagColor(color) {
    let tag = Object.assign({}, this.state.tag, { color });
    this.tagRef.set(tag);
    this.setState({ tag });
  }

  handleTagRemove() {
    let tag = {};
    this.tagRef.remove();
    this.setState({ tag });
  }

  handleTagForce(force) {
    let tag = Object.assign({}, this.state.tag, { force });
    this.tagRef.set(tag);
    this.setState({ tag });
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
