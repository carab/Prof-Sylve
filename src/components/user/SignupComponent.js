'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import actions from '../../actions';

import 'styles/user/Signup.css';

const messages = defineMessages({
  signup: {id: 'user.signup'},
  subtitle: {id: 'user.signupSubtitle'},
  username: {id: 'user.username'},
  email: {id: 'user.email'},
  password: {id: 'user.password'},
  passwordConfirmation: {id: 'user.passwordConfirmation'},
  alreadyUsed: {id: 'errors.alreadyUsed'},
  invalidEmail: {id: 'errors.invalidEmail'},
  invalidPassword: {id: 'errors.invalidPassword'},
  invalidConfirmation: {id: 'errors.invalidConfirmation'},
});

class SignupComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newsProps) {
    const {error} = newsProps;

    if (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.setState({errors: { email: messages.alreadyUsed }})
          break;
        case 'auth/invalid-email':
          this.setState({errors: { email: messages.invalidEmail }})
          break;
        case 'auth/weak-password':
          this.setState({errors: { password: messages.invalidPassword }})
          break;
      }

      this.setState({ loading: false });
    }
  }

  render() {
    const {loading, errors} = this.state;
    const {formatMessage} = this.props.intl;

    let action = <RaisedButton type="submit" label={formatMessage(messages.signup)} secondary={true} />;

    if (loading) {
      action = <CircularProgress size={0.5}/>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <Card>
          <CardTitle title={formatMessage(messages.signup)} subtitle={formatMessage(messages.subtitle)}/>
          <CardText>
            <TextField
              ref="username"
              type="username"
              floatingLabelText={formatMessage(messages.username)}
              fullWidth={true}
              errorText={errors.email && formatMessage(errors.username)}
            />
            <TextField
              ref="email"
              type="email"
              floatingLabelText={formatMessage(messages.email)}
              fullWidth={true}
              errorText={errors.email && formatMessage(errors.email)}
            />
            <TextField
              ref="password"
              type="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
              errorText={errors.password && formatMessage(errors.password)}
            />
            <TextField
              ref="passwordConfirmation"
              type="password"
              floatingLabelText={formatMessage(messages.passwordConfirmation)}
              fullWidth={true}
              errorText={errors.passwordConfirmation && formatMessage(errors.passwordConfirmation)}
            />
          </CardText>
          <CardActions className="text-xs-center">
            {action}
          </CardActions>
        </Card>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      loading: true,
      errors: {},
    });

    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();
    const passwordConfirmation = this.refs.passwordConfirmation.getValue();

    if (password !== passwordConfirmation) {
      this.setState({
        errors: { passwordConfirmation: messages.invalidConfirmation },
        loading: false,
      });
    } else {
      this.props.signup(email, password, this.props.locale);
    }
  }
}

SignupComponent.displayName = 'UserSignupComponent';
SignupComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; },
};

SignupComponent.propTypes = {
  locale: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.errors.signup,
    locale: state.profile.locale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (email, password, locale) => {
      dispatch(actions.auth.signup(email, password, locale));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SignupComponent));
