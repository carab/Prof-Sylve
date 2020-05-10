import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { defineMessages, useIntl } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PokedexBox from 'components/Pokedex/Box/Box';
import PokemonSelector from 'components/Pokedex/PokemonSelector/PokemonSelector';
import { selectUi } from 'selectors/selectors';
import actions from 'actions';
import { AppbarPortal } from 'components/Ui/Appbar/AppbarPortal';
import PokedexBoxSwitcher from './PokedexBoxSwitcher';
import Flex from 'components/Flex/Flex';

import './Pc.css';

const messages = defineMessages({
  previousBox: { id: 'pokemon.pc.previousBox' },
  nextBox: { id: 'pokemon.pc.nextBox' },
  box: { id: 'pokemon.pc.box' },
});

export const BOX_COLS = 6;
export const BOX_ROWS = 5;
export const BOX_SIZE = BOX_COLS * BOX_ROWS;

function PokedexPc() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { currentBox, currentUsername, currentPokedex, selecting } = useSelector(selectUi);
  const params = useParams();
  const history = useHistory();
  const currentBoxFromParams = parseInt(params.currentBox);

  const handleSetBox = useCallback(
    (box) => {
      dispatch(actions.ui.setCurrentBox(box));
    },
    [dispatch],
  );

  useEffect(() => {
    if (currentBoxFromParams && currentBoxFromParams !== currentBox) {
      handleSetBox(currentBoxFromParams);
    }
  }, [currentBox, currentBoxFromParams, handleSetBox]);

  const pokemons = currentPokedex?.pokemons ?? [];
  const boxes = useMemo(() => {
    const count = Math.ceil(pokemons.length / BOX_SIZE);
    const boxes = [];

    for (let i = 0; i < count; i++) {
      boxes.push({
        value: i + 1,
        start: i * BOX_SIZE,
        end: (i + 1) * BOX_SIZE,
      });
    }

    return boxes;
  }, [pokemons]);

  const handleBoxChange = useCallback(
    (box) => {
      history.push(`/pokedex/${currentUsername}/pc/${box}`);
    },
    [currentUsername, history],
  );

  const handleBoxNavigate = useCallback(
    (count) => {
      const currentIndex = boxes.findIndex((b) => b.value === currentBox) ?? 0;
      let newIndex = currentIndex + count;

      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= boxes.length) {
        newIndex = boxes.length - 1;
      }

      const newBox = boxes[newIndex];
      handleBoxChange(newBox.value);
    },
    [boxes, currentBox, handleBoxChange],
  );

  const handleBoxPrevious = useCallback(() => {
    handleBoxNavigate(-1);
  }, [handleBoxNavigate]);

  const handleBoxNext = useCallback(() => {
    handleBoxNavigate(+1);
  }, [handleBoxNavigate]);

  const activeBox = boxes.find((b) => b.value === currentBox);

  useEffect(() => {
    function handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowLeft':
          handleBoxPrevious();
          break;
        case 'ArrowRight':
          handleBoxNext();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleBoxNext, handleBoxPrevious]);

  return (
    <div className="PokedexPc">
      {boxes.length ? (
        <AppbarPortal secondary={selecting}>
          <Flex>
            <PokemonSelector />
            <PokedexBoxSwitcher activeBox={activeBox} boxes={boxes} onBoxChange={handleBoxChange} />
          </Flex>
        </AppbarPortal>
      ) : null}
      <Paper elevation={1} className="PokedexPc__paper">
        <div className="PokedexPc__view">
          <div className="PokedexPc__previousBox">
            <IconButton
              onClick={handleBoxPrevious}
              aria-label={formatMessage(messages.previousBox)}
              title={formatMessage(messages.previousBox)}
            >
              <NavigateBeforeIcon />
            </IconButton>
          </div>
          <div className="PokedexPc__boxes">
            {activeBox ? <PokedexBox box={activeBox} /> : null}
          </div>
          <div className="PokedexPc__nextBox">
            <IconButton
              onClick={handleBoxNext}
              aria-label={formatMessage(messages.nextBox)}
              title={formatMessage(messages.nextBox)}
            >
              <NavigateNextIcon />
            </IconButton>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default PokedexPc;
