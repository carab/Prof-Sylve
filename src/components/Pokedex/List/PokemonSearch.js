import React from 'react';
import { fade, makeStyles, createStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) =>
  createStyles({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      flexGrow: 1,
      [theme.breakpoints.up('sm')]: {
        flexGrow: 0,
      },
    },
    searchIcon: {
      padding: '0.5em',
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: '0.5em 0.5em 0.5em 2.5em',
      // vertical padding + font size from searchIcon
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '13ch',
      },
    },
  }),
);

function PokemonSearch({ query, placeholder, onQueryChange }) {
  const classes = useStyles();

  function handleChange(event) {
    onQueryChange(event.target.value);
  }

  function handleCancel() {
    onQueryChange('');
  }

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton size="small" onClick={handleCancel} style={{ opacity: query ? 1 : 0 }}>
        <CancelIcon />
      </IconButton>
    </div>
  );
}

export default PokemonSearch;
