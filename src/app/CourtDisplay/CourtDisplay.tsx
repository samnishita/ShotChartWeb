import React, { FC, useEffect, useRef, useState } from 'react';
import './CourtDisplay.scss';
import transparentCourt from '../../images/transparent.png';
import { CLASSIC_DISPLAY, DisplayOption, GRID_DISPLAY, HEAT_DISPLAY, HEX_DISPLAY } from '../model/DisplayOption';
import DisplayOptions from '../DisplayOptions/DisplayOptions';
import { Shot } from '../model/Shot';
import { SeasonType } from '../model/SeasonType';
import { Player } from '../model/Player';
import { Year } from '../model/Year';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ALL_ZONES, determineShotZones, GridZone } from '../model/GridZone';
interface CourtDisplayProps {
  year: Year,
  player: Player | null,
  seasonType: SeasonType
  shots: Shot[] | null
}

const fontRatioOrig: number = 16 / 400;
//TranslateY value to move shot to center of hoop (px) / current image width (px)
const hoopTranslateYToWidthRatio: number = 411 / 507;

const CourtDisplay: FC<CourtDisplayProps> = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);  // State to track if the image is loaded
  const [imageWidth, setImageWidth] = useState<number | null>(null);  // State to store image width
  const imageRef = useRef<HTMLImageElement>(null);  // Ref to access the image element
  const [currentDisplayOption, setCurrentDisplayOption] = useState<DisplayOption>(GRID_DISPLAY);
  const [classicShots, setClassicShots] = useState<Shot[] | null>(null);
  const [classicShotsDisplayNodes, setClassicShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);
  // const [gridShots, setGridShots] = useState<Shot[] | null>(null);
  const [gridZones, setGridZones] = useState<GridZone[] | null>(null);
  const [gridShotsDisplayNodes, setGridShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);

  const processNewShotsClassic = (shots: Shot[]): void => {
    shots.forEach((eachShot) => {
      let currentImageWidth: number = (imageWidth ? imageWidth : 1);
      //Scale font size with image size
      let fontSize: number = fontRatioOrig * currentImageWidth;
      //Move shot to hoop origin
      let translateYToHoopOrigin: number = hoopTranslateYToWidthRatio * currentImageWidth;
      //Move shot using shot coordinates
      let shotXTranslate: number = (eachShot.x) / 500 * currentImageWidth;
      let shotYTranslate: number = -(eachShot.y - 5) / 500 * currentImageWidth;
      //Convert to px styling
      let sxStyle = { fontSize: fontSize, transform: "translateX(" + shotXTranslate + "px) translateY(" + (translateYToHoopOrigin + shotYTranslate) + "px)" };
      eachShot.sx = sxStyle;
    });
    setClassicShots(shots);
  }

  const processExistingShotsClassic = (): void => {
    if (currentDisplayOption == CLASSIC_DISPLAY && classicShots != null) {
      let icons: React.ReactNode[] = [];
      classicShots.forEach((eachShot) => {
        let icon: React.ReactNode = eachShot.shotMade ? <RadioButtonUncheckedIcon
          sx={eachShot.sx} key={eachShot.uniqueShotId} className='classic-shot make' /> : <CloseIcon sx={eachShot.sx} key={eachShot.uniqueShotId} className='classic-shot miss' />
        icons.push(icon);
      })
      setClassicShotsDisplayNodes(icons);
    }
  }

  const processNewShotsGrid = (shots: Shot[]): void => {
    let zones = determineShotZones(shots);
    setGridZones(zones);
  }
  const processExistingShotsGrid = () => {
    if (currentDisplayOption == GRID_DISPLAY && gridZones != null) {
      let icons: React.ReactNode[] = [];
      gridZones.forEach((eachZone) => {
        if (imageWidth) {

          // eachZone.madeShots = eachZone.madeShots * 1000;
          // eachZone.totalShots = eachZone.totalShots * 1000;

          let widthRatio: number = imageWidth ? imageWidth / 500 : 1;
          // console.log(widthRatio)
          let style = { transform: `translate( ${eachZone.translateX * widthRatio}px, ${eachZone.translateY * widthRatio}px )` };
          let pathTransform: string = `scale(${widthRatio})`;
          let labelStyle = {
            transform: `translate( ${eachZone.labelX * widthRatio}px, ${eachZone.labelY * widthRatio}px ) scale(${widthRatio})`,
          };
          let showSplitCount: boolean = eachZone.madeShots.toString().length + eachZone.totalShots.toString().length > eachZone.maxLabelLength;
          let icon: React.ReactNode =
            <div className='grid-zone-object-wrapper' key={eachZone.id.toString() + "-wrapper"}>
              <svg viewBox={`0 0 ${eachZone.width * widthRatio} ${eachZone.height * widthRatio}`} className='grid-zone' key={eachZone.id} width={eachZone.width * widthRatio} height={eachZone.height * widthRatio} style={style}>
                <path strokeWidth={eachZone.strokeWidth} stroke={eachZone.stroke} d={eachZone.d} fill={eachZone.fill} transform={pathTransform} />
              </svg>
              <div className='grid-zone-label-container' style={labelStyle}>
                {showSplitCount ? (<>
                  <div className='grid-zone-label'>{eachZone.madeShots}</div>
                  <div className='grid-zone-label'>/</div>
                  <div className='grid-zone-label'>{eachZone.totalShots}</div>
                </>) : (<>
                  <div className='grid-zone-label invisible'>/</div>
                  <div className='grid-zone-label'>{eachZone.madeShots}/{eachZone.totalShots}</div>
                </>)}
                <div className='grid-zone-label'>{eachZone.totalShots > 0 ? `${(eachZone.madeShots * 100 / eachZone.totalShots).toFixed(2)}%` : '-'}</div>
              </div>
            </div>
          icons.push(icon);
        }
      })
      setGridShotsDisplayNodes(icons);
    }
  }

  const listenForResize = () => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageWidth(imageRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    if (currentDisplayOption != CLASSIC_DISPLAY) {
      setClassicShotsDisplayNodes([]);
    } else {
      processExistingShotsClassic();
    }
    if (currentDisplayOption != GRID_DISPLAY) {
      setGridShotsDisplayNodes([]);
    } else {
      processExistingShotsGrid();
    }
  }, [currentDisplayOption])

  useEffect(() => {
    if (currentDisplayOption == CLASSIC_DISPLAY && props.shots) {
      processExistingShotsClassic();
    } else if (currentDisplayOption == GRID_DISPLAY && props.shots) {
      processExistingShotsGrid();
    }
  }, [imageWidth])

  useEffect(() => {
    setClassicShots([]);
    setGridZones([]);
    if (props.shots != null && currentDisplayOption == CLASSIC_DISPLAY) {
      processNewShotsClassic(props.shots);
    } else if (props.shots != null && currentDisplayOption == GRID_DISPLAY) {
      processNewShotsGrid(props.shots);
    }
  }, [props.shots]);

  useEffect(() => {
    if (props.shots != null && currentDisplayOption == CLASSIC_DISPLAY) {
      processExistingShotsClassic();
    }
  }, [classicShots]);

  useEffect(() => {
    if (props.shots != null && currentDisplayOption == GRID_DISPLAY) {
      processExistingShotsGrid();
    }
  }, [gridZones]);

  useEffect(() => {
    listenForResize();
  }, [isLoaded]);

  useEffect(() => {
    listenForResize();
  }, []);

  return (
    <div className="CourtDisplay">
      <div id='court-title-container'>
        {/* <h3>The Search Title Goes Here </h3> */}
        {/* <h3 >The Search Title Goes Here BUT IT'S EXTRA EXTRA LONG</h3> */}
        <h3 className={props.year && props.player && props.seasonType && props.shots ? "" : "hide"}>
          {(props.player?.playerFirstName + " " + props.player?.playerLastName).trim() + " " + props.year?.yearDisplay + " " + props.seasonType?.label}
        </h3>
      </div>
      <div className='court-container'>
        <div className='court-background'>
          <img onLoad={handleImageLoad} ref={imageRef} className='court-image' src={transparentCourt} ></img>
        </div>
        {classicShotsDisplayNodes}
        {gridShotsDisplayNodes}
        {/* <div id='grid-shots-container' className={currentDisplayOption == GRID_DISPLAY ? "" : "hide"}>B</div>
        <div id='hex-shots-container' className={currentDisplayOption == HEX_DISPLAY ? "" : "hide"}>C</div>
        <div id='heat-shots-container' className={currentDisplayOption == HEAT_DISPLAY ? "" : "hide"}>D</div> */}
      </div>
      <DisplayOptions currentDisplayOption={currentDisplayOption} setCurrentDisplayOption={setCurrentDisplayOption} />
    </div>
  )
};

export default CourtDisplay;
