import React, { FC, useState } from 'react';
import './CourtDisplay.scss';
import transparentCourt from '../../images/transparent.png';
import { CLASSIC_DISPLAY, DisplayOption } from '../model/DisplayOption';
import DisplayOptions from '../DisplayOptions/DisplayOptions';

interface CourtDisplayProps { }

const CourtDisplay: FC<CourtDisplayProps> = () => {
  const [currentDisplayOption, setCurrentDisplayOption] = useState<DisplayOption>(CLASSIC_DISPLAY);
  return (
    <div className="CourtDisplay">
      <div id='court-title-container'>
        {/* <h3>The Search Title Goes Here </h3> */}
        <h3>The Search Title Goes Here BUT IT'S EXTRA EXTRA LONG</h3>
      </div>
      <div className='court-container'>
        <img className='court-image' src={transparentCourt} ></img>
      </div>
      <DisplayOptions currentDisplayOption={currentDisplayOption} setCurrentDisplayOption={setCurrentDisplayOption} />
    </div>
  )
};

export default CourtDisplay;
