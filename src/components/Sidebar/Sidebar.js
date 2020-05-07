import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import { useRouteMatch } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Appbar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import SettingsIcon from '@material-ui/icons/Settings';
import ListIcon from '@material-ui/icons/List';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import BugReportIcon from '@material-ui/icons/BugReport';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import actions from 'actions';
import { selectAuth, selectProfile, selectUi } from 'selectors/selectors';
import Link from 'components/utils/Link';
import { LOCALES } from 'components/LocaleProvider';

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

const messages = defineMessages({
  app: { id: 'app' },
  dashboard: { id: 'nav.dashboard' },
  back: { id: 'nav.back' },
  home: { id: 'nav.home' },
  byBox: { id: 'nav.byBox' },
  byList: { id: 'nav.byList' },
  friends: { id: 'nav.friends' },
  language: { id: 'nav.language' },
  bugs: { id: 'nav.bugs' },
  settings: { id: 'user.settings' },
  signout: { id: 'user.signout' },
});

function Sidebar({ onNavigate, showTitle }) {
  const { formatMessage } = useIntl();
  const [localeOpen, setLocaleOpen] = useState(false);
  const dispatch = useDispatch();
  const { signed } = useSelector(selectAuth);
  const profile = useSelector(selectProfile);
  const { currentUsername, currentBox, title, locale } = useSelector(selectUi);
  const activeUsername = currentUsername ?? profile?.username;

  const matchDasboard = useRouteMatch({ path: '/pokedex/:username', exact: true });
  const matchPc = useRouteMatch('/pokedex/:username/pc/:currentBox?');
  const matchList = useRouteMatch('/pokedex/:username/list/:splat(.*)?');
  const matchSettings = useRouteMatch('/settings');

  return (
    <div className="Sidebar">
      {showTitle ? (
        <Appbar position="static">
          <Toolbar>
            <Typography variant="h6">{title}</Typography>
          </Toolbar>
        </Appbar>
      ) : (
        <Toolbar />
      )}
      <List>
        {!signed ? (
          <>
            {renderSidebarItem(<HomeIcon />, '/', formatMessage(messages.home))}
            <Divider />
          </>
        ) : null}
        {activeUsername ? (
          <>
            {profile?.username && profile.username !== activeUsername ? (
              <>
                {renderSidebarItem(
                  <ArrowBackIcon />,
                  `/pokedex/${profile.username}`,
                  formatMessage(messages.back),
                )}
                <Divider />
              </>
            ) : null}
            {renderSidebarItem(
              <DashboardIcon />,
              `/pokedex/${activeUsername}`,
              formatMessage(messages.dashboard),
              Boolean(matchDasboard),
            )}
            {renderSidebarItem(
              <ViewModuleIcon />,
              `/pokedex/${activeUsername}/pc/${currentBox}`,
              formatMessage(messages.byBox),
              Boolean(matchPc),
            )}
            {renderSidebarItem(
              <ListIcon />,
              `/pokedex/${activeUsername}/list`,
              formatMessage(messages.byList),
              Boolean(matchList),
            )}
            <Divider />
          </>
        ) : null}
        {signed ? (
          <>
            {/* {renderSidebarItem(<PeopleIcon/>, '/friends', formatMessage(messages.friends))} */}
            {renderSidebarItem(
              <SettingsIcon />,
              '/settings',
              formatMessage(messages.settings),
              Boolean(matchSettings),
            )}
            {renderSidebarItem(
              <PowerSettingsNewIcon />,
              '/signout',
              formatMessage(messages.signout),
            )}
          </>
        ) : null}
        <ListItem button onClick={handleLocaleToggle}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText>{formatMessage(messages.language)}</ListItemText>
          {localeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={localeOpen} timeout="auto" unmountOnExit>
          <List>{LOCALES.map(renderLocaleMenuItem)}</List>
        </Collapse>
        <Divider />
        <ListItemLink to="https://github.com/carab/Prof-Sylve/issues" onClick={onNavigate}>
          <ListItemIcon>
            <BugReportIcon />
          </ListItemIcon>
          <ListItemText primary={formatMessage(messages.bugs)} />
        </ListItemLink>
      </List>
    </div>
  );

  function renderSidebarItem(icon, path, text, selected) {
    return (
      <ListItemLink key={path} to={path} onClick={onNavigate} selected={selected}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </ListItemLink>
    );
  }

  function renderLocaleMenuItem(locale) {
    const isActive = isActiveLocale(locale.value);

    return (
      <ListItem
        key={locale.value}
        button
        onClick={() => handleLocaleChange(locale.value)}
        selected={isActive}
      >
        <ListItemText inset primary={locale.label} />
      </ListItem>
    );
  }

  function isActiveLocale(_locale) {
    return locale && locale === _locale;
  }

  function handleLocaleChange(locale) {
    dispatch(actions.ui.setLocale(locale));
    dispatch(actions.profile.setLocale(locale));
  }

  function handleLocaleToggle() {
    setLocaleOpen((localeOpen) => !localeOpen);
  }
}

export default Sidebar;
