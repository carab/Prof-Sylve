'use strict';

import React from 'react';
import { Link } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
try {
  injectTapEventPlugin();
} catch (e) {

}

import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import PowerSettingsNew from 'material-ui/lib/svg-icons/action/power-settings-new';
import Settings from 'material-ui/lib/svg-icons/action/settings';
import List from 'material-ui/lib/svg-icons/action/list';
import ViewModule from 'material-ui/lib/svg-icons/action/view-module';
import BugReport from 'material-ui/lib/svg-icons/action/bug-report';

import FirebaseUtils from '../utils/firebase-utils';

require('flexboxgrid/dist/flexboxgrid.css');
require('styles/App.css');

const styles = {
  appbar: {
    position: 'fixed',
    zIndex: 1301
  },
  menu: {
    paddingTop: '64px'
  },
  container: {
    paddingTop: '64px'
  }
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleAuth = this.handleAuth.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleToggleMenuRequest = this.handleToggleMenuRequest.bind(this);

    this.state = {
      loggedIn: FirebaseUtils.isLoggedIn()
    }
  }

  componentDidMount() {
    FirebaseUtils.onAuth(this.handleAuth);
  }

  render() {
    let userMenu;
    let menuItems;

    if (this.state.loggedIn) {
      menuItems = (
        <Menu>
          <MenuItem onTouchTap={this.handleToggleMenu} leftIcon={<ViewModule />} containerElement={<Link to="/" />}>By Box</MenuItem>
          <MenuItem onTouchTap={this.handleToggleMenu} leftIcon={<List />} containerElement={<Link to="/list" />}>By List</MenuItem>
          <Divider/>
        </Menu>
      );

      userMenu = (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="Settings" leftIcon={<Settings />}/>
          <Divider/>
          <MenuItem primaryText="Sign out" leftIcon={<PowerSettingsNew />} containerElement={<Link to="/signout" />}/>
        </IconMenu>
      );
    }

    return (
      <div className="prof-sylve">
        <AppBar
          title="Prof. Sylve's Living Dex"
          onLeftIconButtonTouchTap={this.handleToggleMenu}
          iconElementRight={userMenu}
          style={styles.appbar}
        />
        <LeftNav
          docked={false}
          open={this.state.menuOpen}
          onRequestChange={this.handleToggleMenuRequest}
        >
          <div style={styles.menu}></div>
          {menuItems}
          <Menu>
            <MenuItem leftIcon={<BugReport />} href="https://github.com/carab/Prof-Sylve">Github/Bugs</MenuItem>
          </Menu>
        </LeftNav>
        <div style={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  }

  handleToggleMenuRequest(open) {
    this.setState({ menuOpen: open });
  }

  handleToggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleAuth(loggedIn) {
    this.setState({ loggedIn });
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
