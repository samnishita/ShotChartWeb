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
import { ALL_ZONES, determineShotZones, FILL_ABOVE_AVERAGE, FILL_AVERAGE, FILL_BELOW_AVERAGE, FILL_DEFAULT, FILL_FAR_ABOVE_AVERAGE, FILL_FAR_BELOW_AVERAGE, FILL_SLIGHTLY_ABOVE_AVERAGE, FILL_SLIGHTLY_BELOW_AVERAGE, GridZone } from '../model/GridZone';
import { ZoneAverage } from '../model/ZoneAverage';
import { getGridAveragesAllTimeAllSeason } from '../service/average-service';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { convertPixelToPointyHex, Hex, HEX_HEIGHT_POINTY, HEX_POINTY_ALTERNATE_ROW_HORIZONTAL_OFFSET, HEX_POINTY_ROW_SPACING, HEX_SIZE_POINTY, HEX_STROKE_WIDTH, HEX_WIDTH_POINTY, HexShot } from '../model/HexShot';

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
  const [currentDisplayOption, setCurrentDisplayOption] = useState<DisplayOption>(HEX_DISPLAY);
  const [classicShots, setClassicShots] = useState<Shot[] | null>(null);
  const [classicShotsDisplayNodes, setClassicShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);
  // const [gridShots, setGridShots] = useState<Shot[] | null>(null);
  const [gridZones, setGridZones] = useState<GridZone[] | null>(null);
  const [gridShotsDisplayNodes, setGridShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);
  const [zoneAverages, setZoneAverages] = useState<Map<number, ZoneAverage> | null>(null);
  const [hexShots, setHexShots] = useState<Map<string, HexShot> | null>(null);
  const [hexDisplayNodes, setHexDisplayNodes] = useState<React.ReactNode[] | null>(null);


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
    if (currentDisplayOption == GRID_DISPLAY && gridZones != null && zoneAverages != null) {
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
          let zoneAverage: ZoneAverage | undefined = zoneAverages.get(eachZone.id);
          let fill: string = FILL_AVERAGE;
          if (zoneAverage) {
            let averageDiff: number = (eachZone.madeShots / eachZone.totalShots) - zoneAverage.average;
            if (averageDiff > 0.06) {
              fill = FILL_FAR_ABOVE_AVERAGE;
            } else if (averageDiff < 0.06 && averageDiff >= 0.04) {
              fill = FILL_ABOVE_AVERAGE;
            } else if (averageDiff < 0.04 && averageDiff >= 0.02) {
              fill = FILL_SLIGHTLY_ABOVE_AVERAGE;
            } else if (averageDiff < 0.02 && averageDiff >= -0.02) {
              fill = FILL_AVERAGE;
            } else if (averageDiff < -0.02 && averageDiff >= -0.04) {
              fill = FILL_SLIGHTLY_BELOW_AVERAGE;
            } else if (averageDiff < -0.04 && averageDiff >= -0.06) {
              fill = FILL_BELOW_AVERAGE;
            } else if (averageDiff < -0.06) {
              fill = FILL_FAR_BELOW_AVERAGE;
            }
          }

          let icon: React.ReactNode =
            <div className='grid-zone-object-wrapper' key={eachZone.id.toString() + "-wrapper"}
            >
              <svg viewBox={`0 0 ${eachZone.width * widthRatio} ${eachZone.height * widthRatio}`} className='grid-zone' key={eachZone.id} width={eachZone.width * widthRatio} height={eachZone.height * widthRatio} style={style}>
                <path strokeWidth={eachZone.strokeWidth} stroke={eachZone.stroke} d={eachZone.d} fill={fill} transform={pathTransform} />
              </svg>
              <div className='grid-zone-label-container' style={labelStyle}>
                {showSplitCount ? (<>
                  <div className='grid-zone-label'>{eachZone.madeShots}</div>
                  <div className='grid-zone-label'>/</div>
                  <div className='grid-zone-label'>{eachZone.totalShots}</div>
                </>) : (<>
                  <div className='grid-zone-label'>{eachZone.madeShots}/{eachZone.totalShots}</div>
                </>)}
                <div className='grid-zone-label'>{eachZone.totalShots > 0 ? `${(eachZone.madeShots * 100 / eachZone.totalShots).toFixed(2)}%` : '-'}</div>
              </div>
            </div>
          icons.push(icon);
        }
      });
      if (imageWidth) {
        let widthRatio: number = imageWidth ? imageWidth / 500 : 1;
        console.log(widthRatio)
        let legendStyle = {
          transform: `translate( -${152 * widthRatio}px, ${8 * widthRatio}px )`,
        };
        let legendTitleStyle = {
          fontSize: `${widthRatio * 0.8}rem`
        }
        icons.push(<div key={"grid-legend"} className='grid-legend' style={legendStyle}>
          <span className='grid-legend-title' style={legendTitleStyle}>Shooting Percentage</span>
          <div className='grid-legend-gradient-container'>
            <div className='grid-legend-gradient-label-container'>
              <div>Below Avg.</div>
              <div>Above Avg.</div>
            </div>
            <div className='grid-legend-gradient' style={{
              background: `linear-gradient(to right,
              ${FILL_FAR_BELOW_AVERAGE},
              ${FILL_BELOW_AVERAGE},
              ${FILL_SLIGHTLY_BELOW_AVERAGE},
              ${FILL_AVERAGE},
              ${FILL_SLIGHTLY_ABOVE_AVERAGE},
              ${FILL_ABOVE_AVERAGE},
              ${FILL_FAR_ABOVE_AVERAGE}
              )`}}></div>
          </div>
        </div>)
      }


      setGridShotsDisplayNodes(icons);
    }
  }

  const processNewShotsHex = (shots: Shot[]): void => {
    let hexMap: Map<string, HexShot> = new Map();
    let alternateRow: boolean = false;
    for (let y = -55 + HEX_POINTY_ROW_SPACING; y < 400; y = y + HEX_POINTY_ROW_SPACING) {
      alternateRow = !alternateRow;
      for (let x = -250 + (alternateRow ? HEX_POINTY_ALTERNATE_ROW_HORIZONTAL_OFFSET : 0); x < 250; x = x + HEX_WIDTH_POINTY) {
        let roundedHex: Hex = convertPixelToPointyHex(x, y);
        let hexShot: HexShot = {
          x: x,
          y: y,
          q: roundedHex.q,
          r: roundedHex.r,
          s: 0,
          a: 0,
          b: 0,
          idwScore: 0,
          madeShots: 0,
          totalShots: 0,
        };
        if (x <= -250) {
          continue;
        }
        hexMap.set(`${hexShot.q}_${hexShot.r}`, hexShot);
      }
    }
    setHexShots(hexMap);
  }

  const processExistingShotsHex = () => {
    if (imageWidth) {
      let widthRatio: number = imageWidth ? imageWidth / 500 : 1;
      console.log(widthRatio)
      let hexagons: React.ReactNode[] = [];
      hexShots?.forEach((eachHex: HexShot) => {
        hexagons.push(<HexagonIcon className='hex-icon'
          key={`hex-(${eachHex.q})-(${eachHex.r})`}
          id={`hex-(${eachHex.q})-(${eachHex.r})`}
          sx={{ fontSize: `${HEX_HEIGHT_POINTY * widthRatio}px`, transform: `translate(${0}px, ${405 * widthRatio}px) translate(${eachHex.x * widthRatio}px, ${-eachHex.y * widthRatio}px) rotate(30deg) scale(${1})` }}
          onMouseEnter={handleHexMouseEnter}
          data-coordinate={`${eachHex.x}-${eachHex.y}`}
        />);
      });
      setHexDisplayNodes(hexagons);
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

  const handleHexMouseEnter = (e: { target: any; }) => {
    console.log(e.target);
  }

  useEffect(() => {
    if (currentDisplayOption != CLASSIC_DISPLAY) {
      setClassicShotsDisplayNodes(null);
    } else {
      if (classicShots == null && props.shots != null) {
        processNewShotsClassic(props.shots);
      } else {
        processExistingShotsClassic();
      }
    }
    if (currentDisplayOption != GRID_DISPLAY) {
      setGridShotsDisplayNodes(null);
    } else {
      if (gridZones == null && props.shots != null) {
        processNewShotsGrid(props.shots);
      } else {
        processExistingShotsGrid();
      }
    }
    if (currentDisplayOption != HEX_DISPLAY) {
      setHexDisplayNodes(null);
    } else {
      if (hexShots == null && props.shots != null) {
        processNewShotsHex(props.shots);
      } else {
        processExistingShotsHex();
      }
    }
  }, [currentDisplayOption])

  useEffect(() => {
    if (currentDisplayOption == CLASSIC_DISPLAY && props.shots) {
      processExistingShotsClassic();
    } else if (currentDisplayOption == GRID_DISPLAY && props.shots) {
      processExistingShotsGrid();
    } else if (currentDisplayOption == HEX_DISPLAY) {
      processExistingShotsHex();
    }

  }, [imageWidth])

  useEffect(() => {
    setClassicShots(null);
    setGridZones(null);
    if (props.shots != null && currentDisplayOption == CLASSIC_DISPLAY) {
      processNewShotsClassic(props.shots);
    } else if (props.shots != null && currentDisplayOption == GRID_DISPLAY) {
      processNewShotsGrid(props.shots);
    } else if (props.shots != null && currentDisplayOption == HEX_DISPLAY) {
      processNewShotsHex(props.shots);
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
    if (props.shots != null && currentDisplayOption == HEX_DISPLAY) {
      processExistingShotsHex();
    }
  }, [hexShots]);

  useEffect(() => {
    listenForResize();
  }, [isLoaded]);

  useEffect(() => {
    listenForResize();
    getGridAveragesAllTimeAllSeason().then(data => {
      let map: Map<number, ZoneAverage> = new Map();
      data.forEach(eachData => {
        map.set(eachData.zoneId, eachData);
      })
      setZoneAverages(map);
    });
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
        <div className='court-background' style={{ zIndex: currentDisplayOption === GRID_DISPLAY ? 3 : 0, backgroundColor: currentDisplayOption === GRID_DISPLAY && gridShotsDisplayNodes != null ? "transparent" : "rgb(80, 85, 91)", opacity: currentDisplayOption === GRID_DISPLAY && gridShotsDisplayNodes != null ? 0.7 : 1 }}>
          <img onLoad={handleImageLoad} ref={imageRef} className='court-image' src={transparentCourt} ></img>
        </div>
        {classicShotsDisplayNodes}
        {gridShotsDisplayNodes}
        {hexDisplayNodes}
        {/* <div id='grid-shots-container' className={currentDisplayOption == GRID_DISPLAY ? "" : "hide"}>B</div>
        <div id='hex-shots-container' className={currentDisplayOption == HEX_DISPLAY ? "" : "hide"}>C</div>
        <div id='heat-shots-container' className={currentDisplayOption == HEAT_DISPLAY ? "" : "hide"}>D</div> */}
      </div>
      <DisplayOptions currentDisplayOption={currentDisplayOption} setCurrentDisplayOption={setCurrentDisplayOption} />
    </div>
  )
};

export default CourtDisplay;
