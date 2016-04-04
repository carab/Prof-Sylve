'use strict';

import React from 'react';
import { Link } from 'react-router';

import FirebaseUtils from '../../utils/firebase-utils';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

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
      <div className="signup-component">
        <form onSubmit={this.handleSubmit}>
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
          <RaisedButton type="submit" label="Sign up" primary={true} />
          or
          <FlatButton label="Sign in"
            containerElement={<Link to="/signin" />}
            linkButton={true}
            secondary={true}/>
        </form>
      </div>
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
