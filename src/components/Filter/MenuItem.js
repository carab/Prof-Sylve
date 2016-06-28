'use strict';

import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import actions from '../../actions';

class FilterMenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {text, color, filters} = this.props;
    const hash = this.getHash();
    const style = {};
    const iconStyle = {};

    let toggle = false;

    filters.forEach((filter) => {
      if (filter.hash === hash) {
        toggle = true;
      }
    });

    if (color) {
      style.color = color;

      if (toggle) {
        iconStyle.fill = color;
      }
    }

    return (
      <MenuItem primaryText={text}
        leftIcon={<Checkbox checked={toggle} iconStyle={iconStyle}/>}
        style={style}
        onTouchTap={this.handleFilterToggle}
      />
    );
  }

  handleFilterToggle = () => {
    const {name, options} = this.props;
    const hash = this.getHash();

    this.props.onFilterToggle({ name, options, hash });
  }

  getHash() {
    const {name, options} = this.props;
    const hash = name + '-' + _.values(options).join('-');

    return hash;
  }
}

FilterMenuItem.displayName = 'FilterMenuItem';
FilterMenuItem.propTypes = {};

const mapStateToProps = (state) => {
  return {
    filters: state.ui.filters,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFilterToggle: (filter) => {
      dispatch(actions.ui.toggleFilter(filter));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterMenuItem);
