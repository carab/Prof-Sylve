require('normalize.css/normalize.css');
require('styles/App.css');

import Firebase from 'firebase/lib/firebase-web';
import _ from 'lodash';

import React from 'react';

import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import GridList from 'material-ui/lib/grid-list/grid-list';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

import TileComponent from 'components/pokemon/grid/TileComponent';

const firebaseUrl = 'https://prof-sylve.firebaseio.com';

const BOX_COLS = 6;
const BOX_ROWS = 5;
const BOX_SIZE = BOX_COLS * BOX_ROWS;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pokemons: {},
      collected: {}
    };

    let pokemonsRef = new Firebase(firebaseUrl + '/pokemons');
    let collectedRef = new Firebase(firebaseUrl + '/carab/collected');

    pokemonsRef.on('child_added', (snap) => {
      this.state.pokemons[snap.key()] = snap.val();
      this.setState(this.state);
    });

    pokemonsRef.on('child_changed', (snap) => {
      this.state.pokemons[snap.key()] = snap.val();
      this.setState(this.state);
    });

    pokemonsRef.on('child_removed', (snap) => {
      delete this.state.pokemons[snap.key()];
      this.setState(this.state);
    });

    collectedRef.on('child_added', (snap) => {
      this.state.collected[snap.key()] = snap.val();
      this.setState(this.state);
    });

    collectedRef.on('child_changed', (snap) => {
      this.state.collected[snap.key()] = snap.val();
      this.setState(this.state);
    });

    collectedRef.on('child_removed', (snap) => {
      delete this.state.collected[snap.key()];
      this.setState(this.state);
    });
  }

  render() {
    return (
      <div>
        <AppBar
          title="Prof. Sylve's Living Dex"
        />
        {_.times(this.getBoxesCount(), box =>
          <div key={box}>
            <Toolbar>
              <ToolbarGroup float="left">
                <ToolbarTitle text={this.getBoxStart(box) + ' to ' + this.getBoxEnd(box)} />
              </ToolbarGroup>
            </Toolbar>
            <GridList
              cols={BOX_COLS}
            >
              {_.map(_.pick(this.state.pokemons, (pokemon, id) => this.isInBox(id, box)), (pokemon, id) => (
                <TileComponent
                  key={id}
                  id={id}
                  pokemon={pokemon}
                  collected={this.isCollected(id)}/>
              ))}
            </GridList>
          </div>
        )}
      </div>
    );
  }

  isCollected(id) {
    return (this.state.collected.hasOwnProperty(id) && this.state.collected[id]);
  }

  getBoxesCount() {
    return Math.ceil(_.size(this.state.pokemons)/BOX_SIZE);
  }

  getBoxStart(box) {
    let start = (box * BOX_SIZE) + 1;
    return start;
  }

  getBoxEnd(box) {
    let end = (box + 1) * BOX_SIZE;
    let pokemonCount = _.size(this.state.pokemons);

    if (end > pokemonCount) {
      end = pokemonCount;
    }

    return end;
  }

  isInBox(id, box) {
    return (id >= this.getBoxStart(box) && id <= this.getBoxEnd(box));
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
