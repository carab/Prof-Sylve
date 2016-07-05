'use strict';

import React, {Component} from 'react';
import {connect} from 'react-redux';

import Actions from '../../actions/pokedex';
import Loader from '../Utils/Loader';

class Pokedex extends Component {
  render() {
    const {params, profile, pokedexes, loadPokedex, setCurrentPokedex} = this.props;
    const username = params.username;

    if (username !== profile.username) {
      const pokedex = pokedexes.get(username);
      if (!pokedex) {
        loadPokedex(username);
      } else if (pokedex.ready) {
        setCurrentPokedex(username);
      } else {
        return <Loader/>;
      }
    } else {
      setCurrentPokedex(profile.username);
    }


    return this.props.children;
  }
}

Pokedex.displayName = 'Pokedex';
Pokedex.contextTypes = {};
Pokedex.propTypes = {};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    pokedex: state.ui.pokedexes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (username) => {
      dispatch(Actions.listen(username));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pokedex);
