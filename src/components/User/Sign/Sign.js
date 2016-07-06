'use strict';

import React from 'react';
import {injectIntl, defineMessages, FormattedHTMLMessage} from 'react-intl';

import {Card, CardTitle, CardText} from 'material-ui/Card';

import UserSignup from 'components/User/Signup/Signup';
import UserSignin from 'components/User/Signin/Signin';

import './Sign.css';

const messages = defineMessages({
  app: {id: 'app'},
  subtitle: {id: 'intro.subtitle'},
  text: {id: 'intro.text'},
});

class UserSign extends React.Component {
  render() {
    const {formatMessage} = this.props.intl;

    return (
      <div className="sign-component container">
        <Card>
          <CardTitle title={formatMessage(messages.app)} subtitle={formatMessage(messages.subtitle)}/>
          <CardText>
            <FormattedHTMLMessage id='intro.text'/>
          </CardText>
        </Card>
        <div className="row">
          <div className="col-xs-12 col-sm-6 sign-component__form">
            <UserSignup/>
          </div>
          <div className="col-xs-12 col-sm-6 sign-component__form">
            <UserSignin/>
          </div>
        </div>
      </div>
    );
  }
}

UserSign.displayName = 'UserSign';

export default injectIntl(UserSign);
