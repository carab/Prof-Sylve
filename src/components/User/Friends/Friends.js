'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';

import './Friends.css';

const messages = defineMessages({
  none: {id: 'user.friends.none'},
  friends: {id: 'user.friends.friends'},
});

class Friends extends Component {
  render() {
    const {friends, intl} = this.props;

    return (
      <div className="UserFriends container">
        <Paper zDepth={1}>
          <Toolbar>
            <ToolbarGroup float="left">
              <ToolbarTitle text={intl.formatMessage(messages.friends, { friends: friends.length })}/>
            </ToolbarGroup>
            <ToolbarGroup float="right">
              <IconButton><PersonAddIcon/></IconButton>
            </ToolbarGroup>
          </Toolbar>
          {this.renderFriends()}
        </Paper>
      </div>
    );
  }

  renderFriends() {
    const {friends, intl} = this.props;

    if (friends.length) {
      return (
        <List>
          {_.map(friends, (friend, index) => (
            <ListItem key={index} primaryText={friend}/>
          ))}
        </List>
      );
    }

    return (
      <p className="UserFriends__none">{intl.formatMessage(messages.none)}</p>
    );
  }
}

Friends.displayName = 'UserFriends';
Friends.contextTypes = {
  router: () => { return PropTypes.func.isRequired; },
};

Friends.propTypes = {
  friends: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

const mapStateToProps = (state) => {
  return {
    friends: state.profile.friends,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Friends));
