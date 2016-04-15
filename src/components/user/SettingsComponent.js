'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';
import Colors from '../../utils/colors';

import 'styles/user/Settings.css';

const messages = defineMessages({
  settings: {id: 'user.settings'},
  save: {id: 'label.save'},
  red: {id: 'pokemon.tag.color.red'},
  orange: {id: 'pokemon.tag.color.orange'},
  green: {id: 'pokemon.tag.color.green'},
  indigo: {id: 'pokemon.tag.color.indigo'},
  purple: {id: 'pokemon.tag.color.purple'},
});

class SettingsComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      settings: {
        colors: {},
      },
    };

    this.settingsRef = FirebaseUtils.getUserRef().child('settings');
  }

  componentDidMount() {
    this.settingsRef.once('value', (snap) => {
      let settings = snap.val();

      if (_.isObject(settings)) {
        if (!_.isObject(settings.colors)) {
          settings.colors = {};
        }

        this.setState({ settings });
      }
    });
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {settings} = this.state;
    const {colors} = settings;

    return (
      <div className="settings-component">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <Card>
            <CardTitle title={formatMessage(messages.settings)}/>
            <CardText>
              {_.map(Colors.tags, (color) => (
                <TextField
                  key={color.name}
                  ref={'color-' + color.name}
                  floatingLabelText={formatMessage(messages[color.name])}
                  fullWidth={true}
                  value={colors[color.name] || ''}
                  onChange={(event) => this.handleColorChange(color.name, event.target.value)}
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

  handleColorChange(color, value) {
    let {settings} = this.state;
    settings.colors[color] = value;

    this.setState({ settings });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {settings} = this.state;
    this.settingsRef.set(settings, (error) => {
      if (error) {
        // TODO
      } else {
        this.context.router.replace('/');
      }
    });
  }
}

SettingsComponent.displayName = 'UserSettingsComponent';

SettingsComponent.propTypes = {
    intl: intlShape.isRequired,
};

SettingsComponent.contextTypes = {
    router: () => { return PropTypes.func.isRequired; },
};

export default injectIntl(SettingsComponent);
