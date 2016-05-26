'use strict';

import React from 'react';
import {Provider} from 'react-redux';

import store from './store';
import actions from './actions';

class UserComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    store.dispatch(actions.startListeningToUser());
  }

  render() {
    return (
      <IntlProvider locale={locale} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.user.currently === 'AUTH_AUTHENTICATED',
    profile: state.user.data.profile,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserComponent));
