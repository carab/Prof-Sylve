'use strict';

import React from 'react';

import FirebaseUtils from '../../utils/firebase-utils';

import 'styles/user/Signout.css';

class SignoutComponent extends React.Component {
  constructor(props, context) {
    super(props);

    this.router = context.router;
  }

  componentDidMount() {
    FirebaseUtils.signout();
    this.context.router.replace('/');
  }

  render() {
    return (
      <div></div>
    );
  }
}

SignoutComponent.displayName = 'UserSignoutComponent';
SignoutComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; }
};

export default SignoutComponent;
