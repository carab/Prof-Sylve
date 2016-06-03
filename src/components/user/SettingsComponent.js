'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import DoneIcon from 'material-ui/svg-icons/action/done';
import Subheader from 'material-ui/Subheader';
import Toggle from 'material-ui/Toggle';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';

import Colors from '../../utils/colors';
import actions from '../../actions';

import 'styles/user/Settings.css';

const messages = defineMessages({
  settings: {id: 'user.settings'},
  tags: {id: 'pokemon.tag.tags'},
  save: {id: 'label.save'},
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

class Settings extends Component {
  constructor(props, context) {
    super(props, context);

    this.handlePublicChange = this.handlePublicChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {settings} = this.props;
    const tags = settings.tags || {};
    const errors = {};
    console.log(settings)
    if (settings.public && !settings.username) {
      errors.username = 'A public Pokédex needs a username';
    }

    return (
      <div className="Settings container">
        <div className="row">
          <div className="col-md-6">
            <Paper zDepth={1}>
              <Toolbar>
                <ToolbarGroup float="left">
                  <ToolbarTitle text="Pokédex visibility"/>
                </ToolbarGroup>
                <ToolbarGroup float="right">
                  {this.renderShareMenu()}
                </ToolbarGroup>
              </Toolbar>
              <div className="Settings__fields">
                <Toggle ref="public" label="Public" defaultToggled={settings.public} onToggle={this.handlePublicChange}/>
                <TextField ref="username" floatingLabelText="User name" fullWidth={true} defaultValue={settings.username} errorText={errors.username} onChange={this.handleUsernameChange}/>
              </div>
            </Paper>
          </div>
          <div className="col-md-6">
            <Paper zDepth={1}>
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarTitle text={formatMessage(messages.tags)}/>
                </ToolbarGroup>
              </Toolbar>
              <div className="Settings__fields">
                <div className="row">
                  {_.map(Colors.tags, (color, name) => (
                    <div key={name} className="col-xs-6 col-sm-4 col-md-6">
                      <TextField
                        ref={'color-' + name}
                        floatingLabelText={formatMessage(messages[name])}
                        fullWidth={true}
                        defaultValue={tags[name] && tags[name].title || ''}
                        onChange={(event) => this.handleTagChange(name, event.target.value)}
                        floatingLabelStyle={{color: color}}
                        underlineFocusStyle={{borderColor: color}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  }

  renderShareMenu() {
    const {settings} = this.props;

    if (settings.public && settings.username) {
      const dashboardUrl = 'https://profsylve.com/user/' + settings.username;
      return <IconButton containerElement={<a href={dashboardUrl} target="_blank"/>}><OpenIcon/></IconButton>;
    }
  }

  handlePublicChange(event, isPublic) {
    const {settings, setPublic} = this.props;
    setPublic(isPublic);
  }

  handleUsernameChange(event, username) {
    const {settings, setUsername, matchUsernameToUid, unmatchUsernameToUid} = this.props;

    if (settings.username) {
      unmatchUsernameToUid(settings.username);
    }

    if (username) {
      matchUsernameToUid(username);
    }

    setUsername(username);
  }

  handleTagChange(tag, title) {
    const {settings, setTagTitle} = this.props;
    setTagTitle(tag, title);
  }
}

Settings.displayName = 'UserSettings';

Settings.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    settings: state.pokedex.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPublic: (isPublic) => {
      dispatch(actions.pokedex.setSettingsPublic(isPublic));
    },
    setUsername: (username) => {
      dispatch(actions.pokedex.setSettingsUsername(username));
    },
    setTagTitle: (tag, title) => {
      dispatch(actions.pokedex.setSettingsTagTitle(tag, title));
    },
    matchUsernameToUid: (username) => {
      dispatch(actions.profile.matchUsernameToUid(username));
    },
    unmatchUsernameToUid: (username) => {
      dispatch(actions.profile.unmatchUsernameToUid(username));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Settings));
