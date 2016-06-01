'use strict';

import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {GridList} from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';

import PokemonItem from 'components/pokemon/Item';

import 'styles/pokemon/Box.css';

class Box extends React.Component {
  render() {
    return (
      <div className="PokemonBox">
        {this.renderGrid()}
      </div>
    );
  }

  renderGrid() {
    const {box, cols, currentBox} = this.props;

    if (box.index === currentBox) {
      return (
        <GridList
          cols={cols}
          cellHeight={150}
        >
          {_.map(box.ids, (id) => (
            <PokemonItem key={id} id={id} type="tile"/>
          ))}
        </GridList>
      );
    }

    return <div className="PokemonBox__loader"><CircularProgress size={1}/></div>;
  }
}

Box.displayName = 'PokemonBoxComponent';

const mapStateToProps = (state, ownProps) => {
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
