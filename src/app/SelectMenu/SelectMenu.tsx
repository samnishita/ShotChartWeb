import React, { FC } from 'react';
import './SelectMenu.scss';
import { InputLabel, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { SelectMenuItem } from '../model/SelectMenuItem';

interface SelectMenuProps {
  id: string,
  labelText: string,
  value: SelectMenuItem | null,
  setSelectedValue: Function,
  menuItems: SelectMenuItem[]
}

const SelectMenu: FC<SelectMenuProps> = (props: SelectMenuProps) => {
  const createMenuItems = () => {
    let menuItems = [];
    for (let i = 0; i < props.menuItems?.length; i++) {
      let eachMenuItem: SelectMenuItem = props.menuItems[i];
      menuItems.push(<MenuItem key={eachMenuItem.id} value={eachMenuItem.value}>{eachMenuItem.label}</MenuItem>)
    }
    return menuItems;
  }
  const handleChange = (event: SelectChangeEvent) => {
    props.setSelectedValue(event.target);
  };
  return (
    <div className="SelectMenu">
      <FormControl fullWidth>
        <InputLabel id={props.id + "-label"}>{props.labelText}</InputLabel>
        <Select
          labelId={props.id + "-label"}
          id={props.id}
          value={props.value?.value}
          label={props.labelText}
          onChange={handleChange}
        >
          {createMenuItems()}
        </Select>
      </FormControl>
    </div>
  )
};

export default SelectMenu;
