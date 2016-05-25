'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import Colors from '../../utils/colors';
import Actions from '../../actions';

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

class SettingsComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  render() {
    const {formatMessage} = this.props.intl;
    const profile = this.state.profile || this.props.profile;
    const {tags} = profile;

    return (
      <div className="settings-component">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <Card>
            <CardTitle title={formatMessage(messages.settings)}/>
            <CardText>
              {_.map(Colors.tags, (color, name) => (
                <TextField
                  key={name}
                  ref={'color-' + name}
                  floatingLabelText={formatMessage(messages[name])}
                  fullWidth={true}
                  value={tags[name] && tags[name].title || ''}
                  onChange={(event) => this.handleTagTitle(name, event.target.value)}
                />
              ))}
            </CardText>
            <CardActions>
              <RaisedButton type="submit" label={formatMessage(messages.save)} primary={true} />
            </CardActions>
          </Card>
        </form>
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

SettingsComponent.displayName = 'UserSettingsComponent';

SettingsComponent.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

const mapStateToProps = (state) => {
  return {
    profile: state.user.data.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (profile) => {
      dispatch(Actions.saveUserProfile(profile));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsComponent));
