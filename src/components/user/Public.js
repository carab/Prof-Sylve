'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import actions from '../../actions';

class Public extends Component {
  componentWillMount() {
    const {publicPokedex, params, loadPublicPokedex} = this.props;

    if (!publicPokedex) {
      loadPublicPokedex(params.username);
    }
  }

  componentWillUnmount() {
    this.props.loadPublicPokedex(null);
  }

  render() {
    const {publicPokedex} = this.props;

    if (publicPokedex) {
      return <div>{publicPokedex.settings.username}</div>;
    }

    return null;
  }
}

Public.displayName = 'UserPublic';
Public.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

Public.propTypes = {
  params: PropTypes.object.isRequired,
  publicPokedex: PropTypes.object,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    publicPokedex: state.ui.publicPokedex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadPublicPokedex(username) {
      dispatch(actions.ui.loadPublicPokedex(username));
    }
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Public));
