'use strict';

import React from 'react';

import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';

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
      <form onSubmit={this.handleSubmit}>
        <Card>
          <CardTitle title="Sign in" subtitle="If you already have an account"/>
          <CardText>
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
          </CardText>
          <CardActions style={{textAlign: 'center'}}>
            <RaisedButton type="submit" label="Sign in" primary={true} />
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
