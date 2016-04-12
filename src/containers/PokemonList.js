import { connect } from 'react-redux';
//import { toggleTodo } from '../actions';
import PokemonList from '../components/pokemon/ListComponent';

const mapStateToProps = (state) => {
  return {
    pokemons: state.pokemons.data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PokemonList);
