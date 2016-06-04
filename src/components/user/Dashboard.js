'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Progress from 'components/user/Progress';

class Dashboard extends Component {
  render() {
    const {pokedex} = this.props;

    return <Progress pokedex={pokedex}></Progress>;
  }
}

Dashboard.displayName = 'UserDashboard';

Dashboard.propTypes = {
  pokedex: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    pokedex: state.pokedex,
  };
};

export default connect(mapStateToProps)(Dashboard);
