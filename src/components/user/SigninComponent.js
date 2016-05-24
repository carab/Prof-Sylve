'use strict';

import React, {Component, PropTypes} from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

import 'styles/user/Signin.css';

const messages = defineMessages({
  signin: {id: 'user.signin'},
  subtitle: {id: 'user.signinSubtitle'},
  email: {id: 'user.email'},
  password: {id: 'user.password'},
});

class SigninComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
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
              type="email"
              floatingLabelText={formatMessage(messages.email)}
              errorText={this.state.errors.email}
              fullWidth={true}
            />
            <TextField
              ref="password"
              type="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
              errorText={this.state.errors.password}
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

    FirebaseUtils.signin(email, password)
      .then((user) => {
        this.context.router.replace('/');
      })
      .catch((error) => {
        errors.email = error;
        //this.setState({ errors });
      });

    this.setState({ errors });
  }
}

SigninComponent.displayName = 'UserSigninComponent';

SigninComponent.propTypes = {
    intl: intlShape.isRequired,
};

SigninComponent.contextTypes = {
    router: () => { return PropTypes.func.isRequired; },
};

export default injectIntl(SigninComponent);
