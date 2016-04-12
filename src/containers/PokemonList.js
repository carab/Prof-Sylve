import { connect } from 'react-redux';

import PokemonList from '../components/pokemon/List';

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokemons.data,
    collected: state.user.data.collected,
    tags: state.user.data.tags
  };
};

const mapDispatchToProps = () => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonList);
