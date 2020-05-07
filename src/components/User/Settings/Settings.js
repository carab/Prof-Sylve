import debounce from 'lodash/debounce';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Colors from 'data/colors';
import actions from 'actions';
import { selectProfile, selectAuth } from 'selectors/selectors';
import useDebounce from 'hooks/useDebounce';
import useFirebasePokedex from 'hooks/useFirebasePokedex';

import './Settings.css';

const messages = defineMessages({
  settings: { id: 'user.settings' },
  visibility: { id: 'settings.visibility' },
  isPublic: { id: 'settings.public' },
  missingUsername: { id: 'settings.missingUsername' },
  username: { id: 'user.username' },
  tags: { id: 'pokemon.tag.tags' },
  save: { id: 'label.save' },
  red: { id: 'pokemon.tag.color.red' },
  yellow: { id: 'pokemon.tag.color.yellow' },
  green: { id: 'pokemon.tag.color.green' },
  cyan: { id: 'pokemon.tag.color.cyan' },
  pink: { id: 'pokemon.tag.color.pink' },
  orange: { id: 'pokemon.tag.color.orange' },
  purple: { id: 'pokemon.tag.color.purple' },
  indigo: { id: 'pokemon.tag.color.indigo' },
  teal: { id: 'pokemon.tag.color.teal' },
  lime: { id: 'pokemon.tag.color.lime' },
  brown: { id: 'pokemon.tag.color.brown' },
});

function Settings() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const previousUsername = profile?.username;
  const [username, setUsername] = useState(previousUsername);
  const debouncedUsername = useDebounce(username);
  const [errors, setErrors] = useState({});
  const { user } = useSelector(selectAuth);
  const [pokedex] = useFirebasePokedex(user?.uid);
  const settings = pokedex?.settings;

  // Validate new username
  useEffect(() => {
    setErrors((errors) => ({
      ...errors,
      username: !username ? formatMessage(messages.missingUsername) : undefined,
    }));
  }, [formatMessage, username]);

  // Ensure username is properly setted
  useEffect(() => {
    setUsername(previousUsername);
  }, [previousUsername]);

  // Save new username
  useEffect(() => {
    if (debouncedUsername && debouncedUsername !== previousUsername) {
      dispatch(actions.profile.setUsername(debouncedUsername, previousUsername));
    }
  }, [debouncedUsername, dispatch, previousUsername]);

  const handlePublicChange = useCallback(
    (event) => {
      dispatch(actions.pokedex.setSettingsPublic(event.target.checked));
    },
    [dispatch],
  );

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleTagChange = useCallback(
    debounce((tag, title) => {
      dispatch(actions.pokedex.setSettingsTag(tag, title));
    }, 300),
    [dispatch],
  );

  if (!settings) {
    return null;
  }

  return (
    <div className="Settings container" style={{ paddingTop: '1em' }}>
      <div className="row">
        <div className="col-md-6">
          <Paper elevation={1}>
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                {formatMessage(messages.visibility)}
              </Typography>
            </Toolbar>
            <div className="Settings__fields">
              <FormControlLabel
                control={
                  <Switch checked={settings?.public ?? false} onChange={handlePublicChange} />
                }
                label={formatMessage(messages.isPublic)}
              />
              <TextField
                name="username"
                label={formatMessage(messages.username)}
                fullWidth
                margin="normal"
                value={username}
                error={Boolean(errors.username)}
                helperText={errors.username}
                onChange={handleUsernameChange}
              />
            </div>
          </Paper>
        </div>
        <div className="col-md-6">
          <Paper elevation={1}>
            <Toolbar>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                {formatMessage(messages.tags)}
              </Typography>
            </Toolbar>
            <div className="Settings__fields">
              <div className="row">
                {Object.entries(Colors.tags).map(([name, color]) => (
                  <div key={name} className="col-xs-6 col-sm-4 col-md-6">
                    <TextField
                      name={'tag-' + name}
                      label={formatMessage(messages[name])}
                      fullWidth
                      margin="normal"
                      defaultValue={settings?.tags?.[name] ?? ''}
                      onChange={(event) => handleTagChange(name, event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BookmarkIcon style={{ color: color }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Settings;
