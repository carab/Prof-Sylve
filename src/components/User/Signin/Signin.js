'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import actions from 'actions';

import './Signin.css';

const messages = defineMessages({
  signin: {id: 'user.signin'},
  subtitle: {id: 'user.signinSubtitle'},
  email: {id: 'user.email'},
  password: {id: 'user.password'},
  invalidEmail: {id: 'errors.invalidEmail'},
  wrongPassword: {id: 'errors.wrongPassword'},
  userDisabled: {id: 'errors.userDisabled'},
  userNotFound: {id: 'errors.userNotFound'},
});

class UserSignin extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.componentWillUpdate(this.props);
  }

  componentWillUpdate(nextProps) {
    const {signedIn} = nextProps;

    if (signedIn) {
      this.props.history.replace('/');
    }
  }

  componentWillReceiveProps(newsProps) {
    const {error} = newsProps;

    if (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          this.setState({errors: { email: messages.invalidEmail }})
          break;
        case 'auth/user-disabled':
          this.setState({errors: { email: messages.userDisabled }})
          break;
        case 'auth/user-not-found':
          this.setState({errors: { email: messages.userNotFound }})
          break;
        case 'auth/wrong-password':
          this.setState({errors: { password: messages.wrongPassword }})
          break;
      }

      this.setState({ loading: false });
    }
  }

  render() {
    const {loading, errors} = this.state;
    const {formatMessage} = this.props.intl;
    const {signedIn, username} = this.props;

    let action = <RaisedButton type="submit" label={formatMessage(messages.signin)} primary={true} />;

    if (loading) {
      action = <CircularProgress size={20}/>;
    }

    if (signedIn && username) {
      return (
        <Redirect to={`/pokedex/${username}`}/>
      );
    }

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
              errorText={errors.email && formatMessage(errors.email)}
            />
            <TextField
              ref="password"
              type="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
              errorText={errors.password && formatMessage(errors.password)}
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

    this.props.signin(email, password);
  }
}

UserSignin.displayName = 'UserSignin';

UserSignin.propTypes = {
  intl: intlShape.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.errors.signin,
    signedIn: state.auth.signedIn,
    username: state.profile.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signin: (email, password) => {
      dispatch(actions.auth.signin(email, password));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(UserSignin)));
