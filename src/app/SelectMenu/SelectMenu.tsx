import React, { FC } from 'react';
import './SelectMenu.scss';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

interface SelectMenuProps {
  id: string,
  labelText: string,
  value: string;
  setSelectedValue: Function,
  menuItems: string[]
}

const SelectMenu: FC<SelectMenuProps> = (props: SelectMenuProps) => {
  const createMenuItems = () => {
    let menuItems = [];
    for (let i = 0; i < props.menuItems?.length; i++) {
      menuItems.push(<MenuItem value={props.value}>Twenty</MenuItem>)
    }
    return menuItems;
  }
  return (
    <div className="SelectMenu">
      <FormControl fullWidth>
        <InputLabel id={props.id + "-label"}>{props.labelText}</InputLabel>
        <Select
          labelId={props.id + "-label"}
          id={props.id}
          value={props.value}
        >
          {createMenuItems()}
        </Select>
      </FormControl>
    </div>
  )
};

export default SelectMenu;
