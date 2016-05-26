'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import FirebaseUtils from '../../utils/firebase-utils';

import 'styles/user/Signout.css';

class SignoutComponent extends Component {
  componentWillMount() {
    FirebaseUtils.signout();
  }

  componentWillUpdate(nextProps, nextState) {
    const {signedIn} = nextProps;

    if (!signedIn) {
      this.context.router.replace('/');
    }
  }

  render() {
    return null;
  }
}

SignoutComponent.displayName = 'UserSignoutComponent';
SignoutComponent.contextTypes = {
  router: () => { return React.PropTypes.func.isRequired; },
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.user.signedIn,
  };
};

export default connect(mapStateToProps)(SignoutComponent);
