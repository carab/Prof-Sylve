import React, { memo, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useAutoId from 'hooks/useAutoId';

const messages = defineMessages({
  selectBox: { id: 'pokemon.pc.selectBox' },
  box: { id: 'pokemon.pc.box' },
});

function PokedexBoxSwitcher({ activeBox, boxes, onBoxChange }) {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);
  const idBoxSwitcher = useAutoId();

  function handleBoxMenuClose() {
    setAnchorEl(undefined);
  }

  function handleBoxMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleBoxChange(box) {
    handleBoxMenuClose();
    onBoxChange(box);
  }

  return (
    <>
      <Button
        color="inherit"
        aria-controls={idBoxSwitcher}
        aria-haspopup="true"
        onClick={handleBoxMenuOpen}
        endIcon={<ExpandMoreIcon />}
        style={{ textTransform: 'none' }}
      >
        {activeBox
          ? formatMessage(messages.box, {
              name: activeBox.value,
              start: activeBox.start + 1,
              end: activeBox.end,
            })
          : formatMessage(messages.selectBox)}
      </Button>
      <Menu
        id={idBoxSwitcher}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleBoxMenuClose}
      >
        {boxes.map((box) => (
          <MenuItem
            key={box.value}
            selected={activeBox && activeBox.value === box.value}
            onClick={() => handleBoxChange(box.value)}
          >
            {formatMessage(messages.box, {
              name: box.value,
              start: box.start + 1,
              end: box.end,
            })}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default memo(PokedexBoxSwitcher);
