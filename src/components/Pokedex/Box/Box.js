'use strict';

import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import CircularProgress from 'material-ui/CircularProgress';

import PokemonTile from 'components/Pokemon/Tile/Tile';

import actions from 'actions';
import withWidth, {LG} from 'utils/with-width';

import './Box.css';

class Box extends React.Component {
  render() {
    const {pokemons, box, currentBox, width, onFiltered} = this.props;

    if (box.index === currentBox) {
      const touch = (width < LG);
      const filtered = _.map(pokemons.slice(box.start, box.end), 'id');

      onFiltered(filtered);

      return (
        <div className="PokedexBox">
          {_.map(filtered, (id) => (
            <PokemonTile key={id} id={id} touch={touch}/>
          ))}
        </div>
      );
    }

    return <div className="PokedexBox__loader"><CircularProgress size={40}/></div>;
  }
}

Box.displayName = 'PokedexBox';

const mapStateToProps = (state) => {
  const currentPokedex = state.ui.pokedexes.get(state.ui.currentUsername);

  return {
    pokemons: currentPokedex.pokemons,
    currentBox: state.ui.currentBox,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFiltered: (filtered) => {
      dispatch(actions.ui.setFiltered(filtered));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(Box));
