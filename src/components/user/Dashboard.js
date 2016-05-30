'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';

import 'styles/user/Dashboard.css';

const messages = defineMessages({

});

class Dashboard extends Component {
  render() {
    const {pokemons} = this.props;

    const collected = _.reduce(pokemons, (collected, pokemon) => {
      return collected + (pokemon.collected ? 1 : 0);
    }, 0);

    const progress = parseInt(collected / pokemons.length * 100);

    return (
      <div className="Dashboard container">
        <Paper zDepth={1}>
          <div className="Dashboard__progress">
            <h1>{progress}%</h1>
            <LinearProgress mode="determinate" value={progress} style={{height: '1rem'}}/>
          </div>
        </Paper>
      </div>
    );
  }
}

Dashboard.displayName = 'UserDashboard';
Dashboard.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  pokemons: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    pokemons: state.pokedex,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
