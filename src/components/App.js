'use strict';

import React from 'react';
import { Link } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import AppBar from 'material-ui/lib/app-bar';
import Divider from 'material-ui/lib/divider'
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import PowerSettingsNew from 'material-ui/lib/svg-icons/action/power-settings-new';
import Settings from 'material-ui/lib/svg-icons/action/settings';

require('styles/App.css');

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppBar
          title="Prof. Sylve's Living Dex"
          iconElementRight={
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
          }
        />
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
