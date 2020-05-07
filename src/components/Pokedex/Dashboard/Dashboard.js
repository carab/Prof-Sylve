import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import ShareIcon from '@material-ui/icons/Share';
import PublicIcon from '@material-ui/icons/Public';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Link from 'components/utils/Link';
import Colors from 'data/colors';
import Regions from 'data/regions';
import PokemonProgress, { calculateProgress } from './Progress';
import {
  selectProfile,
  selectCurrentPokedex,
  selectCurrentUsername,
  selectAuth,
  selectCurrentBox,
} from 'selectors/selectors';

import './Dashboard.css';

const messages = defineMessages({
  menu: { id: 'pokemon.menu' },
  pokedexOf: { id: 'pokedex.of' },
  progress: { id: 'dashboard.progress' },
  shareMessage: { id: 'dashboard.share.message' },
  byRegion: { id: 'dashboard.byRegion' },
  openPc: { id: 'dashboard.openPc' },
  openList: { id: 'dashboard.openList' },
  byTag: { id: 'dashboard.byTag' },

  kanto: { id: 'pokemon.region.kanto' },
  johto: { id: 'pokemon.region.johto' },
  hoenn: { id: 'pokemon.region.hoenn' },
  sinnoh: { id: 'pokemon.region.sinnoh' },
  ulys: { id: 'pokemon.region.ulys' },
  kalos: { id: 'pokemon.region.kalos' },
  alola: { id: 'pokemon.region.alola' },
  galar: { id: 'pokemon.region.galar' },

  none: { id: 'pokemon.tag.none' },
  red: { id: 'pokemon.tag.color.red' },
  yellow: { id: 'pokemon.tag.color.yellow' },
  green: { id: 'pokemon.tag.color.green' },
  cyan: { id: 'pokemon.tag.color.cyan' },
  pink: { id: 'pokemon.tag.color.pink' },
  orange: { id: 'pokemon.tag.color.orange' },
  purple: { id: 'pokemon.tag.color.purple' },
  indigo: { id: 'pokemon.tag.color.indigo' },
  teal: { id: 'pokemon.tag.color.teal' },
  lime: { id: 'pokemon.tag.color.lime' },
  brown: { id: 'pokemon.tag.color.brown' },
});

function TwitterIcon(props) {
  return (
    <SvgIcon viewBox="0 0 410.155 410.155" {...props}>
      <path d="M403.632,74.18c-9.113,4.041-18.573,7.229-28.28,9.537c10.696-10.164,18.738-22.877,23.275-37.067  l0,0c1.295-4.051-3.105-7.554-6.763-5.385l0,0c-13.504,8.01-28.05,14.019-43.235,17.862c-0.881,0.223-1.79,0.336-2.702,0.336  c-2.766,0-5.455-1.027-7.57-2.891c-16.156-14.239-36.935-22.081-58.508-22.081c-9.335,0-18.76,1.455-28.014,4.325  c-28.672,8.893-50.795,32.544-57.736,61.724c-2.604,10.945-3.309,21.9-2.097,32.56c0.139,1.225-0.44,2.08-0.797,2.481  c-0.627,0.703-1.516,1.106-2.439,1.106c-0.103,0-0.209-0.005-0.314-0.015c-62.762-5.831-119.358-36.068-159.363-85.14l0,0  c-2.04-2.503-5.952-2.196-7.578,0.593l0,0C13.677,65.565,9.537,80.937,9.537,96.579c0,23.972,9.631,46.563,26.36,63.032  c-7.035-1.668-13.844-4.295-20.169-7.808l0,0c-3.06-1.7-6.825,0.485-6.868,3.985l0,0c-0.438,35.612,20.412,67.3,51.646,81.569  c-0.629,0.015-1.258,0.022-1.888,0.022c-4.951,0-9.964-0.478-14.898-1.421l0,0c-3.446-0.658-6.341,2.611-5.271,5.952l0,0  c10.138,31.651,37.39,54.981,70.002,60.278c-27.066,18.169-58.585,27.753-91.39,27.753l-10.227-0.006  c-3.151,0-5.816,2.054-6.619,5.106c-0.791,3.006,0.666,6.177,3.353,7.74c36.966,21.513,79.131,32.883,121.955,32.883  c37.485,0,72.549-7.439,104.219-22.109c29.033-13.449,54.689-32.674,76.255-57.141c20.09-22.792,35.8-49.103,46.692-78.201  c10.383-27.737,15.871-57.333,15.871-85.589v-1.346c-0.001-4.537,2.051-8.806,5.631-11.712c13.585-11.03,25.415-24.014,35.16-38.591  l0,0C411.924,77.126,407.866,72.302,403.632,74.18L403.632,74.18z" />
    </SvgIcon>
  );
}

function FacebookIcon(props) {
  return (
    <SvgIcon viewBox="0 0 408.788 408.788" {...props}>
      <path d="M353.701,0H55.087C24.665,0,0.002,24.662,0.002,55.085v298.616c0,30.423,24.662,55.085,55.085,55.085  h147.275l0.251-146.078h-37.951c-4.932,0-8.935-3.988-8.954-8.92l-0.182-47.087c-0.019-4.959,3.996-8.989,8.955-8.989h37.882  v-45.498c0-52.8,32.247-81.55,79.348-81.55h38.65c4.945,0,8.955,4.009,8.955,8.955v39.704c0,4.944-4.007,8.952-8.95,8.955  l-23.719,0.011c-25.615,0-30.575,12.172-30.575,30.035v39.389h56.285c5.363,0,9.524,4.683,8.892,10.009l-5.581,47.087  c-0.534,4.506-4.355,7.901-8.892,7.901h-50.453l-0.251,146.078h87.631c30.422,0,55.084-24.662,55.084-55.084V55.085  C408.786,24.662,384.124,0,353.701,0z" />
    </SvgIcon>
  );
}

function Dashboard() {
  const auth = useSelector(selectAuth);
  const profile = useSelector(selectProfile);
  const currentPokedex = useSelector(selectCurrentPokedex);
  const currentUsername = useSelector(selectCurrentUsername);
  const currentBox = useSelector(selectCurrentBox);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { formatMessage } = useIntl();

  const shared = currentUsername !== profile.username;
  const path = `/pokedex/${currentUsername}`;

  // Build absolute URL
  const a = document.createElement('a');
  a.href = path;
  const url = a.href;

  let addFriendButton;
  if (shared && auth.signed) {
    //addFriendButton = <IconButton><PersonAddIcon/></IconButton>;
  }

  const handleClick = (event) => {
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pokemonsByTag = useMemo(() => {
    const pokemons = (currentPokedex?.pokemons ?? []).filter((pokemon) => Boolean(pokemon.tag));

    const pokemonsByTag = groupBy(pokemons, 'tag');

    return Object.entries(pokemonsByTag);
  }, [currentPokedex]);

  if (!currentPokedex) {
    return null;
  }

  let shareMenu;
  if (currentPokedex.settings?.public) {
    const { progress } = calculateProgress(currentPokedex.pokemons);
    const message = formatMessage(messages.shareMessage, { progress });
    const encodedUrl = encodeURIComponent(url);
    const twitterUrl = `https://twitter.com/intent/tweet?source=${encodedUrl}&text=${encodeURIComponent(
      message,
    )}%20${encodedUrl}`;

    const handleFacebookShare = () => {
      window.FB.ui({
        method: 'feed',
        link: url,
        name: message,
        //picture: attr.picture,
        //caption: attr.caption,
        description: formatMessage(messages.pokedexOf, { username: currentUsername }),
      });
    };

    shareMenu = (
      <>
        <IconButton
          edge="end"
          aria-controls="dashboard-menu"
          aria-haspopup="true"
          aria-label={formatMessage(messages.menu)}
          onClick={handleClick}
        >
          <ShareIcon />
        </IconButton>
        <Menu
          id="dashboard-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleFacebookShare}>
            <ListItemIcon>
              <FacebookIcon />
            </ListItemIcon>
            <ListItemText primary="Facebook" />
          </MenuItem>
          <MenuItem component={Link} to={twitterUrl}>
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText primary="Twitter" />
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <div className="Progress container" style={{ paddingTop: '1em' }}>
      <Paper elevation={1} className="Progress__card">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {formatMessage(messages.progress)}
          </Typography>
          {addFriendButton}
          {shareMenu}
        </Toolbar>
        <div className="Progress_content">
          <PokemonProgress pokemons={currentPokedex.pokemons ?? []} main />
        </div>
        <div className="Progress__actions">
          <Button color="secondary" component={Link} to={`${path}/pc/${currentBox}`}>
            {formatMessage(messages.openPc)}
          </Button>
          <Button color="secondary" component={Link} to={`${path}/list`}>
            {formatMessage(messages.openList)}
          </Button>
        </div>
      </Paper>
      <div className="row">
        <div className="col-sm-6">
          <Paper elevation={1} className="Progress__card">
            <List>
              <ListSubheader>{formatMessage(messages.byRegion)}</ListSubheader>
              {Regions.map((region) => (
                <ListItem
                  key={region.name}
                  button
                  component={Link}
                  to={`${path}/list/region=${region.name}`}
                >
                  <ListItemIcon>
                    <PublicIcon style={{ color: region.color }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={formatMessage(messages[region.name])}
                    secondary={
                      <PokemonProgress
                        pokemons={currentPokedex.pokemons?.slice(region.from - 1, region.to) ?? []}
                        color={region.color}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
        <div className="col-sm-6">
          <Paper elevation={1} className="Progress__card">
            <List>
              <ListSubheader>{formatMessage(messages.byTag)}</ListSubheader>
              {pokemonsByTag.length ? (
                pokemonsByTag.map(([tag, pokemons]) => (
                  <ListItem key={tag} button component={Link} to={`${path}/list/tag=${tag}`}>
                    <ListItemIcon>
                      <BookmarkIcon style={{ color: Colors.tags[tag] }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={currentPokedex.settings?.tags?.[tag] ?? formatMessage(messages[tag])}
                      secondary={<PokemonProgress pokemons={pokemons} color={Colors.tags[tag]} />}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary={formatMessage(messages.none)} />
                </ListItem>
              )}
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
