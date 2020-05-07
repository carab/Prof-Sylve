import React, { useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Appbar from 'components/Ui/Appbar/Appbar';
import Pokedex from 'components/Pokedex/Pokedex';
import UserSign from 'components/User/Sign/Sign';
import UserSignout from 'components/User/Signout/Signout';
import UserSettings from 'components/User/Settings/Settings';
import UserFriends from 'components/User/Friends/Friends';
import actions from 'actions';
import Sidebar from 'components/Sidebar/Sidebar';
import { AppbarContextProvider } from 'components/Ui/Appbar/AppbarContextProvider';

import 'bootstrap/dist/css/bootstrap-grid.css';
import './Main.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appbar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const classes = useStyles();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(actions.ui.setMediaQuery('upMd', isUpMd));
    dispatch(actions.ui.setMediaQuery('downMd', !isUpMd));
    dispatch(actions.ui.setMediaQuery('upSm', isUpSm));
    dispatch(actions.ui.setMediaQuery('downSm', !isUpSm));
  }, [dispatch, isUpMd, isUpSm]);

  return (
    <div className="Main">
      <Helmet title="Prof. Sylve" onChangeClientState={handleTitleChange} />
      {renderLayout()}
    </div>
  );

  function renderLayout() {
    const sidebar = <Sidebar onNavigate={handleSidebarToggle} showTitle={!isUpMd} />;

    return (
      <AppbarContextProvider>
        <Appbar className={classes.appbar} onToggleNav={handleSidebarToggle} showTitle={isUpMd} />
        {isUpMd ? (
          <Drawer
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {sidebar}
          </Drawer>
        ) : null}
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={!isUpMd && sidebarOpen}
          onClose={handleSidebarToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {sidebar}
        </Drawer>
        <div className="Content">
          <Toolbar />
          <Switch>
            <Route exact path="/" component={UserSign} />
            <Route path="/signout" component={UserSignout} />
            <Route path="/pokedex/:username" component={Pokedex} />
            <Route path="/friends" component={UserFriends} />
            <Route path="/settings" component={UserSettings} />
          </Switch>
        </div>
      </AppbarContextProvider>
    );
  }

  function handleTitleChange(newState) {
    dispatch(actions.ui.setTitle(newState.title));
  }

  function handleSidebarToggle() {
    setSidebarOpen((sidebarOpen) => !sidebarOpen);
  }
}

export default Main;
