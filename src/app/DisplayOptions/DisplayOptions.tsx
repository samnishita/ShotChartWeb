import React, { FC } from 'react';
import './DisplayOptions.scss';
import { ButtonGroup, Button, ThemeProvider } from '@mui/material';
import { appTheme } from '../styles/app-theme';
import { CLASSIC_DISPLAY, DisplayOption, GRID_DISPLAY, HEAT_DISPLAY, HEX_DISPLAY } from '../model/DisplayOption';

interface DisplayOptionsProps {
  currentDisplayOption: DisplayOption;
  setCurrentDisplayOption: Function
}

const DisplayOptions: FC<DisplayOptionsProps> = (props) => {
  const handleDisplayOptionChange = (newDisplayOption: DisplayOption) => {
    props.setCurrentDisplayOption(newDisplayOption);
  }
  return (
    <div className="DisplayOptions">
      <ThemeProvider theme={appTheme}>
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button className={props.currentDisplayOption == CLASSIC_DISPLAY ? "active-button" : "inactive-button"}
          variant={props.currentDisplayOption == CLASSIC_DISPLAY ? "contained" : "outlined"} onClick={() => handleDisplayOptionChange(CLASSIC_DISPLAY)}>Classic</Button>
          <Button className={props.currentDisplayOption == GRID_DISPLAY ? "active-button" : "inactive-button"}
          variant={props.currentDisplayOption == GRID_DISPLAY ? "contained" : "outlined"} onClick={() => handleDisplayOptionChange(GRID_DISPLAY)}>Grid</Button>
          <Button className={props.currentDisplayOption == HEX_DISPLAY ? "active-button" : "inactive-button"}
          variant={props.currentDisplayOption == HEX_DISPLAY ? "contained" : "outlined"} onClick={() => handleDisplayOptionChange(HEX_DISPLAY)}>Hex</Button>
          <Button className={props.currentDisplayOption == HEAT_DISPLAY ? "active-button" : "inactive-button"}
          variant={props.currentDisplayOption == HEAT_DISPLAY ? "contained" : "outlined"} onClick={() => handleDisplayOptionChange(HEAT_DISPLAY)}>Heat</Button>
        </ButtonGroup>
      </ThemeProvider>
    </div>
  )
};

export default DisplayOptions;
