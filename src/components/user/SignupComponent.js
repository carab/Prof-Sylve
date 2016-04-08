'use strict';

import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

require('styles/user/Signup.css');

const messages = defineMessages({
  signup: {
    id: 'user.signup',
    defaultMessage: 'Sign up'
  },
  subtitle: {
    id: 'user.signupSubtitle',
    defaultMessage: 'If you want to catch\'em all !'
  },
  email: {
    id: 'user.email',
    defaultMessage: 'Email'
  },
  password: {
    id: 'user.password',
    defaultMessage: 'Password'
  },
  passwordConfirmation: {
    id: 'user.passwordConfirmation',
    defaultMessage: 'Password Confirmation'
  },
  passwordConfirmationIncorrect: {
    id: 'user.passwordConfirmationIncorrect',
    defaultMessage: 'Password confirmation is not correct.'
  }
});

class SignupComponent extends React.Component {
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
          <CardTitle title={formatMessage(messages.signup)} subtitle={formatMessage(messages.subtitle)}/>
          <CardText>
            <TextField
              ref="email"
              floatingLabelText={formatMessage(messages.email)}
              fullWidth={true}
              errorText={this.state.errors.email}
            />
            <TextField
              ref="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
              errorText={this.state.errors.password}
              type="password"
            />
            <TextField
              ref="passwordConfirmation"
              floatingLabelText={formatMessage(messages.passwordConfirmation)}
              fullWidth={true}
              errorText={this.state.errors.passwordConfirmation}
              type="password"
            />
          </CardText>
          <CardActions>
            <RaisedButton type="submit" label={formatMessage(messages.signup)} secondary={true} />
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
    let passwordConfirmation = this.refs.passwordConfirmation.getValue();

    if (password !== passwordConfirmation) {
      this.state.errors.passwordConfirmation = this.props.formatMessage(messages.passwordConfirmationIncorrect);
    } else {
      FirebaseUtils.signup({
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
    }

    this.setState({ errors });
  }
}

SignupComponent.propTypes = {
    intl: intlShape.isRequired
};
SignupComponent.displayName = 'UserSignupComponent';
SignupComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; }
};

export default injectIntl(SignupComponent);
