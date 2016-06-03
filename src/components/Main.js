'use strict';

import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import DocumentTitle from 'react-document-title';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIconIcon from 'material-ui/svg-icons/navigation/more-vert';
import PowerSettingsNewIcon from 'material-ui/svg-icons/action/power-settings-new';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ListIcon from 'material-ui/svg-icons/action/list';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';
import BugReportIcon from 'material-ui/svg-icons/action/bug-report';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import PeopleIcon from 'material-ui/svg-icons/social/people';

import withWidth, {XS, SM, MD, LG} from '../utils/with-width';
import actions from '../actions';

import 'bootstrap/dist/css/bootstrap.css';
import 'styles/App.css';

const SelectableList = MakeSelectable(List);

const messages = defineMessages({
  app: {id: 'app'},
  dashboard: {id: 'nav.dashboard'},
  byBox: {id: 'nav.byBox'},
  byList: {id: 'nav.byList'},
  friends: {id: 'nav.friends'},
  language: {id: 'nav.language'},
  bugs: {id: 'nav.bugs'},
  settings: {id: 'user.settings'},
  signout: {id: 'user.signout'},
});

const styles = {
  appbar: {
    position: 'fixed',
    zIndex: 1301,
  },
};

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleToggleNav = this.handleToggleNav.bind(this);
    this.handleToggleNavRequest = this.handleToggleNavRequest.bind(this);
    this.setLocale = this.setLocale.bind(this);

    this.state = {};
  }

  render() {
    return (
      <DocumentTitle title="Prof. Sylve">
        {this.renderLayout()}
      </DocumentTitle>
    );
  }

  renderLayout() {
    const {locale, setLocale, isSignedIn, width} = this.props;
    const {formatMessage} = this.props.intl;

    let menu;
    let navItems;

    if (isSignedIn) {
      const currentRoute = this.props.location.pathname;

      navItems = (
        <SelectableList value={currentRoute} onChange={() => true}>
          <ListItem value="/" onTouchTap={this.handleToggleNav} leftIcon={<DashboardIcon/>} containerElement={<Link to="/" />}>{formatMessage(messages.dashboard)}</ListItem>
          <ListItem value="/pc" onTouchTap={this.handleToggleNav} leftIcon={<ViewModuleIcon/>} containerElement={<Link to="/pc" />}>{formatMessage(messages.byBox)}</ListItem>
          <ListItem value="/pokedex" onTouchTap={this.handleToggleNav} leftIcon={<ListIcon/>} containerElement={<Link to="/pokedex" />}>{formatMessage(messages.byList)}</ListItem>
          <ListItem value="/friends" onTouchTap={this.handleToggleNav} leftIcon={<PeopleIcon/>} containerElement={<Link to="/friends" />}>{formatMessage(messages.friends)}</ListItem>
          <Divider/>
        </SelectableList>
      );

      menu = (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIconIcon/></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText={formatMessage(messages.settings)} leftIcon={<SettingsIcon/>} containerElement={<Link to="/settings" />}/>
          <Divider/>
          <MenuItem primaryText={formatMessage(messages.signout)} leftIcon={<PowerSettingsNewIcon/>} containerElement={<Link to="/signout" />}/>
        </IconMenu>
      );
    }

    const drawerDocked = !(width === XS || width === SM || width === MD || width === LG);
    let showMenuIconButton = true;
    let drawerOpen = this.state.navOpen;

    if (drawerDocked) {
      showMenuIconButton = false;
      drawerOpen = true;
    }

    return (
      <div className="prof-sylve">
        <AppBar
          title={formatMessage(messages.app)}
          onLeftIconButtonTouchTap={this.handleToggleNav}
          iconElementRight={menu}
          showMenuIconButton={showMenuIconButton}
          style={styles.appbar}
        />
        <Drawer
          docked={drawerDocked}
          open={drawerOpen}
          onRequestChange={this.handleToggleNavRequest}
        >
          <div className="Drawer">
            {navItems}
            <SelectableList value={locale} onChange={this.setLocale}>
              <ListItem
                primaryText={formatMessage(messages.language)}
                leftIcon={<LanguageIcon />}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem value="en" primaryText="English" insetChildren={true}/>,
                  <ListItem value="fr" primaryText="Français" insetChildren={true}/>,
                ]}
              />
            </SelectableList>
            <List>
              <Divider/>
              <ListItem leftIcon={<BugReportIcon/>} href="https://github.com/carab/Prof-Sylve/issues" target="blank">{formatMessage(messages.bugs)}</ListItem>
            </List>
          </div>
        </Drawer>
        <div className="Content">
          {this.props.children}
        </div>
      </div>
    );
  }

  handleToggleNavRequest(open) {
    this.setState({ navOpen: open });
  }

  handleToggleNav() {
    this.setState({ navOpen: !this.state.navOpen })
  }

  setLocale(event, locale) {
    this.props.setLocale(locale);
  }
}

Main.displayName = 'Main';
Main.contextTypes = {
  router: () => { return React.PropTypes.func.isRequired; },
};

Main.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    locale: state.profile.locale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: (locale) => {
      dispatch(actions.profile.setLocale(locale));
    },
  };
}

export default withWidth()(injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)));
