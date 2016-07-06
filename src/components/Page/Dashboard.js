'use strict';

import React, {Component, PropTypes} from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';
import ShareIcon from 'material-ui/svg-icons/social/share';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import PublicIcon from 'material-ui/svg-icons/social/public';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';

import Colors from '../../utils/colors';
import Regions from '../../utils/regions';

import 'styles/Page/Dashboard.css';

const messages = defineMessages({
  progress: {id: 'dashboard.progress'},
  shareMessage: {id: 'dashboard.share.message'},
  byRegion: {id: 'dashboard.byRegion'},
  openPc: {id: 'dashboard.openPc'},
  openList: {id: 'dashboard.openList'},
  byTag: {id: 'dashboard.byTag'},

  kanto: {id: 'pokemon.region.kanto'},
  johto: {id: 'pokemon.region.johto'},
  hoenn: {id: 'pokemon.region.hoenn'},
  sinnoh: {id: 'pokemon.region.sinnoh'},
  ulys: {id: 'pokemon.region.ulys'},
  kalos: {id: 'pokemon.region.kalos'},

  none: {id: 'pokemon.tag.none'},
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

class Dashboard extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const {auth, pokedex, currentUsername, profile} = this.props;

    const shared = (currentUsername !== profile.username);
    const path = `/pokedex/${currentUsername}`;

    // Build absolute URL
    const a = document.createElement('a');
    a.href = path;
    const url = a.href;

    let addFriendButton;
    if (shared && auth.signedIn) {
      addFriendButton = <IconButton><PersonAddIcon/></IconButton>;
    }

    let shareMenu;

    if (pokedex.settings.public) {
      const { progress } = this.calculateProgress(pokedex.pokemons);
      const message = encodeURIComponent(formatMessage(messages.shareMessage, { progress }));
      const encodedUrl = encodeURIComponent(url);
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${message}`;
      const twitterUrl = `https://twitter.com/intent/tweet?source=${encodedUrl}&text=${message}%20${encodedUrl}`;

      shareMenu = (
        <IconMenu iconButtonElement={<IconButton><ShareIcon/></IconButton>}>
          <MenuItem primaryText="Facebook" href={facebookUrl} target="_blank"/>
          <MenuItem primaryText="Twitter" href={twitterUrl} target="_blank"/>
        </IconMenu>
      );
    }

    return (
      <div className="Progress container">
        <Paper zDepth={1} className="Progress__card">
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={formatMessage(messages.progress)}/>
            </ToolbarGroup>
            <ToolbarGroup float="right">
              {addFriendButton}
              {shareMenu}
            </ToolbarGroup>
          </Toolbar>
          <div className="Progress_content">
            {this.renderProgress(pokedex.pokemons, true)}
          </div>
          <div className="Progress__actions">
            <FlatButton secondary={true} label={formatMessage(messages.openPc)} containerElement={<Link to={`${path}/pc`}/>}/>
            <FlatButton secondary={true} label={formatMessage(messages.openList)} containerElement={<Link to={`${path}/list`}/>}/>
          </div>
        </Paper>
        <div className="row">
          <div className="col-sm-6">
            <Paper zDepth={1} className="Progress__card">
              <List>
                <Subheader>{formatMessage(messages.byRegion)}</Subheader>
                {_.map(Regions, (region) => (
                  <ListItem key={region.name}
                    leftIcon={<PublicIcon color={region.color}/>}
                    containerElement={<Link to={`${path}/list/collected=❌/region=${region.name}`}/>}
                    primaryText={formatMessage(messages[region.name])}
                    secondaryText={this.renderProgress(_.slice(pokedex.pokemons, region.from-1, region.to), false, region.color)}
                    secondaryTextLines={2}
                  />
                ))}
              </List>
            </Paper>
          </div>
          <div className="col-sm-6">
            <Paper zDepth={1} className="Progress__card">
              <List>
                <Subheader>{formatMessage(messages.byTag)}</Subheader>
                {_.map(_.groupBy(pokedex.pokemons, 'tag'), (pokemons, tag) => (tag === 'none') ? null : (
                  <ListItem key={tag}
                    leftIcon={<BookmarkIcon color={Colors.tags[tag]}/>}
                    containerElement={<Link to={`${path}/list/collected=❌/tag=${tag}`}/>}
                    primaryText={pokedex.settings.tags && pokedex.settings.tags[tag] && pokedex.settings.tags[tag].title || formatMessage(messages[tag])}
                    secondaryText={this.renderProgress(pokemons, false, Colors.tags[tag])}
                    secondaryTextLines={2}
                  />
                ))}
              </List>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  calculateProgress(pokemons) {
    const collected = _.reduce(pokemons, (collected, pokemon) => {
      return collected + (pokemon.collected ? 1 : 0);
    }, 0);

    const progress = Math.ceil(10 * collected / pokemons.length * 100)/10;

    return { collected, progress };
  }

  renderProgress(pokemons, main, color) {
    const { collected, progress } = this.calculateProgress(pokemons);

    return (
      <div className={'ProgressBar '+ (main ? 'ProgressBar--main' : '')}>
        <div className="ProgressBar__legend">
          <div className="ProgressBar__percent">{progress}%</div>
          <div className="ProgressBar__real">{collected}/{pokemons.length}</div>
        </div>
        <LinearProgress className="ProgressBar__bar" mode="determinate" value={progress} color={color} style={{height: main ? '2rem' : '0.5rem'}}/>
      </div>
    );
  }
}

Dashboard.displayName = 'Dashboard';
Dashboard.propTypes = {};

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    auth: state.auth,
    profile: state.profile,
    pokedex: currentPokedex,
    currentUsername: state.ui.currentUsername,
  };
};

export default injectIntl(connect(mapStateToProps)(Dashboard));
