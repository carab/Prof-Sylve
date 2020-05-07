import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

function FilterMenuItem({
  text,
  color,
  checkedIcon: CheckedIcon = CheckBoxIcon,
  uncheckedIcon: UncheckedIcon = CheckBoxOutlineBlankIcon,
  selected,
  onChange
}) {
  return (
    <MenuItem selected={selected} onClick={onChange}>
      <ListItemIcon>
        {selected ? <CheckedIcon color="secondary" style={{ color }} /> : <UncheckedIcon style={{ color }} />}
      </ListItemIcon>
      <ListItemText primary={text} />
    </MenuItem>
  );
}

export default FilterMenuItem;
