'use strict';

import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import CircularProgress from 'material-ui/CircularProgress';

import PokemonTile from 'components/Pokemon/Tile/Tile';

import './Box.css';

class Box extends React.Component {
  render() {
    const {box, currentBox} = this.props;

    if (box.index === currentBox) {
      return (
        <div className="PokedexBox">
          {_.map(box.ids, (id) => (
            <PokemonTile key={id} id={id}/>
          ))}
        </div>
      );
    }

    return <div className="PokedexBox__loader"><CircularProgress size={1}/></div>;
  }
}

Box.displayName = 'PokedexBox';

const mapStateToProps = (state) => {
  return {
    currentBox: state.ui.currentBox,
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Box);
