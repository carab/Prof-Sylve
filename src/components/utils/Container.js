'use strict';

import React, {Component, PropTypes} from 'react';

import Paper from 'material-ui/Paper';

class Container extends Component {
  render() {
    const {padded, fill, children} = this.props;
    const styles = {
      paper: {},
    };

    if (padded) {
      styles.paper.padding = '1rem';
    }

    return (
      <div className="container">
        <Paper zDepth={1} style={styles.paper}>
          {children}
        </Paper>
      </div>
    );
  }
}

Container.displayName = 'UtilsContainer';

Container.propTypes = {

};

export default Container;
