
import React from 'react';
import Firebase from 'firebase/lib/firebase-web';

import AppBar from 'material-ui/lib/app-bar';

import PcComponent from 'components/grid/PcComponent';

require('normalize.css/normalize.css');
require('styles/App.css');

const firebaseUrl = 'https://prof-sylve.firebaseio.com';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemons: {}
    };

    let pokemonsRef = new Firebase(firebaseUrl + '/pokemons');

    pokemonsRef.once('value', (snap) => {
      this.state.pokemons = snap.val();
      this.setState(this.state);
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Prof. Sylve's Living Dex"
        />
        <PcComponent pokemons={this.state.pokemons}/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
