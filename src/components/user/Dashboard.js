'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';
import ShareIcon from 'material-ui/svg-icons/social/share';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import Colors from '../../utils/colors';

import 'styles/user/Dashboard.css';

const messages = defineMessages({
  progress: {id: 'dashboard.progress'},
  byRegion: {id: 'dashboard.byRegion'},
  openPc: {id: 'dashboard.openPc'},
  openPokedex: {id: 'dashboard.openPokedex'},
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

const regions = [
  { name: 'kanto', index: '1', from: 1, to: 151 },
  { name: 'johto', index: '2', from: 152, to: 251 },
  { name: 'hoenn', index: '3', from: 252, to: 386 },
  { name: 'sinnoh', index: '4', from: 387, to: 494 },
  { name: 'ulys', index: '5', from: 495, to: 649 },
  { name: 'kalos', index: '6', from: 650, to: 721 },
];

class Dashboard extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const {pokemons, tags} = this.props;

    return (
      <div className="Dashboard container">
        <Paper zDepth={1} className="Dashboard__card">
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={formatMessage(messages.progress)}/>
            </ToolbarGroup>
            <ToolbarGroup float="right">
              {this.renderShareMenu()}
            </ToolbarGroup>
          </Toolbar>
          <div className="Dashboard_content">
            {this.renderProgress(pokemons, true)}
          </div>
          <div className="Dashboard__actions">
            <FlatButton secondary={true} label={formatMessage(messages.openPc)} containerElement={<Link to="/pc"/>}/>
            <FlatButton secondary={true} label={formatMessage(messages.openPokedex)} containerElement={<Link to="/pokedex"/>}/>
          </div>
        </Paper>
        <div className="row">
          <div className="col-sm-6">
            <Paper zDepth={1} className="Dashboard__card">
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarTitle text={formatMessage(messages.byRegion)}/>
                </ToolbarGroup>
              </Toolbar>
              <div className="Dashboard_content">
                {_.map(regions, (region) => (
                  <div className="Dashboard__item" key={region.index}>
                    <div className="Dashboard__subtitle">{formatMessage(messages[region.name])}</div>
                    {this.renderProgress(_.slice(pokemons, region.from-1, region.to))}
                  </div>
                ))}
              </div>
            </Paper>
          </div>
          <div className="col-sm-6">
            <Paper zDepth={1} className="Dashboard__card">
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarTitle text={formatMessage(messages.byTag)}/>
                </ToolbarGroup>
              </Toolbar>
              <div className="Dashboard_content">
                {_.map(_.groupBy(pokemons, 'tag'), (pokemons, tag) => (
                  <div className="Dashboard__item" key={tag}>
                    <div className="Dashboard__subtitle">{tags && tags[tag] && tags[tag].title || formatMessage(messages[tag])}</div>
                    {this.renderProgress(pokemons, false, Colors.tags[tag])}
                  </div>
                ))}
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  renderShareMenu() {
    const {profile} = this.props;

    const dashboardUrl = 'https://profsylve.com/user/' + profile.username;

    if (profile.public && profile.username) {
      return (
        <IconMenu iconButtonElement={<IconButton><ShareIcon/></IconButton>}>
          <MenuItem primaryText="URL" leftIcon={<OpenIcon/>} href={dashboardUrl} target="_blank"/>
          <MenuItem primaryText="Facebook" href="http://google.fr" onTouchTap={this.handleCollected} target="_blank"/>
          <MenuItem primaryText="Twitter" href="http://google.fr" target="_blank"/>
        </IconMenu>
      );
    }
  }

  renderProgress(pokemons, main, color) {
    const collected = _.reduce(pokemons, (collected, pokemon) => {
      return collected + (pokemon.collected ? 1 : 0);
    }, 0);

    const progress = Math.ceil(10 * collected / pokemons.length * 100)/10;

    return (
      <div className={'Progress '+ (main ? 'Progress--main' : '')}>
        <div className="Progress__legend">
          <div className="Progress__percent">{progress}%</div>
          <div className="Progress__real">{collected}/{pokemons.length}</div>
        </div>
        <LinearProgress className="Progress__bar" mode="determinate" value={progress} color={color} style={{height: main ? '2rem' : '0.5rem'}}/>
      </div>
    );
  }
}

Dashboard.displayName = 'UserDashboard';
Dashboard.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

Dashboard.propTypes = {
  tags: PropTypes.object,
  pokemons: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    tags: state.pokedex.settings.tags,
    pokemons: state.pokedex.pokemons,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
