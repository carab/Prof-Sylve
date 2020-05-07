import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

const CustomLinearProgress = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey['200'],
  },
  bar: {
    backgroundColor: `var(--var-progressBar-color, ${theme.palette.primary.main})`,
  },
}))(LinearProgress);

export function calculateProgress(pokemons) {
  const collected = pokemons.filter((p) => p.collected).length;
  const progress = Math.ceil(((10 * collected) / pokemons.length) * 100) / 10;

  return { collected, progress };
}

function PokemonProgress({ pokemons, main, color }) {
  const { collected, progress } = calculateProgress(pokemons);

  return (
    <div className={'ProgressBar ' + (main ? 'ProgressBar--main' : '')}>
      <div className="ProgressBar__legend">
        <div className="ProgressBar__percent">{progress}%</div>
        <div className="ProgressBar__real">
          {collected}/{pokemons.length}
        </div>
      </div>
      <CustomLinearProgress
        className="ProgressBar__bar"
        variant="determinate"
        value={progress}
        style={{ '--var-progressBar-color': color, height: main ? '2rem' : '0.5rem' }}
      />
    </div>
  );
}

export default PokemonProgress;
