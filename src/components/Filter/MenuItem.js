'use strict';

import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import actions from '../../actions';

class FilterMenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {text, color, filters} = this.props;
    const hash = '';
    const style = {};
    const iconStyle = {};

    let toggle = false;

    /*/filters.forEach((filter) => {
      if (filter.hash === hash) {
        toggle = true;
      }
    });/*/

    if (color) {
      style.color = color;

      if (toggle) {
        iconStyle.fill = color;
      }
    }

    return (
      <MenuItem primaryText={text}
        leftIcon={<Checkbox checked={this.isFilterActive()} iconStyle={iconStyle}/>}
        style={style}
        containerElement={<Link to={this.getUrl()} />}
      />
    );
  }

  isFilterActive() {
    const {name, value, filters} = this.props;
    const filter = filters.get(name);

    return (true && filter && filter.value === value);
  }

  getUrl() {
    const {name, value, filters} = this.props;
    const splat = {};

    filters.forEach((filter) => {
      splat[filter.name] = filter.value;
    });

    if (this.isFilterActive()) {
      delete splat[name];
    } else {
      splat[name] = value;
    }

    return _.reduce(splat, function(path, value, name) {
      return path + '/' + name + '=' + value;
    }, '/pokedex');
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
