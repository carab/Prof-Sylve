'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import Helmet from 'react-helmet';

import Paper from 'material-ui/Paper';

import Loader from '../Utils/Loader';

import Actions from '../../actions';

import './Pokedex.css';

const messages = defineMessages({
  notVisible: {id: 'dashboard.notVisible'},
  myPokedex: {id: 'user.pokedex.mine'},
  pokedexOf: {id: 'user.pokedex.of'},
});

class Pokedex extends Component {
  render() {
    const {params, profile, pokedexes, loadPokedex, setCurrentUsername, intl} = this.props;
    const username = params.username;

    let title = intl.formatMessage(messages.myPokedex);

    if (username && username !== profile.username) {
      const pokedex = pokedexes.get(username);
      title = intl.formatMessage(messages.pokedexOf, { username });

      if (pokedex) {
        if (pokedex instanceof Error) {
          return (
            <div className="Pokedex container">
              <Paper zDepth={1}>
                <div className="Pokedex__error">{intl.formatMessage(messages.notVisible)}</div>
              </Paper>
            </div>
          );
        } else {
          setCurrentUsername(username);
        }
      } else {
        loadPokedex(username);
        return <Loader/>;
      }
    } else {
      setCurrentUsername(profile.username);
    }

    return (
      <div className="Pokedex">
        <Helmet title={title} meta={[
          { property: 'og:title', content: title }
        ]}/>
        {this.props.children}
      </div>
    );
  }
}

Pokedex.displayName = 'Pokedex';
Pokedex.contextTypes = {};
Pokedex.propTypes = {};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    pokedexes: state.ui.pokedexes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUsername: (username) => {
      dispatch(Actions.ui.setCurrentUsername(username));
    },
    loadPokedex: (username) => {
      dispatch(Actions.ui.loadPokedex(username));
    },
  };
}

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(Pokedex));
