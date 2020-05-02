'use strict';

import React, {Component} from 'react';
import {injectIntl, defineMessages} from 'react-intl';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import ShareIcon from 'material-ui/svg-icons/social/share';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import PublicIcon from 'material-ui/svg-icons/social/public';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';

import Colors from 'utils/colors';
import Regions from 'utils/regions';

import './Dashboard.css';

const messages = defineMessages({
  pokedexOf: {id: 'pokedex.of'},
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
  alola: {id: 'pokemon.region.alola'},
  galar: {id: 'pokemon.region.galar'},

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

const styles = {
  icon: {
    height: '2em',
    verticalAlign: 'middle',
  },
}

class Dashboard extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const {auth, pokedex, currentUsername, currentBox, profile} = this.props;

    const shared = (currentUsername !== profile.username);
    const path = `/pokedex/${currentUsername}`;

    // Build absolute URL
    const a = document.createElement('a');
    a.href = path;
    const url = a.href;

    let addFriendButton;
    if (shared && auth.signedIn) {
      //addFriendButton = <IconButton><PersonAddIcon/></IconButton>;
    }

    let shareMenu;

    if (pokedex.settings.public) {
      const { progress } = this.calculateProgress(pokedex.pokemons);
      const message = formatMessage(messages.shareMessage, { progress });
      const encodedUrl = encodeURIComponent(url);
      const twitterUrl = `https://twitter.com/intent/tweet?source=${encodedUrl}&text=${encodeURIComponent(message)}%20${encodedUrl}`;

      const handleFacebookShare = () => {
        FB.ui({
					method: 'feed',
					link: url,
					name: message,
          //picture: attr.picture,
          //caption: attr.caption,
          description: formatMessage(messages.pokedexOf, { username: currentUsername }),
				});
      };

      shareMenu = (
        <IconMenu iconButtonElement={<IconButton><ShareIcon/></IconButton>}>
          <MenuItem style={{ textAlign: 'center' }} primaryText={this.renderFacebookIcon()} onClick={handleFacebookShare}/>
          <MenuItem style={{ textAlign: 'center' }} primaryText={this.renderTwitterIcon()} href={twitterUrl} rel="noopener" target="_blank"/>
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
            <FlatButton secondary={true} label={formatMessage(messages.openPc)} containerElement={<Link to={`${path}/pc/${currentBox}`}/>}/>
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
                    containerElement={<Link to={`${path}/list/region=${region.name}`}/>}
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
                    containerElement={<Link to={`${path}/list/tag=${tag}`}/>}
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

  renderTwitterIcon() {
    return (
      <svg viewBox="0 0 410.155 410.155" style={styles.icon}>
        <path d="M403.632,74.18c-9.113,4.041-18.573,7.229-28.28,9.537c10.696-10.164,18.738-22.877,23.275-37.067  l0,0c1.295-4.051-3.105-7.554-6.763-5.385l0,0c-13.504,8.01-28.05,14.019-43.235,17.862c-0.881,0.223-1.79,0.336-2.702,0.336  c-2.766,0-5.455-1.027-7.57-2.891c-16.156-14.239-36.935-22.081-58.508-22.081c-9.335,0-18.76,1.455-28.014,4.325  c-28.672,8.893-50.795,32.544-57.736,61.724c-2.604,10.945-3.309,21.9-2.097,32.56c0.139,1.225-0.44,2.08-0.797,2.481  c-0.627,0.703-1.516,1.106-2.439,1.106c-0.103,0-0.209-0.005-0.314-0.015c-62.762-5.831-119.358-36.068-159.363-85.14l0,0  c-2.04-2.503-5.952-2.196-7.578,0.593l0,0C13.677,65.565,9.537,80.937,9.537,96.579c0,23.972,9.631,46.563,26.36,63.032  c-7.035-1.668-13.844-4.295-20.169-7.808l0,0c-3.06-1.7-6.825,0.485-6.868,3.985l0,0c-0.438,35.612,20.412,67.3,51.646,81.569  c-0.629,0.015-1.258,0.022-1.888,0.022c-4.951,0-9.964-0.478-14.898-1.421l0,0c-3.446-0.658-6.341,2.611-5.271,5.952l0,0  c10.138,31.651,37.39,54.981,70.002,60.278c-27.066,18.169-58.585,27.753-91.39,27.753l-10.227-0.006  c-3.151,0-5.816,2.054-6.619,5.106c-0.791,3.006,0.666,6.177,3.353,7.74c36.966,21.513,79.131,32.883,121.955,32.883  c37.485,0,72.549-7.439,104.219-22.109c29.033-13.449,54.689-32.674,76.255-57.141c20.09-22.792,35.8-49.103,46.692-78.201  c10.383-27.737,15.871-57.333,15.871-85.589v-1.346c-0.001-4.537,2.051-8.806,5.631-11.712c13.585-11.03,25.415-24.014,35.16-38.591  l0,0C411.924,77.126,407.866,72.302,403.632,74.18L403.632,74.18z"/>
      </svg>
    );
  }

  renderFacebookIcon() {
    return (
      <svg viewBox="0 0 408.788 408.788" style={styles.icon}>
        <path d="M353.701,0H55.087C24.665,0,0.002,24.662,0.002,55.085v298.616c0,30.423,24.662,55.085,55.085,55.085  h147.275l0.251-146.078h-37.951c-4.932,0-8.935-3.988-8.954-8.92l-0.182-47.087c-0.019-4.959,3.996-8.989,8.955-8.989h37.882  v-45.498c0-52.8,32.247-81.55,79.348-81.55h38.65c4.945,0,8.955,4.009,8.955,8.955v39.704c0,4.944-4.007,8.952-8.95,8.955  l-23.719,0.011c-25.615,0-30.575,12.172-30.575,30.035v39.389h56.285c5.363,0,9.524,4.683,8.892,10.009l-5.581,47.087  c-0.534,4.506-4.355,7.901-8.892,7.901h-50.453l-0.251,146.078h87.631c30.422,0,55.084-24.662,55.084-55.084V55.085  C408.786,24.662,384.124,0,353.701,0z"/>
      </svg>
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
    currentBox: state.ui.currentBox,
  };
};

export default injectIntl(connect(mapStateToProps)(Dashboard));
