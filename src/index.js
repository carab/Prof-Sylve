import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import Store from './components/Store';

class Root extends Component {
  render() {
    return (
      <Store/>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
