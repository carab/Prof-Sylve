import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { selectAuth } from 'selectors/selectors';
import actions from 'actions';

import './Signin.css';

const messages = defineMessages({
  signin: { id: 'user.signin' },
  subtitle: { id: 'user.signinSubtitle' },
  email: { id: 'user.email' },
  password: { id: 'user.password' },
  invalidEmail: { id: 'errors.invalidEmail' },
  wrongPassword: { id: 'errors.wrongPassword' },
  userDisabled: { id: 'errors.userDisabled' },
  userNotFound: { id: 'errors.userNotFound' },
});

function UserSignin() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {
    errors: { signin: signinError },
  } = useSelector(selectAuth);

  useEffect(() => {
    if (signinError) {
      switch (signinError.code) {
        case 'auth/invalid-email':
          setErrors({ email: messages.invalidEmail });
          break;
        case 'auth/user-disabled':
          setErrors({ email: messages.userDisabled });
          break;
        case 'auth/user-not-found':
          setErrors({ email: messages.userNotFound });
          break;
        case 'auth/wrong-password':
          setErrors({ password: messages.wrongPassword });
          break;
        default:
          break;
      }

      setLoading(false);
    }
  }, [signinError]);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    dispatch(actions.auth.signin(values.email, values.password));
  }

  function handleValueChange(event) {
    const { name, value } = event.target;

    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          title={formatMessage(messages.signin)}
          subtitle={formatMessage(messages.subtitle)}
        />
        <CardContent>
          <TextField
            name="email"
            type="email"
            value={values.email}
            onChange={handleValueChange}
            label={formatMessage(messages.email)}
            variant="outlined"
            margin="normal"
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email && formatMessage(errors.email)}
          />
          <TextField
            name="password"
            type="password"
            value={values.password}
            onChange={handleValueChange}
            label={formatMessage(messages.password)}
            variant="outlined"
            margin="normal"
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password && formatMessage(errors.password)}
          />
        </CardContent>
        <CardActions>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Button type="submit" color="primary" variant="contained">
              {formatMessage(messages.signin)}
            </Button>
          )}
        </CardActions>
      </Card>
    </form>
  );
}

export default UserSignin;
