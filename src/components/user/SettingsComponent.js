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

import Colors from '../../utils/colors';
import actions from '../../actions';

import 'styles/user/Settings.css';

const messages = defineMessages({
  settings: {id: 'user.settings'},
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

    this.state = {};
  }

  render() {
    const {formatMessage} = this.props.intl;
    const profile = this.state.profile || this.props.profile;
    const tags = profile.tags || tags;

    return (
      <div className="Settings container">
        <Paper zDepth={1}>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <Toolbar>
              <ToolbarGroup float="left">
                <ToolbarTitle text={formatMessage(messages.settings)}/>
              </ToolbarGroup>
              <ToolbarGroup float="right">
                <IconButton type="submit" aria-label={formatMessage(messages.save)}><DoneIcon/></IconButton>
              </ToolbarGroup>
            </Toolbar>
            <Subheader>Tags</Subheader>
            <div className="Settings__fields">
              <div className="row">
                {_.map(Colors.tags, (color, name) => (
                  <div key={name} className="col-sm-4 col-md-3 col-lg-2">
                    <TextField
                      ref={'color-' + name}
                      floatingLabelText={formatMessage(messages[name])}
                      fullWidth={true}
                      value={tags[name] && tags[name].title || ''}
                      onChange={(event) => this.handleTagTitle(name, event.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Paper>
      </div>
    );
  }

  handleTagTitle(tag, title) {
    const profile = this.state.profile || this.props.profile;

    if (!profile.tags[tag]) {
      profile.tags[tag] = { title }
    } else {
      profile.tags[tag].title = title;
    }

    this.setState({ profile });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {profile, onSubmit} = this.props;
    onSubmit(profile);
    this.context.router.replace('/');
  }
}

Settings.displayName = 'UserSettings';
Settings.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

Settings.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (profile) => {
      dispatch(actions.profile.setProfile(profile));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Settings));
