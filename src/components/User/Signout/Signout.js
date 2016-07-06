'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import actions from 'actions';

import './Signout.css';

class Signout extends Component {
  componentWillMount() {
    this.props.signout();
    this.componentWillUpdate(this.props);
  }

  componentWillUpdate(nextProps) {
    const {signedIn} = nextProps;

    if (!signedIn) {
      this.context.router.replace('/');
    }
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
    signedIn: state.auth.signedIn,
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
