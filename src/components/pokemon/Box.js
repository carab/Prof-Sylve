'use strict';

import React from 'react';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import _ from 'lodash';

import {GridList} from 'material-ui/GridList';
import CircularProgress from 'material-ui/CircularProgress';

import PokemonItem from 'components/pokemon/Item';

import 'styles/pokemon/Box.css';

class Box extends React.Component {
  render() {
    return (
      <div className="PokemonBox">
          <MediaQuery maxWidth={767}>
            {this.renderGrid('small', 100)}
          </MediaQuery>
          <MediaQuery minWidth={768} maxWidth={991}>
            {this.renderGrid('medium', 150)}
          </MediaQuery>
          <MediaQuery minWidth={992}>
            {this.renderGrid('large', 150)}
          </MediaQuery>
      </div>
    );
  }

  renderGrid(mode, cellHeight) {
    const {box, cols, currentBox} = this.props;

    if (box.index === currentBox) {
      return (
        <GridList
          cols={cols}
          cellHeight={cellHeight}
        >
          {_.map(box.ids, (id) => (
            <PokemonItem key={id} id={id} type="tile" mode={mode}/>
          ))}
        </GridList>
      );
    }

    return <div className="PokemonBox__loader"><CircularProgress size={1}/></div>;
  }
}

Box.displayName = 'PokemonBoxComponent';

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
