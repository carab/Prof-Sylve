import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { red500, red300, indigo500 } from "material-ui/styles/colors";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red500,
    primary2Color: red300,
    accent1Color: indigo500,
  },
});

function Theme({ children }) {
  return <MuiThemeProvider muiTheme={muiTheme}>{children}</MuiThemeProvider>;
}

export default Theme;
