import React, { FC, useState } from 'react';
import './AutocompleteMenu.scss';
import { Autocomplete, TextField } from '@mui/material';
import { AutocompleteMenuItem } from '../model/AutocompleteMenuItem';

interface AutocompleteMenuProps {
  id: string,
  labelText: string,
  setSelectedValue: Function,
  menuItems: AutocompleteMenuItem[];
}

const AutocompleteMenu: FC<AutocompleteMenuProps> = (props: AutocompleteMenuProps) => {
  const handleChange = (event: React.SyntheticEvent, value: AutocompleteMenuItem | null) => {
    props.setSelectedValue(event.target);
  };
  return (
    <div className="AutocompleteMenu">
      <Autocomplete
        disablePortal
        options={props.menuItems}
        renderInput={(params) => <TextField {...params} label={props.labelText} />}
        onChange={handleChange}
      />
    </div>)
};

export default AutocompleteMenu;
