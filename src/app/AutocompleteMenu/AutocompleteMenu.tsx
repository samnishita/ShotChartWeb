import React, { FC } from 'react';
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

  return (
    <div className="AutocompleteMenu">
      <Autocomplete
        disablePortal
        options={props.menuItems}
        renderInput={(params) => <TextField {...params} label={props.labelText} />}
      />
    </div>)
};

export default AutocompleteMenu;
