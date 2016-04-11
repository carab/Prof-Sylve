'use strict';

import React from 'react';
import { Link } from 'react-router';

import DocumentTitle from 'react-document-title';
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
import Language from 'material-ui/lib/svg-icons/action/language';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../utils/firebase-utils';
import Translations from '../utils/translations-loader';

import 'flexboxgrid/dist/flexboxgrid.css';
import 'styles/App.css';

const messages = defineMessages({
  app: {id: 'app'},
  byBox: {id: 'nav.byBox'},
  byList: {id: 'nav.byList'},
  bugs: {id: 'nav.bugs'},
  settings: {id: 'user.settings'},
  signout: {id: 'user.signout'}
});

const styles = {
  appbar: {
    position: 'fixed',
    zIndex: 1301
  },
  nav: {
    paddingTop: '64px'
  }
};

class AppComponent extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleAuth = this.handleAuth.bind(this);
    this.handleToggleNav = this.handleToggleNav.bind(this);
    this.handleToggleNavRequest = this.handleToggleNavRequest.bind(this);

    this.state = {
      loggedIn: FirebaseUtils.isLoggedIn()
    }
  }

  componentDidMount() {
    FirebaseUtils.onAuth(this.handleAuth);
  }

  render() {
    const {formatMessage} = this.props.intl;

    let menu;
    let navItems;

    if (this.state.loggedIn) {
      const currentRoute = this.props.location.pathname;

      navItems = (
        <Menu value={currentRoute}>
          <MenuItem value="/" onTouchTap={this.handleToggleNav} leftIcon={<ViewModule />} containerElement={<Link to="/" />}>{formatMessage(messages.byBox)}</MenuItem>
          <MenuItem value="/list" onTouchTap={this.handleToggleNav} leftIcon={<List />} containerElement={<Link to="/list" />}>{formatMessage(messages.byList)}</MenuItem>
          <Divider/>
        </Menu>
      );

      menu = (
        <IconMenu
          iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
          }
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText={formatMessage(messages.settings)} leftIcon={<Settings />} containerElement={<Link to="/settings" />}/>
          <Divider/>
          <MenuItem primaryText={formatMessage(messages.signout)} leftIcon={<PowerSettingsNew />} containerElement={<Link to="/signout" />}/>
        </IconMenu>
      );
    }

    return (
      <DocumentTitle title="Prof. Sylve">
        <div className="prof-sylve">
          <AppBar
            title={formatMessage(messages.app)}
            onLeftIconButtonTouchTap={this.handleToggleNav}
            iconElementRight={menu}
            style={styles.appbar}
          />
          <LeftNav
            docked={false}
            open={this.state.navOpen}
            onRequestChange={this.handleToggleNavRequest}
          >
            <div style={styles.nav}></div>
            {navItems}
            <Menu value={Translations.locale}>
              <MenuItem value="en" leftIcon={<Language />} onTouchTap={this.handleChangeLocale.bind(this, 'en')}>English</MenuItem>
              <MenuItem value="fr" leftIcon={<Language />} onTouchTap={this.handleChangeLocale.bind(this, 'fr')}>Français</MenuItem>
              <Divider/>
              <MenuItem leftIcon={<BugReport />} href="https://github.com/carab/Prof-Sylve" target="blank">{formatMessage(messages.bugs)}</MenuItem>
            </Menu>
          </LeftNav>
          <div className="prof-sylve__content">
            {this.props.children}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  handleChangeLocale(locale) {
    Translations.changeLocale(locale);
    this.setState({ navOpen: false });
    if (FirebaseUtils.isLoggedIn()) {
      FirebaseUtils.getUserRef().child('settings/locale').set(locale);
    }
  }

  handleToggleNavRequest(open) {
    this.setState({ navOpen: open });
  }

  handleToggleNav() {
    this.setState({ navOpen: !this.state.navOpen })
  }

  handleAuth(loggedIn) {
    if (loggedIn) {
      this.setState({ loggedIn });
    } else {
      this.context.router.replace('/');
    }
  }
}

AppComponent.defaultProps = {};

AppComponent.propTypes = {
    intl: intlShape.isRequired
};

AppComponent.contextTypes = {
    router: () => { return React.PropTypes.func.isRequired; }
};

export default injectIntl(AppComponent);
