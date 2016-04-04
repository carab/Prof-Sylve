'use strict';

import React from 'react';

import FirebaseUtils from '../../utils/firebase-utils';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

require('styles/user/Signup.css');

class SignupComponent extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);

    this.router = context.router;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Card>
          <CardTitle title="Sign up" subtitle="If you want to catch'em all"/>
          <CardText>
            <TextField
              ref="email"
              floatingLabelText="Email Address"
              fullWidth={true}
              errorText={this.state.errors.email}
            />
            <TextField
              ref="password"
              floatingLabelText="Password"
              fullWidth={true}
              errorText={this.state.errors.password}
              type="password"
            />
            <TextField
              ref="passwordConfirmation"
              floatingLabelText="Password Confirmation"
              fullWidth={true}
              errorText={this.state.errors.passwordConfirmation}
              type="password"
            />
          </CardText>
          <CardActions style={{textAlign: 'center'}}>
            <RaisedButton type="submit" label="Sign up" secondary={true} />
          </CardActions>
        </Card>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    this.state.errors = {};

    let email = this.refs.email.getValue();
    let password = this.refs.password.getValue();
    let passwordConfirmation = this.refs.passwordConfirmation.getValue();

    if (password !== passwordConfirmation) {
      this.state.errors.passwordConfirmation = 'Password confirmation is not correct.';
    } else {
      FirebaseUtils.signup({
        email,
        password
      }, (error) => {
        if (error) {
          this.state.errors.email = error;
          this.setState(this.state);
        } else {
          this.context.router.replace('/');
        }
      });
    }

    this.setState(this.state);
  }
}

SignupComponent.displayName = 'UserSignupComponent';
SignupComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; }
};

export default SignupComponent;
