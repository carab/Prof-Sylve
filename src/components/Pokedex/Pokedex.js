'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {injectIntl, defineMessages} from 'react-intl';
import Helmet from 'react-helmet';
import {Route} from 'react-router-dom';

import Paper from 'material-ui/Paper';

import Loader from 'components/Utils/Loader/Loader';
import PokedexDashboard from 'components/Pokedex/Dashboard/Dashboard';
import PokedexPc from 'components/Pokedex/Pc/Pc';
import PokedexList from 'components/Pokedex/List/List';

import Actions from 'actions';

import './Pokedex.css';

const messages = defineMessages({
  notVisible: {id: 'dashboard.notVisible'},
  myPokedex: {id: 'pokedex.mine'},
  pokedexOf: {id: 'pokedex.of'},
});

class Pokedex extends Component {
  render() {
    const {profile, pokedexes, intl, setCurrentUsername, loadPokedex} = this.props;
    const {username} = this.props.match.params;

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
          { property: 'og:title', content: title },
        ]}/>

        <Route exact path="/pokedex/:username" component={PokedexDashboard}/>
        <Route path="/pokedex/:username/pc/:currentBox?" component={PokedexPc}/>
        <Route path="/pokedex/:username/list/:splat(.*)?" component={PokedexList}/>
      </div>
    );
  }
}

Pokedex.displayName = 'Pokedex';
Pokedex.propTypes = {};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    pokedexes: state.ui.pokedexes,
    currentUsername: state.ui.currentUsername,
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
