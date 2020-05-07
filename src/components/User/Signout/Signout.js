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
    const {signed} = nextProps;

    if (!signed) {
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
    signed: state.auth.signed,
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
