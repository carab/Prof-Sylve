'use strict';

import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import Helmet from 'react-helmet';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ListIcon from 'material-ui/svg-icons/action/list';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ViewModuleIcon from 'material-ui/svg-icons/action/view-module';
import BugReportIcon from 'material-ui/svg-icons/action/bug-report';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import HomeIcon from 'material-ui/svg-icons/action/home';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import Appbar from 'components/Ui/Appbar/Appbar';

import withWidth, {LG} from 'utils/with-width';
import actions from 'actions';

import 'bootstrap/dist/css/bootstrap.css';
import './Main.css';

const messages = defineMessages({
  app: {id: 'app'},
  dashboard: {id: 'nav.dashboard'},
  back: {id: 'nav.back'},
  home: {id: 'nav.home'},
  byBox: {id: 'nav.byBox'},
  byList: {id: 'nav.byList'},
  friends: {id: 'nav.friends'},
  language: {id: 'nav.language'},
  bugs: {id: 'nav.bugs'},
  settings: {id: 'user.settings'},
  signout: {id: 'user.signout'},
});

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
      <div className="Main">
        <Helmet title="Prof. Sylve" onChangeClientState={this.handleChangeTitle}/>
        {this.renderLayout()}
      </div>
    );
  }

  handleChangeTitle = (newState) => {
    this.props.setTitle(newState.title);
  }

  renderLayout() {
    const {signedIn, profile, currentUsername, width} = this.props;
    const {formatMessage} = this.props.intl;

    let navItems = [];

    if (!signedIn) {
      navItems.push(this.renderNavMenuItem(<HomeIcon/>, '/', formatMessage(messages.home)));
      navItems.push(<Divider key="divider1"/>);
    }

    if (currentUsername) {
      if (signedIn && currentUsername !== profile.username) {
        navItems.push(this.renderNavMenuItem(<BackIcon/>, `/pokedex/${profile.username}/dashboard`, formatMessage(messages.back)));
        navItems.push(<Divider key="divider2"/>);
      }

      navItems.push(this.renderNavMenuItem(<DashboardIcon/>, `/pokedex/${currentUsername}/dashboard`, formatMessage(messages.dashboard)));
      navItems.push(this.renderNavMenuItem(<ViewModuleIcon/>, `/pokedex/${currentUsername}/pc`, formatMessage(messages.byBox)));
      navItems.push(this.renderNavMenuItem(<ListIcon/>, `/pokedex/${currentUsername}/list`, formatMessage(messages.byList)));
      navItems.push(<Divider key="divider3"/>);

      if (signedIn && currentUsername === profile.username) {
        //navItems.push(this.renderNavMenuItem(<PeopleIcon/>, '/friends', formatMessage(messages.friends)));
        navItems.push(this.renderNavMenuItem(<SettingsIcon/>, '/settings', formatMessage(messages.settings)));
        navItems.push(<Divider key="divider4"/>);
      }
    }

    // Handle drawer
    const drawerDocked = width > LG;
    let showMenuButton = true;
    let drawerOpen = this.state.navOpen;

    if (drawerDocked) {
      showMenuButton = false;
      drawerOpen = true;
    }

    return (
      <div className="prof-sylve">
        <Appbar onToggleNav={this.handleToggleNav} showMenuButton={showMenuButton}/>
        <Drawer
          docked={drawerDocked}
          open={drawerOpen}
          onRequestChange={this.handleToggleNavRequest}
        >
          <div className="Drawer">
            <List onChange={this.handleToggleNav}>
              {navItems}
              <ListItem leftIcon={<BugReportIcon/>} href="https://github.com/carab/Prof-Sylve/issues" rel="noopener" target="blank">{formatMessage(messages.bugs)}</ListItem>
              <ListItem
                primaryText={formatMessage(messages.language)}
                leftIcon={<LanguageIcon />}
                primaryTogglesNestedList={true}
                nestedItems={_.map({ en: 'English', fr: 'Français' }, this.renderLocaleMenuItem)}
              />
            </List>
          </div>
        </Drawer>
        <div className="Content">
          {this.props.children}
        </div>
      </div>
    );
  }

  renderNavMenuItem = (icon, path, text) => {
    const style = {};

    if (this.context.router.isActive(path, true)) {
      style.color = this.context.muiTheme.palette.primary1Color;
    }

    return (
      <ListItem key={path} leftIcon={icon} containerElement={<Link to={path}/>} onTouchTap={this.handleToggleNav} style={style}>
        {text}
      </ListItem>
    );
  }

  renderLocaleMenuItem = (text, locale) => {
    const isActive = this.isActiveLocale(locale);
    const style = {};

    if (isActive) {
      style.color = this.context.muiTheme.palette.accent1Color;
    }

    return <ListItem key={locale} onTouchTap={() => this.setLocale(locale)} primaryText={text} insetChildren={true} style={style}/>
  }

  handleToggleNavRequest(open) {
    this.setState({ navOpen: open });
  }

  handleToggleNav() {
    this.setState({ navOpen: !this.state.navOpen })
  }

  isActiveLocale(locale) {
    return (locale === this.props.profile.locale);
  }

  setLocale(locale) {
    this.props.setLocale(locale);
  }
}

Main.displayName = 'Main';
Main.propTypes = {};
Main.contextTypes = {
  router: PropTypes.object.isRequired,
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.auth.signedIn,
    profile: state.profile,
    currentUsername: state.ui.currentUsername,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: (locale) => {
      dispatch(actions.profile.setLocale(locale));
    },
    setTitle: (title) => {
      dispatch(actions.ui.setTitle(title));
    },
  };
}

export default withWidth()(injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)));
