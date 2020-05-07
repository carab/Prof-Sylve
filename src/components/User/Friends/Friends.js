import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import './Friends.css';

const messages = defineMessages({
  none: { id: 'user.friends.none' },
  friends: { id: 'user.friends.friends' },
});

class Friends extends Component {
  render() {
    const { friends, intl } = this.props;

    return (
      <div className="UserFriends container">
        <Paper elevation={1}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {intl.formatMessage(messages.friends, { friends: friends.length })}
            </Typography>
            <IconButton>
              <PersonAddIcon />
            </IconButton>
          </Toolbar>
          {this.renderFriends()}
        </Paper>
      </div>
    );
  }

  renderFriends() {
    const { friends, intl } = this.props;

    if (friends.length) {
      return (
        <List>
          {friends.map((friend, index) => (
            <ListItem key={index}>{friend}</ListItem>
          ))}
        </List>
      );
    }

    return <p className="UserFriends__none">{intl.formatMessage(messages.none)}</p>;
  }
}

Friends.displayName = 'UserFriends';
Friends.contextTypes = {
  router: () => {
    return PropTypes.func.isRequired;
  },
};

Friends.propTypes = {
  friends: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    friends: state.profile.friends,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Friends));
