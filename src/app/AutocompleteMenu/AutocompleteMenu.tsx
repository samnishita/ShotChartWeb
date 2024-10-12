import React, { FC, useState } from 'react';
import './AutocompleteMenu.scss';
import { Autocomplete, TextField } from '@mui/material';
import { AutocompleteMenuItem } from '../model/AutocompleteMenuItem';

interface AutocompleteMenuProps {
  id: string,
  value: AutocompleteMenuItem | null
  labelText: string,
  setSelectedValue: Function,
  menuItems: AutocompleteMenuItem[] | null;
}

const AutocompleteMenu: FC<AutocompleteMenuProps> = (props: AutocompleteMenuProps) => {
  const handleChange = (event: React.SyntheticEvent, value: AutocompleteMenuItem | null) => {
    props.setSelectedValue(value);
  };
  return (
    <div className="AutocompleteMenu">
      <Autocomplete
        disablePortal
        value={props.value}
        options={props.menuItems == null ? [] : props.menuItems}
        renderInput={(params) => <TextField {...params} label={props.labelText} />}
        onChange={handleChange}
      />
    </div>)
};

export default AutocompleteMenu;
