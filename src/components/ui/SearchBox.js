'use strict';

import React, {Component, PropTypes} from 'react';

import TextField from 'material-ui/TextField';

import {injectIntl, intlShape, defineMessages} from 'react-intl';

import 'styles/ui/SearchBox.css';

const messages = defineMessages({
  search: {id: 'ui.searchBox.search'},
});

class SearchBox extends Component {
  render() {
    const {formatMessage} = this.props.intl;

    return (
      <div className="SearchBox">
        <input className="SearchBox__input" placeholder={formatMessage(messages.search)} type="search"/>
      </div>
    );
  }
}

SearchBox.displayName = 'SearchBoxComponent';

SearchBox.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(SearchBox);
