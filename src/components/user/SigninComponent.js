'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import actions from '../../actions';

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
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.componentWillUpdate(this.props);
  }

  componentWillUpdate(nextProps) {
    const {isSignedIn} = nextProps;

    if (isSignedIn) {
      this.context.router.replace('/');
    }
  }

  render() {
    const {loading} = this.state;
    const {formatMessage} = this.props.intl;

    let action = <RaisedButton type="submit" label={formatMessage(messages.signin)} primary={true} />;

    if (loading) {
      action = <CircularProgress size={0.5}/>;
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
            />
            <TextField
              ref="password"
              type="password"
              floatingLabelText={formatMessage(messages.password)}
              fullWidth={true}
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

    this.setState({ loading: true });

    const email = this.refs.email.getValue();
    const password = this.refs.password.getValue();

    this.props.signin(email, password);
  }
}

SigninComponent.displayName = 'UserSigninComponent';
SigninComponent.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

SigninComponent.propTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signin: (email, password) => {
      dispatch(actions.auth.signin(email, password));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SigninComponent));
