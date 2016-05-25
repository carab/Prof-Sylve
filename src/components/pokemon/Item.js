'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import {GridTile} from 'material-ui/GridList';
import {ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import Colors from '../../utils/colors';
import Actions from '../../actions';

import 'styles/pokemon/Pokemon.css';

const messages = defineMessages({
  collected: {id: 'pokemon.collected'},
  tag: {id: 'pokemon.tag.tag'},
  none: {id: 'pokemon.tag.none'},
  externalService: {id: 'pokemon.externalService'},
  externalUrl: {id: 'pokemon.externalUrl'},
  red: {id: 'pokemon.tag.color.red'},
  yellow: {id: 'pokemon.tag.color.yellow'},
  green: {id: 'pokemon.tag.color.green'},
  cyan: {id: 'pokemon.tag.color.cyan'},
  pink: {id: 'pokemon.tag.color.pink'},
  orange: {id: 'pokemon.tag.color.orange'},
  purple: {id: 'pokemon.tag.color.purple'},
  indigo: {id: 'pokemon.tag.color.indigo'},
  teal: {id: 'pokemon.tag.color.teal'},
  lime: {id: 'pokemon.tag.color.lime'},
  brown: {id: 'pokemon.tag.color.brown'},
});

const anchorOrigin = {horizontal: 'right', vertical: 'top'};
const targetOrigin = {horizontal: 'right', vertical: 'top'};

class PokemonComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleStopPropagation = this.handleStopPropagation.bind(this);
    this.handleCollected = this.handleCollected.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {collected, tag} = this.props.pokemon;

    return (
      collected !== nextProps.pokemon.collected ||
      tag !== nextProps.pokemon.tag
    );
  }

  render() {
    const {pokemon, tags, type} = this.props;
    const {onCollected, onTagRemove, onTag} = this.props;
    const {formatMessage} = this.props.intl;

    const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });

    const style = {};
    let color = Colors.default;

    if (pokemon.tag) {
      color = Colors.tags[pokemon.tag];
    }

    if (pokemon.collected) {
      color = Colors.collected;
      style.opacity = '0.7';
    }

    const menuButton = this.renderMenuButton(type);
    const externalUrl = formatMessage(messages.externalUrl, { name });

    const menu = (
      <IconMenu
        iconButtonElement={menuButton}
        targetOrigin={targetOrigin}
        anchorOrigin={anchorOrigin}
        value={pokemon.tag}
      >
        <MenuItem primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={pokemon.collected}/>} onTouchTap={this.handleCollected}/>
        <MenuItem primaryText={formatMessage(messages.externalService)} leftIcon={<LaunchIcon/>} href={externalUrl} target="_blank"/>
        <Divider/>
        <MenuItem primaryText={formatMessage(messages.none)}
          leftIcon={<BookmarkIcon style={{ fill: Colors.default }}/>}
          onTouchTap={this.handleTag.bind(this, false)}
          value={false}
        />
        {_.map(Colors.tags, (color, name) => (
          <MenuItem primaryText={tags[name] && tags[name].title || formatMessage(messages[name])}
            key={name}
            leftIcon={<BookmarkIcon style={{fill: color}}/>}
            onTouchTap={this.handleTag.bind(this, name)}
            value={name}
          />
        ))}
      </IconMenu>
    );

    if (type === 'tile') {
      const image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + pokemon.name + '.gif';

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

    if (type === 'row') {
      return (
        <ListItem
          className="pokemon-component pokemon-component--item"
          primaryText={pokemon.id + ' - ' + name}
          rightIconButton={menu}
          leftIcon={<BookmarkIcon style={{fill: color}} onTouchTap={this.handleCollected}/>}
          style={style}
        />
      );
    }

    return <div></div>;
  }

  renderMenuButton(type) {
    if (type === 'tile') {
      return <IconButton onTouchTap={this.handleStopPropagation}><MoreVertIcon color="#fff" /></IconButton>;
    }

    return <IconButton><MoreVertIcon/></IconButton>;
  }

  handleCollected() {
    const {pokemon, onCollected} = this.props;
    onCollected();
  }

  handleTag(tag) {
    const {pokemon, onTag} = this.props;
    onTag(tag);
  }

  handleStopPropagation(e) {
    e.stopPropagation();
  }
}

PokemonComponent.displayName = 'PokemonItemComponent';

PokemonComponent.propTypes = {
  type: PropTypes.string.isRequired,
  pokemon: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  const {pokemon} = props;

  return {
    tags: state.user.data.profile.tags
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const {pokemon} = props;

  return {
    onCollected: () => {
      dispatch(Actions.savePokemonCollected(pokemon));
    },
    onTag: (color) => {
      dispatch(Actions.savePokemonTag(pokemon, color));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonComponent));
