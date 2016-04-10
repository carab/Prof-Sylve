'use strict';

import React, {Component, PropTypes} from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

require('styles/user/Signin.css');

const messages = defineMessages({
  signin: {
    id: 'user.signin',
    defaultMessage: 'Sign in'
  },
  subtitle: {
    id: 'user.signinSubtitle',
    defaultMessage: 'If you already have an account.'
  },
  email: {
    id: 'user.email',
    defaultMessage: 'Email'
  },
  password: {
    id: 'user.password',
    defaultMessage: 'Password'
  }
});

class SigninComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const {formatMessage} = this.props.intl;

    return (
      <form onSubmit={this.handleSubmit}>
        <Card>
          <CardTitle title={formatMessage(messages.signin)} subtitle={formatMessage(messages.subtitle)}/>
          <CardText>
            <TextField
              ref="email"
              floatingLabelText={formatMessage(messages.email)}
              errorText={this.state.errors.email}
              fullWidth={true}
            />
            <TextField
              ref="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
              errorText={this.state.errors.password}
              type="password"
            />
          </CardText>
          <CardActions>
            <RaisedButton type="submit" label={formatMessage(messages.signin)} primary={true} />
          </CardActions>
        </Card>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    let errors = {};

    let email = this.refs.email.getValue();
    let password = this.refs.password.getValue();

    FirebaseUtils.signin({
      email,
      password
    }, (error) => {
      if (error) {
        errors.email = error;
        this.setState({ errors });
      } else {
        this.context.router.replace('/');
      }
    });

    this.setState({ errors });
  }
}

SigninComponent.displayName = 'UserSigninComponent';

SigninComponent.propTypes = {
    intl: intlShape.isRequired
};

SigninComponent.contextTypes = {
    router: () => { return PropTypes.func.isRequired; }
};

export default injectIntl(SigninComponent);
