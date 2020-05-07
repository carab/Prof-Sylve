import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import actions from 'actions';
import { selectAuth } from 'selectors/selectors';

import './Signup.css';

const messages = defineMessages({
  signup: { id: 'user.signup' },
  subtitle: { id: 'user.signupSubtitle' },
  email: { id: 'user.email' },
  password: { id: 'user.password' },
  passwordConfirmation: { id: 'user.passwordConfirmation' },
  alreadyUsed: { id: 'errors.alreadyUsed' },
  invalidEmail: { id: 'errors.invalidEmail' },
  invalidPassword: { id: 'errors.invalidPassword' },
  invalidConfirmation: { id: 'errors.invalidConfirmation' },
});

function UserSignup() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const {
    errors: { signup: signupError },
  } = useSelector(selectAuth);

  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (signupError) {
      switch (signupError.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: messages.alreadyUsed });
          break;
        case 'auth/invalid-email':
          setErrors({ email: messages.invalidEmail });
          break;
        case 'auth/weak-password':
          setErrors({ password: messages.invalidPassword });
          break;
        default:
          break;
      }

      setLoading(false);
    }
  }, [signupError]);

  function handleSubmit(e) {
    e.preventDefault();

    setErrors({});

    if (values.password !== values.passwordConfirmation) {
      setErrors({ passwordConfirmation: messages.invalidConfirmation });
    } else {
      setLoading(true);
      dispatch(actions.auth.signup(values.email, values.password));
    }
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
          title={formatMessage(messages.signup)}
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
          <TextField
            name="passwordConfirmation"
            type="password"
            value={values.passwordConfirmation}
            onChange={handleValueChange}
            label={formatMessage(messages.passwordConfirmation)}
            variant="outlined"
            margin="normal"
            fullWidth
            error={Boolean(errors.passwordConfirmation)}
            helperText={errors.passwordConfirmation && formatMessage(errors.passwordConfirmation)}
          />
        </CardContent>
        <CardActions className="text-xs-center">
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Button type="submit" color="secondary" variant="contained">
              {formatMessage(messages.signup)}
            </Button>
          )}
        </CardActions>
      </Card>
    </form>
  );
}

export default UserSignup;
