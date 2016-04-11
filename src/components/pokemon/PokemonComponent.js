'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import GridTile from 'material-ui/lib/grid-list/grid-tile';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Checkbox from 'material-ui/lib/checkbox';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import LaunchIcon from 'material-ui/lib/svg-icons/action/launch';
import BookmarkIcon from 'material-ui/lib/svg-icons/action/bookmark';
import DoneIcon from 'material-ui/lib/svg-icons/action/done';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';
import Colors from '../../utils/colors';

import 'styles/pokemon/Pokemon.css';

const messages = defineMessages({
  collected: {id: 'pokemon.collected'},
  tag: {id: 'pokemon.tag.tag'},
  force: {id: 'pokemon.tag.force'},
  none: {id: 'pokemon.tag.none'},
  externalService: {id: 'pokemon.externalService'},
  externalUrl: {id: 'pokemon.externalUrl'},
  red: {id: 'pokemon.tag.color.red'},
  orange: {id: 'pokemon.tag.color.orange'},
  green: {id: 'pokemon.tag.color.green'},
  indigo: {id: 'pokemon.tag.color.indigo'},
  purple: {id: 'pokemon.tag.color.purple'}
});

class PokemonComponent extends Component {
  constructor(props) {
    super(props);

    this.handleCollected = this.handleCollected.bind(this);
    this.handleStopPropagation = this.handleStopPropagation.bind(this);

    this.state = {
      tag: {},
      colors: {}
    };

    this.collectedRef = FirebaseUtils.getUserRef().child('collected').child(props.pokemon.id);
    this.tagRef = FirebaseUtils.getUserRef().child('tags').child(props.pokemon.id);
    this.colorsRef = FirebaseUtils.getUserRef().child('settings/colors');
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

    this.colorsRef.once('value', (snap) => {
      let colors = snap.val() || {};
      this.setState({ colors });
    });
  }

  render() {
    const {pokemon, type} = this.props;
    const {collected, tag, colors} = this.state;
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
    let defaultColor = Colors.default;
    let tagColor = tag.color || false;
    let force = tag.force || false;
    let color;

    if (collected) {
      style.opacity = '0.7';
      defaultColor = Colors.collected;
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

    let menuButton = <IconButton><MoreVertIcon/></IconButton>;

    if (type === 'tile') {
      menuButton = <IconButton onTouchTap={this.handleStopPropagation}><MoreVertIcon color="#fff" /></IconButton>;
    }

    let menu = (
      <IconMenu
        iconButtonElement={menuButton}
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
        {_.map(Colors.tags, (color) => (
          <MenuItem primaryText={colors[color.name] || formatMessage(messages[color.name])}
            key={color.name}
            leftIcon={<BookmarkIcon style={{fill: color.value}}/>}
            onTouchTap={() => this.handleTagColor(color.value)}
            rightIcon={getColorIcon(color.value, tagColor)}
          />
        ))}
        <Divider/>
        <MenuItem primaryText={formatMessage(messages.force)} disabled={!tagColor} leftIcon={<Checkbox disabled={!tagColor} checked={force}/>} onTouchTap={() => this.handleTagForce(!force)}/>
      </IconMenu>
    )

    if (type === 'tile') {
      return (
        <GridTile
          className="pokemon-component pokemon-component--tile"
          style={style}
          title={pokemon.id + ' - ' + name}
          titleBackground={color}
          onTouchTap={this.handleCollected}
          actionIcon={menu}
        >
          <img alt={pokemon.name} src={image}/>
        </GridTile>
      );
    }

    if (type === 'item') {
      return (
        <ListItem
          className="pokemon-component pokemon-component--item"
          primaryText={pokemon.id + ' - ' + name}
          rightIconButton={menu}
          onTouchTap={this.handleCollected}
          leftIcon={<BookmarkIcon style={{fill: color}}/>}
          style={style}
        />
      );
    }

    return <div></div>;
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

PokemonComponent.displayName = 'PokemonPokemonComponent';

PokemonComponent.propTypes = {
  type: PropTypes.string.isRequired,
  pokemon: PropTypes.any.isRequired,
  intl: intlShape.isRequired
};

PokemonComponent.defaultProps = {
  pokemon: {}
};

export default injectIntl(PokemonComponent);
