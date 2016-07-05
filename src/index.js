import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {green400, lightGreen500, orange800} from 'material-ui/styles/colors';

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

import Store from './components/Store';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green400,
    primary2Color: lightGreen500,
    accent1Color: orange800,
  },
});


class Root extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Store/>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<Root/>, document.getElementById('app'));
