'use strict';

import React from 'react';
import { Link } from 'react-router';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

import FirebaseUtils from '../../utils/firebase-utils';

require('styles/user/Signin.css');

class SigninComponent extends React.Component {
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
      <div className="signin-component">
        <form onSubmit={this.handleSubmit}>
          <TextField
            ref="email"
            floatingLabelText="Email Address"
            errorText={this.state.errors.email}
            fullWidth={true}
          />
          <TextField
            ref="password"
            floatingLabelText="Password"
            fullWidth={true}
            errorText={this.state.errors.password}
            type="password"
          />
          <RaisedButton type="submit" label="Sign in" primary={true} />
          or
          <FlatButton label="Sign up"
            containerElement={<Link to="/signup" />}
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

    FirebaseUtils.signin({
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

    this.setState(this.state);
  }
}

SigninComponent.displayName = 'UserSigninComponent';
SigninComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; }
};

export default SigninComponent;
