'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Actions from '../../actions/pokedex';

class Pokedex extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.params.username !== this.props.params.username);
  }

  render() {
    const {params, onLoad} = this.props;

    onLoad(params.username);

    return this.props.children;
  }
}

Pokedex.displayName = 'Pokedex';
Pokedex.contextTypes = {};
Pokedex.propTypes = {};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (username) => {
      dispatch(Actions.listen(username));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pokedex);
