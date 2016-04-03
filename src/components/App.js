'use strict';

import React from 'react';

import AppBar from 'material-ui/lib/app-bar';

require('normalize.css/normalize.css');
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
        />
        {this.props.children}
      </div>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
