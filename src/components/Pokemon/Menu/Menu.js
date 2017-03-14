'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import {BOX_SIZE} from 'components/Pokedex/Pc/Pc';

import Colors from 'utils/colors';
import actions from 'actions';

const messages = defineMessages({
  cancelSelection: {id: 'pokedex.cancelSelection'},
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

class Menu extends Component {
  render() {
    const {icon, pokemon} = this.props;
    const {tags} = this.props;
    const {formatMessage} = this.props.intl;

    let value = null;

    if (pokemon) {
      value = pokemon.tag;
    }

    return (
      <div className="PokemonMenu">
        <IconMenu
          iconButtonElement={<IconButton>{icon ? icon : <MoreVertIcon/>}</IconButton>}
          onTouchTap={this.handleTouch}
          targetOrigin={targetOrigin}
          anchorOrigin={anchorOrigin}
          value={value}
        >
          {this.renderItems()}
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
      </div>
    );
  }

  renderItems() {
    const {pokemon, showPcLink, collected} = this.props;
    const {formatMessage} = this.props.intl;
    const items = [];

    const collectedItem = <MenuItem key="collected" primaryText={formatMessage(messages.collected)} leftIcon={<Checkbox checked={collected}/>} onTouchTap={this.handleCollected}/>;

    if (pokemon) {
      const name = formatMessage({ id: 'pokemon.name.' + pokemon.id });
      const externalUrl = formatMessage(messages.externalUrl, { name });

      items.push(collectedItem);
      items.push(<MenuItem key="externalService" primaryText={formatMessage(messages.externalService)} leftIcon={<LaunchIcon/>} rel="noopener" href={externalUrl} target="_blank"/>);

      if (showPcLink) {
        const box = parseInt((pokemon.id-1) / BOX_SIZE);
        const {currentUsername} = this.props;

        items.push(<MenuItem key="inPc" primaryText={formatMessage(messages.inPc)} leftIcon={<ViewModuleIcon/>} containerElement={<Link to={`/pokedex/${currentUsername}/pc/${box}`} />}/>);
      }
    } else {
      items.push(<MenuItem key="cancel" primaryText={formatMessage(messages.cancelSelection)} leftIcon={<CancelIcon/>} onTouchTap={this.handleCancelSelection}/>);
      items.push(<Divider key="divider1"/>);
      items.push(collectedItem);
    }

    return items;
  }

  handleCancelSelection = () => {
    this.props.resetSelected();
  }

  handleCollected = () => {
    const {pokemon} = this.props;
    const {collected, selected} = this.props;

    if (pokemon) {
      this.props.onCollected(pokemon.id, !collected);
    } else if (selected.size) {
      selected.forEach((value, id) => {
        this.props.onCollected(id, !collected);
      })
    }
  }

  handleTouch = (event) => {
    event.stopPropagation();
  }

  handleTag(tag) {
    const {pokemon} = this.props;
    const {selected} = this.props;

    if (pokemon) {
      this.props.onTag(pokemon.id, tag);
    } else if (selected.size) {
      selected.forEach((value, id) => {
        this.props.onTag(id, tag);
      })
    }
  }
}

Menu.displayName = 'PokemonMenu';
Menu.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  const {selected} = state.ui;
  const {pokemon} = ownProps;
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  let collected = false;

  if (pokemon) {
    collected = pokemon.collected;
  } else if (selected.size) {
    const collectedFromSelected = selected.reduce((collectedFromSelected, value, id) => {
      return (currentPokedex.pokemons[id-1].collected) ? ++collectedFromSelected : collectedFromSelected;
    }, 0);

    collected = (collectedFromSelected === selected.size);
  }

  return {
    currentUsername: state.ui.currentUsername,
    tags: currentPokedex.settings.tags,
    selected: (pokemon) ? null : selected,
    collected: collected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCollected: (id, collected) => {
      dispatch(actions.pokedex.setCollected(id, collected));
    },
    onTag: (id, color) => {
      dispatch(actions.pokedex.setTag(id, color));
    },
    resetSelected: () => {
      dispatch(actions.ui.resetSelected());
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu));
