import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import { Helmet } from 'react-helmet-async';
import { Route, useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Loader from 'components/utils/Loader/Loader';
import PokedexDashboard from 'components/Pokedex/Dashboard/Dashboard';
import PokedexPc from 'components/Pokedex/Pc/Pc';
import PokedexList from 'components/Pokedex/List/List';
import actions from 'actions';
import { PokemonMenuContextProvider } from 'components/Pokemon/Menu/PokemonMenuContextProvider';
import PokemonMenu from 'components/Pokemon/Menu/PokemonMenu';
import { selectProfile } from 'selectors/selectors';
import useFirebasePokedex from 'hooks/useFirebasePokedex';
import useFirebaseUid from 'hooks/useFirebaseUid';

import './Pokedex.css';

const messages = defineMessages({
  notVisible: { id: 'dashboard.notVisible' },
  myPokedex: { id: 'pokedex.mine' },
  pokedexOf: { id: 'pokedex.of' },
});

function Pokedex() {
  const { formatMessage } = useIntl();
  const { username } = useParams();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const [uid, uidError] = useFirebaseUid(username);
  const [pokedex, pokedexError] = useFirebasePokedex(uid);

  useEffect(() => {
    dispatch(actions.ui.setCurrentUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    dispatch(actions.ui.setCurrentPokedex(pokedex));
  }, [dispatch, pokedex, username]);

  if (uidError || pokedexError) {
    return (
      <div className="Pokedex container">
        <Paper elevation={1}>
          <div className="Pokedex__error">{formatMessage(messages.notVisible)}</div>
        </Paper>
      </div>
    );
  }

  if (!pokedex) {
    return <Loader />;
  }

  const title =
    profile?.username && profile.username === username
      ? formatMessage(messages.myPokedex)
      : formatMessage(messages.pokedexOf, { username });

  return (
    <div className="Pokedex">
      <Helmet title={title} meta={[{ property: 'og:title', content: title }]} />
      <PokemonMenuContextProvider>
        <Route exact path="/pokedex/:username" component={PokedexDashboard} />
        <Route path="/pokedex/:username/pc/:currentBox?" component={PokedexPc} />
        <Route path="/pokedex/:username/list/:splat(.*)?" component={PokedexList} />
        <PokemonMenu />
      </PokemonMenuContextProvider>
    </div>
  );
}

export default Pokedex;
