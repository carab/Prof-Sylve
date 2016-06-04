'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';

import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

import Progress from 'components/user/Progress';

import actions from '../../actions';

import 'styles/user/Public.css';

const messages = defineMessages({
  notVisible: {id: 'dashboard.notVisible'},
});

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
      return <Progress pokedex={publicPokedex} isPublic={true}></Progress>;
    }

    if (publicPokedex === false) {
      return (
        <div className="Public__error container">
          <Paper zDepth={1}>
            <div className="Public__error">{this.props.intl.formatMessage(messages.notVisible)}</div>
          </Paper>
        </div>
      );
    }

    return (
      <div style={{textAlign: 'center', padding: '2rem 0'}}>
        <CircularProgress size={2}/>
      </div>
    );
  }
}

Public.displayName = 'UserPublic';

Public.propTypes = {
  params: PropTypes.object.isRequired,
  publicPokedex: PropTypes.object,
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
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Public));
