'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import IconButton from 'material-ui/lib/icon-button';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ImageNavigateBefore from 'material-ui/lib/svg-icons/image/navigate-before';
import ImageNavigateNext from 'material-ui/lib/svg-icons/image/navigate-next';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import FirebaseUtils from '../../utils/firebase-utils';

const messages = defineMessages({
  counter: {
    id: 'grid.toolbar.counter',
    defaultMessage: '{collected} on {total}'
  },
  box: {
    id: 'grid.toolbar.box',
    defaultMessage: '{start} to {end}'
  },
  previousBox: {
    id: 'grid.toolbar.previousBox',
    defaultMessage: 'Previous Box'
  },
  nextBox: {
    id: 'grid.toolbar.nextBox',
    defaultMessage: 'Next Box'
  }
});

require('styles/grid/Toolbar.css');

class ToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { collected: 0 };

    this.collectedRef = FirebaseUtils.getUserRef().child('collected');
    this.tagsRef = FirebaseUtils.getUserRef().child('tags');
  }

  componentDidMount() {
    this.onCollectedChange = this.collectedRef.on('value', (snap) => {
      let collected = Object.keys(snap.val()).length;

      this.setState({ collected });
    });

    this.onTagsChange = this.tagsRef.on('value', (snap) => {
      let tags = snap.val();
    });
  }

  componentWillUnmount() {
    this.collectedRef.off('value', this.onCollectedChange);
      this.tagsRef.off('value', this.onTagsChange);
  }

  render() {
    const {formatMessage} = this.props.intl;
    const {collected} = this.state;
    const {total} = this.props;

    return (
      <Toolbar>
        <ToolbarGroup float="left">
          <ToolbarTitle text={formatMessage(messages.counter, { collected, total })}/>
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <IconButton tooltip={formatMessage(messages.previousBox)} onClick={this.props.onPreviousBox}>
            <ImageNavigateBefore/>
          </IconButton>
          <DropDownMenu value={this.props.currentBox} onChange={this.props.onSelectBox}>
            {_.map(this.props.boxes, (box, i) => (
              <MenuItem value={i} primaryText={formatMessage(messages.box, { start: box.start, end: box.end })} key={i}/>
            ))}
          </DropDownMenu>
          <IconButton tooltip={formatMessage(messages.nextBox)} onClick={this.props.onNextBox}>
            <ImageNavigateNext/>
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

ToolbarComponent.displayName = 'GridToolbarComponent';

ToolbarComponent.propTypes = {
    total: PropTypes.number.isRequired,
    boxes: PropTypes.any.isRequired,
    currentBox: PropTypes.number.isRequired,
    onPreviousBox: PropTypes.func.isRequired,
    onSelectBox: PropTypes.func.isRequired,
    onNextBox: PropTypes.func.isRequired,
    intl: intlShape.isRequired
};

export default injectIntl(ToolbarComponent);
