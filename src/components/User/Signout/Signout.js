'use strict';

import {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import actions from 'actions';

import './Signout.css';

class Signout extends Component {
  componentWillMount() {
    this.props.signout();
    this.componentWillUpdate(this.props);
  }

  componentWillUpdate(nextProps) {
    const {signedIn} = nextProps;

    if (!signedIn) {
      this.props.history.replace('/');
    }
  }

  render() {
    return null;
  }
}

Signout.displayName = 'UserSignout';

const mapStateToProps = (state) => {
  return {
    signedIn: state.auth.signedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signout: () => {
      dispatch(actions.auth.signout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signout));
