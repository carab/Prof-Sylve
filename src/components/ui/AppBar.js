'use strict';

import React, {Component, PropTypes} from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import SearchBox from './SearchBox';

import 'styles/ui/AppBar.css';

const messages = defineMessages({
  app: {id: 'ui.appBar.app'},
});

class AppBar extends Component {
  render() {
    const {formatMessage} = this.props.intl;
    const style = {
      backgroundColor: this.context.muiTheme.appBar.color
    };

    return (
      <div className="AppBar" style={style}>
        <div className="AppBar__left">
          {formatMessage(messages.app)}
        </div>
        <div className="AppBar__middle">
          <SearchBox/>
        </div>
        <div className="AppBar__right">

        </div>
      </div>
    );
  }
}

AppBar.displayName = 'AppBarComponent';

AppBar.propTypes = {
    intl: intlShape.isRequired,
};

AppBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default injectIntl(AppBar);
