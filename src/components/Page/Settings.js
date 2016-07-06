'use strict';

import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';

import Colors from '../../utils/colors';
import actions from '../../actions';

import 'styles/user/Settings.css';

const messages = defineMessages({
  settings: {id: 'user.settings'},
  visibility: {id: 'settings.visibility'},
  isPublic: {id: 'settings.public'},
  missingUsername: {id: 'settings.missingUsername'},
  username: {id: 'user.username'},
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
  render() {
    const {formatMessage} = this.props.intl;
    const {settings, profile} = this.props;
    const tags = settings.tags || {};
    const errors = {};

    if (settings.public && !profile.username) {
      errors.username = formatMessage(messages.missingUsername);
    }

    return (
      <div className="Settings container">
        <div className="row">
          <div className="col-md-6">
            <Paper zDepth={1}>
              <Toolbar>
                <ToolbarGroup float="left">
                  <ToolbarTitle text={formatMessage(messages.visibility)}/>
                </ToolbarGroup>
              </Toolbar>
              <div className="Settings__fields">
                <Toggle ref="public" label={formatMessage(messages.isPublic)} defaultToggled={settings.public} onToggle={this.handlePublicChange}/>
                <TextField ref="username" floatingLabelText={formatMessage(messages.username)} fullWidth={true} defaultValue={profile.username} errorText={errors.username} onChange={this.handleUsernameChange}/>
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

  handlePublicChange = (event, isPublic) => {
    const {setPublic} = this.props;
    setPublic(isPublic);
  }

  handleUsernameChange = _.debounce((event, username) => {
    const {profile, setUsername} = this.props;
    setUsername(username, profile.username);
  }, 300)

  handleTagChange = _.debounce((tag, title) => {
    const {setTagTitle} = this.props;
    setTagTitle(tag, title);
  }, 300)
}

Settings.displayName = 'UserSettings';

Settings.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  const pokedex = state.ui.pokedexes.get(state.profile.username);

  return {
    settings: pokedex.settings,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPublic: (isPublic) => {
      dispatch(actions.pokedex.setSettingsPublic(isPublic));
    },
    setUsername: (username, oldUsername) => {
      dispatch(actions.profile.setUsername(username, oldUsername));
    },
    setTagTitle: (tag, title) => {
      dispatch(actions.pokedex.setSettingsTagTitle(tag, title));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Settings));
