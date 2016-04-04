'use strict';

import React from 'react';
import _ from 'lodash';

import FirebaseUtils from '../../utils/firebase-utils';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import IconButton from 'material-ui/lib/icon-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ImageNavigateBefore from 'material-ui/lib/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/lib/svg-icons/image/navigate-next';

require('styles/grid/Toolbar.css');

class ToolbarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collected: 0
    };

    let collectedRef = FirebaseUtils.getUserRef().child('collected');

    collectedRef.on('value', (snap) => {
      let collected = snap.val();

      this.setState({
        collected: _.size(collected)
      });
    });
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text={this.state.collected + '/' + this.props.pokemons.length}/>
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <IconButton tooltip="Previous Box" onClick={this.props.onPreviousBox}>
            <ImageNavigateBefore/>
          </IconButton>
          <DropDownMenu value={this.props.currentBox} onChange={this.props.onSelectBox}>
            {_.map(this.props.boxes, (box, i) => (
              <MenuItem value={i} primaryText={box.start + ' to ' + box.end} key={i}/>
            ))}
          </DropDownMenu>
          <IconButton tooltip="Next Box" onClick={this.props.onNextBox}>
            <ImageNavigateNext/>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

ToolbarComponent.displayName = 'GridToolbarComponent';

// Uncomment properties you need
// ToolbarComponent.propTypes = {};
// ToolbarComponent.defaultProps = {};

export default ToolbarComponent;
