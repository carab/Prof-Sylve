'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import actions from '../../actions';

import 'styles/user/Signout.css';

class Signout extends Component {
  componentWillMount() {
    this.props.signout();
  }

  render() {
    return null;
  }
}

Signout.displayName = 'UserSignout';
Signout.contextTypes = {
  router: () => { return React.PropTypes.func.isRequired; },
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => {
      dispatch(actions.auth.signout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signout);
