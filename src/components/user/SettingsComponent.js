'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Toggle from 'material-ui/Toggle';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new';

import Colors from '../../utils/colors';
import actions from '../../actions';

import 'styles/user/Settings.css';

const messages = defineMessages({
  settings: {id: 'user.settings'},
  visibility: {id: 'settings.visibility'},
  isPublic: {id: 'settings.public'},
  username: {id: 'settings.username'},
  missingUsername: {id: 'settings.missingUsername'},
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
  constructor(props) {
    super(props);

    this.handlePublicChange = this.handlePublicChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {settings} = this.props;
    const tags = settings.tags || {};
    const errors = {};

    if (settings.public && !settings.username) {
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
                <ToolbarGroup float="right">
                  {this.renderShareMenu()}
                </ToolbarGroup>
              </Toolbar>
              <div className="Settings__fields">
                <Toggle ref="public" label={formatMessage(messages.isPublic)} defaultToggled={settings.public} onToggle={this.handlePublicChange}/>
                <TextField ref="username" floatingLabelText={formatMessage(messages.username)} fullWidth={true} defaultValue={settings.username} errorText={errors.username} onChange={this.handleUsernameChange}/>
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
      // Build absolute URL
      const path = '/user/' + settings.username;
      const a = document.createElement('a');
      a.href = path;
      const url = a.href;

      return <IconButton containerElement={<a href={url} target="_blank"/>}><OpenIcon/></IconButton>;
    }
  }

  handlePublicChange(event, isPublic) {
    const {setPublic} = this.props;
    setPublic(isPublic);
  }

  handleUsernameChange(event, username) {
    const {setUsername} = this.props;
    setUsername(username);
  }

  handleTagChange(tag, title) {
    const {setTagTitle} = this.props;
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
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Settings));
