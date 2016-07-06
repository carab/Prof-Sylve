'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import {Link} from 'react-router';
import _ from 'lodash';

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
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';

import {BOX_SIZE} from 'components/Pokedex/Pc/Pc';

import Colors from 'utils/colors';
import actions from 'actions';

import './Pokemon.css';

const messages = defineMessages({
  collected: {id: 'pokemon.collected'},
  tag: {id: 'pokemon.tag.tag'},
  none: {id: 'pokemon.tag.none'},
  externalService: {id: 'pokemon.externalService'},
  externalUrl: {id: 'pokemon.externalUrl'},
  inPc: {id: 'pokemon.inPc'},
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
    const {locale} = this.props;
    const {collected, tag} = this.props.pokemon;

    return (
      collected !== nextProps.pokemon.collected ||
      tag !== nextProps.pokemon.tag ||
      locale !== nextProps.locale
    );
  }

  render() {
    const {pokemon, tags, type, mode, currentUsername, profile} = this.props;
    const {formatMessage} = this.props.intl;

    const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });

    const style = {};
    let color = Colors.default;

    if (pokemon.tag !== 'none') {
      color = Colors.tags[pokemon.tag];
    }

    if (pokemon.collected) {
      color = Colors.collected;
      style.opacity = '0.7';
    }

    const menuButton = this.renderMenuButton(type);
    const externalUrl = formatMessage(messages.externalUrl, { name });

    let pcMenuItem;

    if (type !== 'tile') {
      const box = parseInt((pokemon.id-1)/BOX_SIZE);
      pcMenuItem = <MenuItem primaryText={formatMessage(messages.inPc)} leftIcon={<ViewModuleIcon/>} containerElement={<Link to={`/pc/${box}`} />}/>;
    }

    let menu;

    if (currentUsername === profile.username) {
      menu = (
        <IconMenu
          className="PokemonItem__menu"
          iconButtonElement={menuButton}
          targetOrigin={targetOrigin}
          anchorOrigin={anchorOrigin}
          value={pokemon.tag}
        >
          <MenuItem primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={pokemon.collected}/>} onTouchTap={this.handleCollected}/>
          <MenuItem primaryText={formatMessage(messages.externalService)} leftIcon={<LaunchIcon/>} href={externalUrl} target="_blank"/>
          {pcMenuItem}
          <Divider/>
          <MenuItem primaryText={formatMessage(messages.none)}
            leftIcon={<BookmarkIcon color={Colors.default}/>}
            onTouchTap={this.handleTag.bind(this, 'none')}
            value="none"
          />
          {_.map(Colors.tags, (color, name) => (
            <MenuItem primaryText={tags && tags[name] && tags[name].title || formatMessage(messages[name])}
              key={name}
              leftIcon={<BookmarkIcon color={color}/>}
              onTouchTap={this.handleTag.bind(this, name)}
              value={name}
            />
          ))}
        </IconMenu>
      );
    }

    if (type === 'tile') {
      const image = 'https://raw.githubusercontent.com/carab/Prof-Sylve-Sprites/master/sprites/' + pokemon.name + '.gif';

      switch (mode) {
        case 'small':
          return (
            <GridTile
              className="PokemonItem PokemonItem--tile"
              style={style}
              onTouchTap={this.handleCollected}
            >
              {this.renderImage(name, image)}
              {this.renderId(color, pokemon.id)}
            </GridTile>
          );

        case 'medium':
          return (
            <GridTile
              className="PokemonItem PokemonItem--tile"
              style={style}
              title={name}
              titleBackground={color}
              onTouchTap={this.handleCollected}
            >
              {this.renderImage(name, image)}
              {this.renderId(color, pokemon.id)}
            </GridTile>
          );

        case 'large':
          return (
            <GridTile
              className="PokemonItem PokemonItem--tile"
              style={style}
              title={name}
              titleBackground={color}
              onTouchTap={this.handleCollected}
              actionIcon={menu}
            >
              {this.renderImage(name, image)}
              {this.renderId(color, pokemon.id)}
            </GridTile>
          );
      }
    }

    if (type === 'row') {
      return (
        <ListItem
          className="PokemonItem PokemonItem--row"
          primaryText={pokemon.id + ' - ' + name}
          rightIconButton={menu}
          leftIcon={<BookmarkIcon color={color} onTouchTap={this.handleCollected}/>}
          style={style}
        />
      );
    }

    return <div></div>;
  }

  renderImage(name, image) {
    return <img alt={name} src={image}/>;
  }

  renderId(color, id) {
    return <div className="PokemonItem__id" style={{ backgroundColor: color }}>{id}</div>;
  }

  renderMenuButton(type) {
    if (type === 'tile') {
      return <IconButton onTouchTap={this.handleStopPropagation}><MoreVertIcon color="#fff" /></IconButton>;
    }

    return <IconButton><MoreVertIcon/></IconButton>;
  }

  handleCollected() {
    this.props.onCollected(!this.props.pokemon.collected);
  }

  handleTag(tag) {
    this.props.onTag(tag);
  }

  handleStopPropagation(e) {
    e.stopPropagation();
  }
}

PokemonComponent.displayName = 'PokemonItemComponent';

PokemonComponent.propTypes = {
  pokemon: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.string,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    profile: state.profile,
    currentUsername: state.ui.currentUsername,
    pokemon: currentPokedex.pokemons[ownProps.id-1],
    tags: currentPokedex.settings.tags,
    locale: state.profile.locale,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollected: (collected) => {
      dispatch(actions.pokedex.setCollected(ownProps.id-1, collected));
    },
    onTag: (color) => {
      dispatch(actions.pokedex.setTag(ownProps.id-1, color));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonComponent));
