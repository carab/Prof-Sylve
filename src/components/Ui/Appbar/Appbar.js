import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import BaseAppbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import useAppbarContext from './useAppbarContext';
import { selectUi } from 'selectors/selectors';

const messages = defineMessages({
  menu: { id: 'nav.menu' },
  signout: { id: 'user.signout' },
});

function Appbar({ signed, showTitle, onToggleNav, ...props }) {
  const { formatMessage } = useIntl();
  const appbarRef = useRef();
  const { title } = useSelector(selectUi);
  const { secondary, setAppbarEl } = useAppbarContext();

  useEffect(() => {
    setAppbarEl(appbarRef.current);
  }, [setAppbarEl]);

  return (
    <BaseAppbar position="fixed" color={secondary ? 'secondary' : undefined} {...props}>
      <Toolbar>
        {showTitle ? (
          <Typography variant="h6" style={{ marginRight: '1em' }}>
            {title}
          </Typography>
        ) : (
          <IconButton
            edge="start"
            color="inherit"
            aria-label={formatMessage(messages.menu)}
            onClick={onToggleNav}
          >
            <MenuIcon />
          </IconButton>
        )}
        <div ref={appbarRef} style={{ flexGrow: 1 }}></div>
      </Toolbar>
    </BaseAppbar>
  );
}

export default Appbar;
