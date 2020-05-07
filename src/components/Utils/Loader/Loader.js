import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './Loader.css';

function Loader() {
  return (
    <div className="Loader">
      <CircularProgress size={80}/>
    </div>
  )
}

export default Loader;
