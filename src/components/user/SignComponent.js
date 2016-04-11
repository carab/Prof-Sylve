'use strict';

import React from 'react';

import SigninComponent from 'components/user/SigninComponent';
import SignupComponent from 'components/user/SignupComponent';

import 'styles/user/Sign.css';

class SignComponent extends React.Component {
  render() {
    return (
      <div className="sign-component container">
        <div className="row center-xs">
          <div className="col-xs-12 col-sm-6 sign-component__form">
            <SignupComponent/>
          </div>
          <div className="col-xs-12 col-sm-6 sign-component__form">
            <SigninComponent/>
          </div>
        </div>
      </div>
    );
  }
}

SignComponent.displayName = 'UserSignComponent';

export default SignComponent;
