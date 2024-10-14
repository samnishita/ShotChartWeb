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
import { determineShotZones, FILL_ABOVE_AVERAGE, FILL_AVERAGE, FILL_BELOW_AVERAGE, FILL_FAR_ABOVE_AVERAGE, FILL_FAR_BELOW_AVERAGE, FILL_SLIGHTLY_ABOVE_AVERAGE, FILL_SLIGHTLY_BELOW_AVERAGE, GridZone } from '../model/GridZone';
import { ZoneAverage } from '../model/ZoneAverage';
import { getGridAveragesAllTimeAllSeason } from '../service/average-service';
import HexagonIcon from '@mui/icons-material/Hexagon';
import { analyzeNeighbors, convertPixelToPointyHex, Hex, HEX_HEIGHT_POINTY, HEX_POINTY_ALTERNATE_ROW_HORIZONTAL_OFFSET, HEX_POINTY_ROW_SPACING, HEX_WIDTH_POINTY, HexShot } from '../model/HexShot';
import { HeatShot } from '../model/HeatShot';
import CircleIcon from '@mui/icons-material/Circle';

interface CourtDisplayProps {
  year: Year,
  player: Player | null,
  seasonType: SeasonType
  shots: Shot[] | null
}

const fontRatioOrig: number = 16 / 400;
//TranslateY value to move shot to center of hoop (px) / current image width (px)
const hoopTranslateYToWidthRatio: number = 411 / 507;
const HEAT_RANGE: number = 12;

//k,v = `${hexShot.q}_${hexShot.r}`, HexShot
export const generateMapKey = (q: number, r: number): string => {
  return `(${q})-(${r})`;
}

const CourtDisplay: FC<CourtDisplayProps> = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentDisplayOption, setCurrentDisplayOption] = useState<DisplayOption>(HEAT_DISPLAY);
  const [classicShots, setClassicShots] = useState<Shot[] | null>(null);
  const [classicShotsDisplayNodes, setClassicShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);
  // const [gridShots, setGridShots] = useState<Shot[] | null>(null);
  const [gridZones, setGridZones] = useState<GridZone[] | null>(null);
  const [gridShotsDisplayNodes, setGridShotsDisplayNodes] = useState<React.ReactNode[] | null>(null);
  const [zoneAverages, setZoneAverages] = useState<Map<number, ZoneAverage> | null>(null);
  const [hexShots, setHexShots] = useState<Map<string, HexShot> | null>(null);
  const [hexDisplayNodes, setHexDisplayNodes] = useState<React.ReactNode[] | null>(null);
  const [heatShots, setHeatShots] = useState<Map<string, HeatShot> | null>(null);
  // const [heatShotsCondensed, setHeatShotsCondensed] = useState<Map<string, HeatShot> | null>(null);
  const [heatDisplayNodes, setHeatDisplayNodes] = useState<React.ReactNode[] | null>(null);
  const [largestWTotalShotsHex, setLargestWTotalShotsHex] = useState<number>(Number.NEGATIVE_INFINITY);
  const [largestWHeat, setLargestWHeat] = useState<number>(Number.NEGATIVE_INFINITY);
  const processNewShotsClassic = (shots: Shot[]): void => {
    // shots.forEach((eachShot) => {

    // });
    setClassicShots(shots);
  }

  const processExistingShotsClassic = (): void => {
    if (currentDisplayOption == CLASSIC_DISPLAY && classicShots != null) {
      let icons: React.ReactNode[] = [];
      classicShots.forEach((eachShot) => {
        let currentImageWidth: number = (imageWidth ? imageWidth : 1);
        //Scale font size with image size
        let fontSize: number = fontRatioOrig * currentImageWidth;
        //Move shot to hoop origin
        let translateYToHoopOrigin: number = hoopTranslateYToWidthRatio * currentImageWidth;
        //Move shot using shot coordinates
        let shotXTranslate: number = (eachShot.x) / -500 * currentImageWidth;
        let shotYTranslate: number = -(eachShot.y - 5) / 500 * currentImageWidth;
        //Convert to px styling
        let sxStyle = { fontSize: fontSize, transform: "translateX(" + shotXTranslate + "px) translateY(" + (translateYToHoopOrigin + shotYTranslate) + "px)" };
        eachShot.sx = sxStyle;
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
        // console.log(widthRatio)
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
          madeShots: 0,
          totalShots: 0,
          aOverall: 0,
          aMadeShots: 0,
          aTotalShots: 0,
          bOverall: 0,
          bMadeShots: 0,
          bTotalShots: 0,
          wOverall: 0,
          wMadeShots: 0,
          wTotalShots: 0
        };
        hexMap.set(generateMapKey(hexShot.q, hexShot.r), hexShot);
      }
    }
    shots.forEach((eachShot: Shot) => {

      let hex: Hex = convertPixelToPointyHex(eachShot.x, eachShot.y);
      let hexShot: HexShot | undefined = hexMap.get(generateMapKey(hex.q, hex.r));
      if (hexShot) {
        // if ((eachShot.x > -5 && eachShot.x < 5 && eachShot.y > -5 && eachShot.y < 5)) {
        // console.log(eachShot);
        // console.log(`Shot: (${eachShot.x},${eachShot.y})`);
        // console.log(`Hex: q=${hexShot.q}, r=${hexShot.r}`)
        // }
        if (eachShot.shotMade) {
          hexShot.madeShots++;
        }
        hexShot.totalShots++;
      } else {
        console.log("THIS SHOT DOESN'T EXIST");
        console.log(eachShot)
      }
    });
    hexMap.forEach((value: HexShot) => {
      analyzeNeighbors(value, hexMap);
    });
    let largestWTotalShots: number = Number.NEGATIVE_INFINITY;
    hexMap.forEach((eachHex: HexShot) => {
      eachHex.wMadeShots = eachHex.aMadeShots / eachHex.bMadeShots;
      eachHex.wTotalShots = eachHex.aTotalShots / eachHex.bTotalShots;
      //is needed?
      eachHex.wOverall = (eachHex.aMadeShots / eachHex.aTotalShots) / (eachHex.bMadeShots / eachHex.bTotalShots);
      if (largestWTotalShots < eachHex.wTotalShots) {
        largestWTotalShots = eachHex.wTotalShots;
      }
    });
    largestWTotalShots = 0.15 * largestWTotalShots;
    setHexShots(hexMap);
    setLargestWTotalShotsHex(largestWTotalShots);
  }

  const processExistingShotsHex = () => {
    if (imageWidth) {
      let widthRatio: number = imageWidth ? imageWidth / 500 : 1;
      console.log(widthRatio)
      let hexagons: React.ReactNode[] = [];
      hexShots?.forEach((eachHex: HexShot) => {
        if (eachHex.x > -250) {
          hexagons.push(<HexagonIcon className='hex-icon'
            key={`hex-${generateMapKey(eachHex.q, eachHex.r)}`}
            id={`hex-${generateMapKey(eachHex.q, eachHex.r)}`}
            sx={{
              fill: `${eachHex.q == 0 && eachHex.r == 0 ? "blue" : "white"}`,
              fontSize: `${HEX_HEIGHT_POINTY * widthRatio}px`,
              transform: `translate(${0}px, ${405 * widthRatio}px) 
           translate(${-eachHex.x * widthRatio}px, ${-eachHex.y * widthRatio}px)
            rotate(30deg)
            scale(${eachHex.wTotalShots > largestWTotalShotsHex ? 1 : eachHex.wTotalShots / largestWTotalShotsHex})
            `
            }}
            onMouseEnter={handleHexMouseEnter}
            data-coordinate={generateMapKey(Math.round(eachHex.x), eachHex.y)}
          />);
        }
      });
      setHexDisplayNodes(hexagons);
    }
  }

  const processNewShotsHeat = (shots: Shot[]): void => {
    let heatMap: Map<string, HeatShot> = new Map();
    let heatMapCondensed: Map<string, HeatShot> = new Map();
    for (let y = -55; y <= 400; y++) {
      for (let x = -250; x <= 250; x++) {
        heatMap.set(generateMapKey(x, y), {
          x: x,
          y: y,
          a: 0,
          b: 0,
          w: 0,
          totalShots: 0,
          fill: 'transparent',
          z: 0
        })
      }
    }
    let offset: number = 5;
    for (let y = -55; y <= 400; y += offset) {
      for (let x = -250; x <= 250; x += offset) {
        heatMapCondensed.set(generateMapKey(x, y), {
          x: x,
          y: y,
          a: 0,
          b: 0,
          w: 0,
          totalShots: 0,
          fill: 'transparent',
          z: 0
        })
      }
    }
    shots.forEach((eachShot) => {
      let heatShot: HeatShot | undefined = heatMap.get(generateMapKey(eachShot.x, eachShot.y));
      if (heatShot) {
        heatShot.totalShots++;
        let heatShotCondensed = heatMapCondensed.get(generateMapKey(eachShot.x, eachShot.y));
        if (heatShotCondensed) {
          heatShotCondensed.totalShots++;
        }
      } else {
        // console.log("HEAT SHOT DOES NOT EXIST");
        // console.log(eachShot)
      }
    });
    heatMapCondensed.forEach((eachHeatShot: HeatShot) => {
      for (let x = eachHeatShot.x - HEAT_RANGE; x <= eachHeatShot.x + HEAT_RANGE; x++) {
        for (let y = eachHeatShot.y - HEAT_RANGE; y <= eachHeatShot.y + HEAT_RANGE; y++) {
          if (x == eachHeatShot.x && y == eachHeatShot.y) {
            continue;
          }
          let neighborHeatShot: HeatShot | undefined = heatMap.get(generateMapKey(x, y));
          if (neighborHeatShot) {
            eachHeatShot.totalShots += neighborHeatShot.totalShots;
            eachHeatShot.a += 1000 * neighborHeatShot.totalShots / Math.pow(distanceBetweenTwoPoints(eachHeatShot.x, eachHeatShot.y, neighborHeatShot.x, neighborHeatShot.y), 2);
            eachHeatShot.b += 1 / Math.pow(distanceBetweenTwoPoints(eachHeatShot.x, eachHeatShot.y, neighborHeatShot.x, neighborHeatShot.y), 2);
          }
        }
      }
    });
    let wList: number[] = [];
    let largestW: number = Number.NEGATIVE_INFINITY;
    heatMapCondensed.forEach((eachHeatShot: HeatShot) => {
      if (eachHeatShot.b > 0) {
        eachHeatShot.w = eachHeatShot.a / eachHeatShot.b;
        wList.push(eachHeatShot.w);
      }
      if (eachHeatShot.w > largestW) {
        largestW = eachHeatShot.w;
      }
    });
    let sortedW: number[] = wList.sort((a, b) => b - a);
    // console.log(sortedW)
    let maxW: number = 200;
    //increase frac to increase the minimum number of shots required for a circle to appear
    let frac: number = 0.002;
    let minShots: number = props.shots && props.shots.length * frac > 1 ? props.shots.length * frac : 1;
    // console.log("minshots:" + minShots)
    largestW = sortedW[Math.round(sortedW.length * 0.005)];
    if (largestW > maxW) {
      largestW = maxW;
    }
    // console.log("largestW:" + largestW)

    let diff: number = largestW / 7;
    heatMapCondensed.forEach((eachHeatShot: HeatShot) => {
      if (eachHeatShot.totalShots > minShots) {
        if (eachHeatShot.w > 6 * diff) {
          eachHeatShot.fill = "gradient0";
          eachHeatShot.z = 10;
        } else if (eachHeatShot.w <= 6 * diff && eachHeatShot.w > 5 * diff) {
          eachHeatShot.fill = "gradient1"
          eachHeatShot.z = 9;
        } else if (eachHeatShot.w <= 5 * diff && eachHeatShot.w > 4 * diff) {
          eachHeatShot.fill = "gradient2"
          eachHeatShot.z = 8;
        } else if (eachHeatShot.w <= 4 * diff && eachHeatShot.w > 3 * diff) {
          eachHeatShot.fill = "gradient3"
          eachHeatShot.z = 7;
        } else if (eachHeatShot.w <= 3 * diff && eachHeatShot.w > 2 * diff) {
          eachHeatShot.fill = "gradient4"
          eachHeatShot.z = 6;
        } else if (eachHeatShot.w <= 2 * diff && eachHeatShot.w > 1 * diff) {
          eachHeatShot.fill = "gradient5"
          eachHeatShot.z = 5;
        } else if (eachHeatShot.w <= 1 * diff && eachHeatShot.w > 0) {
          eachHeatShot.fill = "gradient6"
          eachHeatShot.z = 4;
        }
      }

    });
    setHeatShots(heatMapCondensed);
    setLargestWHeat(largestW);
  }

  const processExistingShotsHeat = () => {
    if (imageWidth) {
      let widthRatio: number = imageWidth ? imageWidth / 500 : 1;
      console.log(widthRatio);
      let circles: React.ReactElement[] = [];
      let fontSize: number = 16;
      let count: number = 0;
      heatShots?.forEach((eachHeatShot: HeatShot) => {
        if (eachHeatShot.fill !== "transparent") {
          count++;
          circles.push(<CircleIcon className='heat-icon'
            key={`heat-${generateMapKey(eachHeatShot.x, eachHeatShot.y)}`}
            id={`heat-${generateMapKey(eachHeatShot.x, eachHeatShot.y)}`}
            sx={{
              fill: `url(#${eachHeatShot.fill})`,
              fontSize: `${fontSize}px`,
              transform: `translate(${0}px, ${405 * widthRatio}px) 
             translate(${-eachHeatShot.x * widthRatio}px, ${(-eachHeatShot.y) * widthRatio}px)
             scale(3)`,
              zIndex: eachHeatShot.z
            }}
            data-coordinate={generateMapKey(Math.round(eachHeatShot.x), eachHeatShot.y)}
          />);
        }

      });
      // console.log("count: " + count);
      setHeatDisplayNodes(circles);
    };
  }

  const distanceBetweenTwoPoints = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
  }

  const gradientDefs = () => {
    let startOpacity: number = 0.2;
    let middleOpacity: number = 0.15;
    let middleOffset: number = 10;
    return <svg style={{ height: 0, width: 0 }}>
      <radialGradient id="gradient0" >
        <stop offset="0%" style={{ stopColor: '#90ebff', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#90ebff', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#90ebff', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient1" >
        <stop offset="0%" style={{ stopColor: '#62c8ff', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#62c8ff', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#62c8ff', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient2" >
        <stop offset="0%" style={{ stopColor: '#6bb2f8', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#6bb2f8', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#6bb2f8', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient3" >
        <stop offset="0%" style={{ stopColor: '#c4b8ff', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#c4b8ff', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#c4b8ff', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient4" >
        <stop offset="0%" style={{ stopColor: '#e696fa', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#e696fa', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#e696fa', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient5" >
        <stop offset="0%" style={{ stopColor: '#dd76ff', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#dd76ff', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#dd76ff', stopOpacity: 0 }} />
      </radialGradient>
      <radialGradient id="gradient6" >
        <stop offset="0%" style={{ stopColor: '#bc53f8', stopOpacity: startOpacity }} />
        <stop offset={`${middleOffset}%`} style={{ stopColor: '#bc53f8', stopOpacity: middleOpacity }} />
        <stop offset="100%" style={{ stopColor: '#bc53f8', stopOpacity: 0 }} />
      </radialGradient>
    </svg>
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
    if (currentDisplayOption != HEAT_DISPLAY) {
      setHeatDisplayNodes(null);
    } else {
      if (heatShots == null && props.shots != null) {
        processNewShotsHeat(props.shots);
      } else {
        processExistingShotsHeat();
      }
    }
  }, [currentDisplayOption])

  useEffect(() => {
    if (currentDisplayOption == CLASSIC_DISPLAY && props.shots) {
      processExistingShotsClassic();
    } else if (currentDisplayOption == GRID_DISPLAY && props.shots) {
      processExistingShotsGrid();
    } else if (currentDisplayOption == HEX_DISPLAY && props.shots) {
      processExistingShotsHex();
    } else if (currentDisplayOption == HEAT_DISPLAY && props.shots) {
      processExistingShotsHeat();
    }

  }, [imageWidth])

  useEffect(() => {
    setClassicShots(null);
    setGridZones(null);
    setHexShots(null);
    setLargestWTotalShotsHex(Number.NEGATIVE_INFINITY);
    setHeatShots(null);
    if (props.shots != null && currentDisplayOption == CLASSIC_DISPLAY) {
      processNewShotsClassic(props.shots);
    } else if (props.shots != null && currentDisplayOption == GRID_DISPLAY) {
      processNewShotsGrid(props.shots);
    } else if (props.shots != null && currentDisplayOption == HEX_DISPLAY) {
      processNewShotsHex(props.shots);
    } else if (props.shots != null && currentDisplayOption == HEAT_DISPLAY) {
      processNewShotsHeat(props.shots);
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
    if (props.shots != null && currentDisplayOption == HEAT_DISPLAY) {
      processExistingShotsHeat();
    }
  }, [heatShots]);

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
        {heatDisplayNodes}
        {gradientDefs()}
      </div>
      <DisplayOptions currentDisplayOption={currentDisplayOption} setCurrentDisplayOption={setCurrentDisplayOption} />
    </div>
  )
};

export default CourtDisplay;
