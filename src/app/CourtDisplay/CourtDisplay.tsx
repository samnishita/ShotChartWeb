import React, { FC } from 'react';
import './CourtDisplay.scss';
import transparentCourt from '../../images/transparent.png';

interface CourtDisplayProps { }

const CourtDisplay: FC<CourtDisplayProps> = () => {

  return (
    <div className="CourtDisplay">
      <div id='court-title-container'>
      {/* <h3>The Search Title Goes Here </h3> */}
      <h3>The Search Title Goes Here BUT IT'S EXTRA EXTRA LONG</h3>
      </div>
      <div className='court-container'>
        <img className='court-image' src={transparentCourt} ></img>
      </div>
      <div>The display choices will go here</div>
    </div>
  )
};

export default CourtDisplay;
