'use strict';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

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

import { injectIntl, intlShape, defineMessages } from 'react-intl';

import Colors from '../../utils/colors';
import Actions from '../../actions';

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
  purple: {id: 'pokemon.tag.color.purple'},
});

const anchorOrigin = {horizontal: 'right', vertical: 'top'};
const targetOrigin = {horizontal: 'right', vertical: 'top'};

class PokemonComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleStopPropagation = this.handleStopPropagation.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {collected, tag} = this.props;

    return (
      collected !== nextProps.collected ||
      tag.color !== nextProps.tag.color ||
      tag.force !== nextProps.tag.force
    );
  }

  render() {
    const {pokemon, collected, tag, type, colors} = this.props;
    const {onCollected, onTagRemove, onTagColor, onTagForce} = this.props;
    const {formatMessage} = this.props.intl;

    const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });

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

    const menuButton = this.renderMenuButton(type);
    const forceDisabled = !(tagColor && collected);
    const externalUrl = formatMessage(messages.externalUrl, { name });

    const menu = (
      <IconMenu
        iconButtonElement={menuButton}
        targetOrigin={targetOrigin}
        anchorOrigin={anchorOrigin}
        value={tagColor || color}
      >
        <MenuItem primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={collected}/>} onTouchTap={onCollected.bind(this, !collected)}/>
        <MenuItem primaryText={formatMessage(messages.externalService)} leftIcon={<LaunchIcon/>} href={externalUrl} target="_blank"/>
        <Divider/>
        <MenuItem primaryText={formatMessage(messages.none)}
          leftIcon={<BookmarkIcon style={{fill: defaultColor}}/>}
          onTouchTap={onTagRemove}
          value={defaultColor}
        />
        {_.map(Colors.tags, (color) => (
          <MenuItem primaryText={colors[color.name] || formatMessage(messages[color.name])}
            key={color.name}
            leftIcon={<BookmarkIcon style={{fill: color.value}}/>}
            onTouchTap={onTagColor.bind(this, color.value)}
            value={color.value}
          />
        ))}
        <Divider/>
        <MenuItem primaryText={formatMessage(messages.force)} disabled={forceDisabled} leftIcon={<Checkbox disabled={forceDisabled} checked={force}/>} onTouchTap={onTagForce.bind(this, !force)}/>
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
          onTouchTap={onCollected.bind(this, !collected)}
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
          leftIcon={<BookmarkIcon style={{fill: color}} onTouchTap={onCollected.bind(this, !collected)}/>}
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

  handleStopPropagation(e) {
    e.stopPropagation();
  }
}

PokemonComponent.displayName = 'PokemonItemComponent';

PokemonComponent.propTypes = {
  type: PropTypes.string.isRequired,
  pokemon: PropTypes.object.isRequired,
  collected: PropTypes.bool.isRequired,
  tag: PropTypes.object.isRequired,
  onCollected: PropTypes.func.isRequired,
  onTagRemove: PropTypes.func.isRequired,
  onTagColor: PropTypes.func.isRequired,
  onTagForce: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state, props) => {
  const {pokemon} = props;

  return {
    collected: state.user.data.collected[pokemon.id] || false,
    tag: state.user.data.tags[pokemon.id] || {},
    colors: state.user.data.settings.colors,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const {pokemon} = props;

  return {
    onCollected: (collected) => {
      dispatch(Actions.pokemonCollected(pokemon, collected));
    },
    onTagRemove: () => {
      dispatch(Actions.pokemonTagRemove(pokemon));
    },
    onTagColor: (color) => {
      dispatch(Actions.pokemonTagColor(pokemon, color));
    },
    onTagForce: (force) => {
      dispatch(Actions.pokemonTagForce(pokemon, force));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonComponent));

