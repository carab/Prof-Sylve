'use strict';

import _ from 'lodash';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import PowerSettingsNewIcon from 'material-ui/svg-icons/action/power-settings-new';

class Appbar extends Component {
  render() {
    const {showMenuButton, onToggleNav} = this.props;
    const {title, currentUsername, profile} = this.props;

    const style = {
      position: 'fixed',
      zIndex: this.context.muiTheme.zIndex.drawer + 1,
    }

    return (
      <AppBar
        title={title}
        onLeftIconButtonTouchTap={onToggleNav}
        iconElementRight={this.renderRight()}
        showMenuIconButton={showMenuButton}
        style={style}
      />
    );
  }

  renderRight() {
    const {signedIn} = this.props;

    if (signedIn) {
      return <IconButton containerElement={<Link to="/signout" />}><PowerSettingsNewIcon/></IconButton>;
    }
  }
}

Appbar.displayName = 'UserAppbar';
Appbar.propTypes = {};
Appbar.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    signedIn: state.auth.signedIn,
    title: state.ui.title,
    currentUsername: state.ui.currentUsername,
    profile: state.profile,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Appbar));
