import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import UserSignup from 'components/User/Signup/Signup';
import UserSignin from 'components/User/Signin/Signin';
import { selectProfile, selectAuth } from 'selectors/selectors';

const messages = defineMessages({
  app: { id: 'app' },
  subtitle: { id: 'intro.subtitle' },
  text: { id: 'intro.text' },
});

function UserSign() {
  const { formatMessage } = useIntl();
  const { signed } = useSelector(selectAuth);
  const { username } = useSelector(selectProfile);

  if (signed && username) {
    return <Redirect to={`/pokedex/${username}`} />;
  }

  return (
    <div className="container" style={{ paddingTop: '2em' }}>
      <Card>
        <CardHeader
          title={formatMessage(messages.app)}
          subtitle={formatMessage(messages.subtitle)}
        />
        <CardContent>
          <Typography
            component="p"
            dangerouslySetInnerHTML={{ __html: formatMessage(messages.text) }}
          />
        </CardContent>
      </Card>
      <div className="row" style={{ paddingTop: '2em' }}>
        <div className="col-xs-12 col-sm-6">
          <UserSignup />
        </div>
        <div className="col-xs-12 col-sm-6">
          <UserSignin />
        </div>
      </div>
    </div>
  );
}

export default UserSign;
