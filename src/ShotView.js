import './ShotView.css'
import exclam from './images/exclamation.png'
import transparentCourt from './images/transparent.png'
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { Popover, Button } from 'antd';

import { useEffect, useState, useRef } from "react";

const ShotView = (props) => {
    console.log("RERENDER ShotView")
    const [combinedState, setCombinedState] = useState({
        allHexTiles: [],
        allHeatTiles: [],
        hexAverages: props.hexAverages,
        zoneAverages: props.zoneAverages,
        whatToDisplay: [],
        allShots: [],
        localViewType: { type: "Classic", isOriginal: false },
        loadingAnimation: "",
        legend: [],
    })
    const combinedStateRef = useRef({})
    combinedStateRef.current = combinedState
    const whatToDisplayRef = useRef([])
    whatToDisplayRef.current = combinedStateRef.current.whatToDisplay
    const allShotsRef = useRef({})
    allShotsRef.current = combinedStateRef.current.allShots
    const allHexTilesRef = useRef({})
    allHexTilesRef.current = combinedStateRef.current.allHexTiles
    const hexAveragesRef = useRef({})
    hexAveragesRef.current = combinedStateRef.current.hexAverages
    const allHeatTilesRef = useRef({})
    allHeatTilesRef.current = combinedStateRef.current.allHeatTiles
    const zoneAveragesRef = useRef({})
    zoneAveragesRef.current = combinedStateRef.current.zoneAverages
    const loadingAnimationRef = useRef({})
    loadingAnimationRef.current = combinedStateRef.current.loadingAnimation
    const localViewTypeRef = useRef({})
    localViewTypeRef.current = combinedStateRef.current.localViewType

    const maxClassicShots = 2000

    function hideElement(elementId) {
        if (document.getElementById(elementId).classList.contains('show')) {
            document.getElementById(elementId).classList.toggle('show')
        }
    }

    function showElement(elementId) {
        if (!document.getElementById(elementId).classList.contains('show')) {
            document.getElementById(elementId).classList.toggle('show')
        }
    }

    function chooseCourt(view) {
        console.log(`chooseCourt(${view})`)
        if (view === "Zone") {
            showElement("transparent-court-on-top")
            hideElement("gray-background")
            hideElement("transparent-court")
            console.log("Showing transparent-court-on-top")
        } else {
            showElement("transparent-court")
            showElement("gray-background")
            hideElement("transparent-court-on-top")
            console.log("Showing transparent-court & gray-background")
        }
    }

    function generateWhatToDisplay(viewType, shots) {
        console.log("generateWhatToDisplay()")
        console.log(viewType)
        let buffer = []
        buffer.push(determineView(viewType, shots))
        let zoneLabels = generateZoneLabels(viewType, shots)
        if (zoneLabels) {
            buffer.push(zoneLabels)
        }
        return buffer
    }

    function determineView(viewType, shots) {
        console.log("Determining viewtype: " + viewType)
        switch (viewType) {
            case "Classic":
                chooseCourt(viewType)
                console.log("Displaying Classic")
                return displayClassic(shots)
            case "Hex":
                chooseCourt(viewType)
                if (combinedStateRef.current.allHexTiles.length === 0) {
                    console.log("Displaying Hex")
                    displayHex(shots)
                }
                return resizeHex()
            case "Zone":
                chooseCourt(viewType)
                console.log("Displaying Zone")
                return displayZone(shots)
            case "Heat":
                if (combinedStateRef.current.allHeatTiles.length === 0) {
                    console.log("Displaying Heat")
                    displayHeat(shots)
                }
                return resizeHeat()
        }
        return <div></div>
    }

    function displayClassic(inputShots) {
        console.log("displayClassic()")
        let tradArray = []
        if (inputShots && inputShots.length !== 0) {
            let searchType = Object.keys(inputShots)[0]
            let allShotsTemp = inputShots[searchType]
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            const rad = 5 * height / 470;
            const strokeWidth = 2 * height / 470
            let counter = 0;
            allShotsTemp.forEach(each => {
                if (each.y <= 410 && counter < maxClassicShots) {
                    let content = `${each.make === 1 ? "Made" : "Missed"} ${each.distance}' ${each.playtype.replace("shot", "Shot")}`
                    if (each.make === 1) {
                        tradArray.push(
                            <Popover overlayClassName="trad-popover" content={content} trigger="hover">
                                <Svg>
                                    <Circle cx={width / 2 + each.x * width / 500} cy={height / 2 + each.y * height / 470 - 185 * height / 470} r={rad} fill="transparent" stroke="limegreen" strokeWidth={strokeWidth} />
                                </Svg >
                            </Popover>)
                    } else {
                        tradArray.push(
                            <Popover overlayClassName="trad-popover" content={content} trigger="hover">
                                <Svg>
                                    <Rect x={width / 2 - rad + each.x * width / 500} y={height / 2 - rad + each.y * height / 470 - 185 * height / 470} height={2 * rad} width={2 * rad} fill="transparent"></Rect>
                                    <Line x1={width / 2 - rad + each.x * width / 500} y1={height / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={width / 2 + rad + each.x * width / 500} y2={height / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />
                                    <Line x1={width / 2 + rad + each.x * width / 500} y1={height / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={width / 2 - rad + each.x * width / 500} y2={height / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />
                                </Svg>
                            </Popover>)
                    }
                    counter++;
                }
            })
            let styles = {
                position: "absolute",
                transform: `translate(${-(width / 2)}px, ${-height / 2}px)`,
            }
            return (<div id="inner-imageview-div" style={styles}>
                <Svg className="imageview-child" height={height} width={width} >
                    {tradArray}
                </Svg>
            </div>)
        }
        return tradArray
    }
    const squareSizeOrig = 12

    function displayHex(inputShots) {
        console.log("displayHex()")
        if (inputShots && inputShots.length !== 0) {
            let allShotsTemp = inputShots.simplesearch ? inputShots.simplesearch : inputShots.advancedsearch
            let allTiles = {}
            for (let j = -55; j < 400; j = j + squareSizeOrig) {
                for (let i = -250; i < 250; i = i + squareSizeOrig * 1.1547005) {
                    allTiles[`tile_${Math.round(i / squareSizeOrig) * squareSizeOrig}_${j}`] = { x: i, y: j, shotinfo: [0.0, 0.0, 0.0] }
                }
            }
            //let factor = 0.007;
            let factor = 0.015;
            let shots = allShotsTemp.filter(param => param.y <= 400)
            let shotCounter = allShotsTemp.length
            Object.keys(allTiles).forEach(eachTile => {
                let upperBoundX = allTiles[eachTile].x + 5 + squareSizeOrig * 1.5
                let lowerBoundX = allTiles[eachTile].x + 5 - squareSizeOrig * 1.5
                let upperBoundY = allTiles[eachTile].y + 5 + squareSizeOrig * 1.5
                let lowerBoundY = allTiles[eachTile].y + 5 - squareSizeOrig * 1.5
                shots.forEach(eachShot => {
                    if (eachShot.x < upperBoundX && eachShot.x >= lowerBoundX && eachShot.y < upperBoundY && eachShot.y >= lowerBoundY) {
                        allTiles[eachTile].shotinfo[1] = allTiles[eachTile].shotinfo[1] + 1
                        if (eachShot.make === 1) {
                            allTiles[eachTile].shotinfo[0] = allTiles[eachTile].shotinfo[0] + 1
                        }
                    }
                })
                if (allTiles[eachTile].shotinfo[1] !== 0) {
                    allTiles[eachTile].shotinfo[2] = allTiles[eachTile].shotinfo[0] / allTiles[eachTile].shotinfo[1]
                }
            })
            let aSum = 0, bSum = 0, p = 2, maxDistanceBetweenNodes = squareSizeOrig * 2, calcDistance = 0;
            let tileValues = {}
            let min = 1, minFactor = 0.00045;
            shotCounter * minFactor > 1 ? min = shotCounter * minFactor : factor = 4.1008 * Math.pow(shotCounter, -0.798);
            let maxShotsPerMaxSquare = 0;
            maxShotsPerMaxSquare = factor * shotCounter;
            if (maxShotsPerMaxSquare == 0) {
                maxShotsPerMaxSquare = 1;
            }
            let temp, avg, squareElements = []
            Object.keys(allTiles).forEach(eachTile => {
                if (Math.round(allTiles[eachTile].x / squareSizeOrig) * squareSizeOrig % (squareSizeOrig) === 0 && (allTiles[eachTile].y + 55) % (squareSizeOrig) === 0) {
                    aSum = 0;
                    bSum = 0;
                    Object.keys(allTiles).forEach(eachTile2 => {
                        calcDistance = getDistance(allTiles[eachTile], allTiles[eachTile2])
                        if (eachTile !== eachTile2 && calcDistance <= maxDistanceBetweenNodes) {
                            aSum = aSum + (allTiles[eachTile2].shotinfo[2] / Math.pow(calcDistance, p));
                            bSum = bSum + (1 / Math.pow(getDistance(allTiles[eachTile], allTiles[eachTile2]), p));
                        }
                    })
                    tileValues[eachTile] = aSum / bSum;
                    let squareSide = 0
                    let eachTileShotCount = allTiles[eachTile].shotinfo[1]
                    if (eachTileShotCount < maxShotsPerMaxSquare && eachTileShotCount > min) {
                        squareSide = eachTileShotCount / maxShotsPerMaxSquare
                    } else if (eachTileShotCount > maxShotsPerMaxSquare) {
                        squareSide = 1
                    }
                    temp = "(" + (Math.round(allTiles[eachTile].x / 10) * 10) + "," + (Math.round(allTiles[eachTile].y / 10) * 10 + 5) + ")";
                    avg = hexAveragesRef.current[temp]
                    let tileFill = ""
                    if (tileValues[eachTile] > avg + 0.07) {
                        tileFill = "#fc2121"
                    } else if (tileValues[eachTile] > avg + 0.05 && tileValues[eachTile] <= avg + 0.07) {
                        tileFill = "#ff6363"
                    } else if (tileValues[eachTile] > avg + 0.015 && tileValues[eachTile] <= avg + 0.05) {
                        tileFill = "#ff9c9c"
                    } else if (tileValues[eachTile] > avg - 0.015 && tileValues[eachTile] <= avg + 0.015) {
                        tileFill = "white"
                    } else if (tileValues[eachTile] > avg - 0.05 && tileValues[eachTile] <= avg - 0.015) {
                        tileFill = "#aed9ff"
                    } else if (tileValues[eachTile] > avg - 0.07 && tileValues[eachTile] <= avg - 0.05) {
                        tileFill = "#8bc9ff"
                    } else {
                        tileFill = "#7babff"
                    }
                    squareElements.push({
                        x: allTiles[eachTile].x,
                        y: allTiles[eachTile].y,
                        tileFill: tileFill,
                        squareSide: squareSide
                    })
                }
            })
            //setCombinedState({ ...combinedState, allHexTiles: squareElements.forEach(each => combinedState.allHexTiles.push(each)) })
            setCombinedState({ ...combinedStateRef.current, allHexTiles: squareElements, legend: generateLegend("Hex") })
        }
    }

    function resizeHex() {
        console.log("resizeHex()")
        if (allHexTilesRef.current.length > 0) {
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            let squareSize = width / (500 / squareSizeOrig);
            let allNewTiles = []
            allHexTilesRef.current.forEach(eachTile => {
                let squareSide = eachTile.squareSide * squareSize
                if (squareSide !== 0) {
                    let s = squareSide / 2 * 1.05
                    let h = s / Math.cos(30 * Math.PI / 180)
                    let tan = Math.tan(30 * Math.PI / 180)
                    let moveX = (eachTile.y + 55) % (squareSizeOrig * 2) === 0 ? width / 2 + (eachTile.x + squareSizeOrig * 1.1547005 / 2) * height / 470 : width / 2 + (eachTile.x) * height / 470
                    let moveY = height / 2 + (eachTile.y - 175 - squareSide / 2) * height / 470 - 5
                    if (!props.isCurrentViewSimple) {
                        moveY = height / 2 + (eachTile.y - 175 + ((squareSize / 2 * 1.05 / Math.cos(3 * Math.PI / 180)) - (h)) / 2) * height / 470 - 5
                    }
                    //let moveY = height / 2 + (eachTile.y - 175 + (squareSizeOrig / 2 - squareSide / 2) * 1.1547005 / 2) * height / 470 - 5
                    allNewTiles.push(<Path d={`m${moveX} ${moveY} 
                        l${s} ${s * tan} l0 ${h} l${-s} ${s * tan} 
                        l${-s} ${-s * tan} l0 ${-h} l${s} ${-s * tan} l${s} ${s * tan}`}
                        fill={eachTile.tileFill} opacity="0.7" />)
                }
            })
            return (<Svg className="imageview-child Hex-tile" height={height} width={width}>
                {allNewTiles}
            </Svg>)
        }
    }

    function mapShotsToZones(inputShots) {
        console.log("mapShotsToZones()")
        if (inputShots) {
            let allZones = []
            for (let i = 0; i < 16; i++) {
                allZones.push([0, 0, 0])
            }
            function addShot(i, make) {
                allZones[i][1] = allZones[i][1] + 1
                if (make) { allZones[i][0] = allZones[i][0] + 1 }
            }
            let allShotsTemp = inputShots.simplesearch ? inputShots.simplesearch : inputShots.advancedsearch
            allShotsTemp.forEach(eachShot => {
                switch (eachShot.shotzonebasic) {
                    case "Backcourt":
                        break;
                    case "Restricted Area":
                        addShot(1, eachShot.make);
                        break;
                    case "In The Paint (Non-RA)":
                        switch (eachShot.shotzonearea) {
                            case "Left Side(L)":
                                switch (eachShot.shotzonerange) {
                                    case "8-16 ft.":
                                        addShot(3, eachShot.make);
                                        break;
                                }
                                break;
                            case "Center(C)":
                                switch (eachShot.shotzonerange) {
                                    case "Less Than 8 ft.":
                                        addShot(2, eachShot.make);
                                        break;
                                    case "8-16 ft.":
                                        addShot(4, eachShot.make);
                                        break;
                                }
                                break;
                            case "Right Side(R)":
                                switch (eachShot.shotzonerange) {
                                    case "8-16 ft.":
                                        addShot(5, eachShot.make);
                                        break;
                                }
                                break;
                        }
                        break;
                    case "Mid-Range":
                        switch (eachShot.shotzonearea) {
                            case "Left Side(L)":
                                switch (eachShot.shotzonerange) {
                                    case "8-16 ft.":
                                        addShot(3, eachShot.make);
                                        break;
                                    case "16-24 ft.":
                                        addShot(6, eachShot.make);
                                        break;
                                }
                                break;
                            case "Left Side Center(LC)":
                                switch (eachShot.shotzonerange) {
                                    case "16-24 ft.":
                                        addShot(7, eachShot.make);
                                        break;
                                }
                                break;
                            case "Center(C)":
                                switch (eachShot.shotzonerange) {
                                    case "8-16 ft.":
                                        addShot(4, eachShot.make);
                                        break;
                                    case "16-24 ft.":
                                        addShot(8, eachShot.make);
                                        break;
                                }
                                break;
                            case "Right Side Center(RC)":
                                switch (eachShot.shotzonerange) {
                                    case "16-24 ft.":
                                        addShot(9, eachShot.make);
                                        break;
                                }
                                break;
                            case "Right Side(R)":
                                switch (eachShot.shotzonerange) {
                                    case "8-16 ft.":
                                        addShot(5, eachShot.make);
                                        break;
                                    case "16-24 ft.":
                                        addShot(10, eachShot.make);
                                        break;
                                }
                                break;
                        }
                        break;
                    case "Left Corner 3":
                        addShot(11, eachShot.make);
                        break;
                    case "Right Corner 3":
                        addShot(15, eachShot.make);
                        break;
                    case "Above the Break 3":
                        switch (eachShot.shotzonearea) {
                            case "Left Side Center(LC)":
                                switch (eachShot.shotzonerange) {
                                    case "24+ ft.":
                                        addShot(12, eachShot.make);
                                        break;
                                }
                                break;
                            case "Center(C)":
                                switch (eachShot.shotzonerange) {
                                    case "24+ ft.":
                                        addShot(13, eachShot.make);
                                        break;
                                }
                                break;
                            case "Right Side Center(RC)":
                                switch (eachShot.shotzonerange) {
                                    case "24+ ft.":
                                        addShot(14, eachShot.make);
                                        break;
                                    default:
                                }
                                break;
                        }
                        break;
                }
            })
            allZones.forEach(eachZone => {
                if (eachZone[1] !== 0) {
                    eachZone[2] = eachZone[0] * 1.0 / eachZone[1]
                }
            })
            return allZones;
        }
        return <div></div>
    }

    function displayZone(inputShots) {
        console.log("displayZone()")
        if (inputShots) {
            let allZones = mapShotsToZones(inputShots)
            let coloredZones = []
            let fill = ""
            const height = document.getElementById('transparent-court-on-top').clientHeight
            const width = document.getElementById('transparent-court-on-top').clientWidth
            for (let i = 1; i < allZones.length; i++) {
                if (allZones[i][1] === 0) {
                    fill = "gray"
                } else {
                    let diff = allZones[i][2] - zoneAveragesRef.current[i]
                    if (diff > 0.06) {
                        fill = "rgba(252,33,33, 1)"
                    } else if (diff < 0.06 && diff >= 0.04) {
                        fill = "rgba(255,99,99, 1)"
                    } else if (diff < 0.04 && diff >= 0.02) {
                        fill = "rgba(255,156,156, 1)"
                    } else if (diff < 0.02 && diff >= -0.02) {
                        fill = "rgba(178,178,178, 1)"
                    } else if (diff < -0.02 && diff >= -0.04) {
                        fill = "rgba(145,198,244, 1)"
                    } else if (diff < -0.04 && diff >= -0.06) {
                        fill = "rgba(86,176,255, 1)"
                    } else if (diff < -0.06) {
                        fill = "rgba(35,115,255, 1)"
                    }
                }
                let d = ""
                let zoneId = `zone${i}`
                let centerX = width / 2
                let centerY = height / 2
                let strokeWidth = scaleNumber(4)
                let stroke = "rgba(0,0,0,1)"
                switch (i) {
                    case 1:
                        d = `m ${centerX - scaleNumber(39)} ${centerY - scaleNumber(233)}  l ${scaleNumber(78)} 0 l0 ${scaleNumber(56)} a${scaleNumber(4)},${scaleNumber(3.7)} 0 0,1 ${scaleNumber(-77)},0 l0 ${scaleNumber(-56)}`
                        break;
                    case 2:
                        d = `m ${centerX - scaleNumber(80)} ${centerY - scaleNumber(233)} l ${scaleNumber(41)} 0 l0 ${scaleNumber(56)} a${scaleNumber(4)},${scaleNumber(3.7)} 0 0,0 ${scaleNumber(77)},0  l0 ${scaleNumber(-56)} l${scaleNumber(40)} 0 l0 ${scaleNumber(56)}a${scaleNumber(5)},${scaleNumber(5.25)} 0 0,1 ${scaleNumber(-157)},0 l0 ${scaleNumber(-56)}`
                        break;
                    case 3:
                        let r3 = 85, r3_2 = 170
                        d = `m ${centerX - scaleNumber(160)} ${centerY - scaleNumber(233)} l ${scaleNumber(81)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r3)},${scaleNumber(r3)} 0 0,0 ${scaleNumber(38.7)},${scaleNumber(71.2)} l${scaleNumber(-41)} ${scaleNumber(73)} a${scaleNumber(r3_2)},${scaleNumber(r3_2)} 0 0,1 ${scaleNumber(-78.6)} ${scaleNumber(-145)}  l0 ${scaleNumber(-56)}`
                        break;
                    case 4:
                        let r4 = 85, r4_2 = 160
                        d = `m ${centerX - scaleNumber(40)} ${centerY - scaleNumber(105)}  a${scaleNumber(r4)},${scaleNumber(r4)} 0 0,0 ${scaleNumber(80)} 0 l${scaleNumber(41)} ${scaleNumber(71.8)} a${scaleNumber(r4_2)},${scaleNumber(r4_2)} 0 0,1 ${scaleNumber(-162)} 0 l${scaleNumber(41)} ${scaleNumber(-73)}`
                        break;
                    case 5:
                        let r5 = 85, r5_2 = 170
                        d = `m ${centerX + scaleNumber(78)} ${centerY - scaleNumber(233)} l ${scaleNumber(80)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r5_2)},${scaleNumber(r5_2)} 0 0,1 ${scaleNumber(-77.4)} ${scaleNumber(143.5)} l${scaleNumber(-41)} ${scaleNumber(-72.6)} a${scaleNumber(r5)},${scaleNumber(r5)} 0 0,0 ${scaleNumber(38.7)},${scaleNumber(-71.2)}  l0 ${scaleNumber(-56)}`
                        break;
                    case 6:
                        let r6 = 200
                        d = `m ${centerX - scaleNumber(219)} ${centerY - scaleNumber(233)}  l ${scaleNumber(59)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r6)},${scaleNumber(r6)} 0 0,0 ${scaleNumber(24)},${scaleNumber(88.5)} l${scaleNumber(-60)} ${scaleNumber(40)}  a${scaleNumber(r6)},${scaleNumber(r6)} 0 0,1 ${scaleNumber(-22.75)},${scaleNumber(-48)} l0 ${scaleNumber(-137)}`
                        break;
                    case 7:
                        let r7 = 150, r7_2 = 230
                        d = `m ${centerX - scaleNumber(136)} ${centerY - scaleNumber(89)}  a${scaleNumber(r7)},${scaleNumber(r7)} 0 0,0 ${scaleNumber(80)} ${scaleNumber(68)} l${scaleNumber(-22)} ${scaleNumber(65)} a${scaleNumber(r7_2)},${scaleNumber(r7_2)} 0 0,1 ${scaleNumber(-118)} ${scaleNumber(-92.5)} l${scaleNumber(60)} ${scaleNumber(-40)}`
                        break;
                    case 8:
                        let r8 = 150, r8_2 = 230
                        d = `m ${centerX + scaleNumber(-57)} ${centerY - scaleNumber(21)}  a${scaleNumber(r8)},${scaleNumber(r8)} 0 0,0 ${scaleNumber(113)} 0 l${scaleNumber(21.5)} ${scaleNumber(65)} a${scaleNumber(r8_2)},${scaleNumber(r8_2)} 0 0,1 ${scaleNumber(-155.5)} 0 l${scaleNumber(22)} ${scaleNumber(-65)} `
                        break;
                    case 9:
                        let r9 = 150, r9_2 = 230
                        d = `m ${centerX + scaleNumber(135)} ${centerY - scaleNumber(90)} l${scaleNumber(61)} ${scaleNumber(42)} a${scaleNumber(r9_2)},${scaleNumber(r9_2)} 0 0,1 ${scaleNumber(-118)} ${scaleNumber(92.5)} l${scaleNumber(-22)} ${scaleNumber(-66)} a${scaleNumber(r9)},${scaleNumber(r9)} 0 0,0 ${scaleNumber(80)} ${scaleNumber(-70)}  `
                        break;
                    case 10:
                        let r10 = 200
                        d = `m ${centerX + scaleNumber(158)} ${centerY - scaleNumber(233)}  l ${scaleNumber(60.5)} 0 l0 ${scaleNumber(137)} a${scaleNumber(r10)},${scaleNumber(r10)} 0 0,1 ${scaleNumber(-22.75)},${scaleNumber(48)}  l${scaleNumber(-60)} ${scaleNumber(-41.5)}  a${scaleNumber(r10)},${scaleNumber(r10)} 0 0,0 ${scaleNumber(23)},${scaleNumber(-88.5)} l0 ${scaleNumber(-56)}`
                        break;
                    case 11:
                        d = `m ${centerX - scaleNumber(248)} ${centerY - scaleNumber(233)}  l${scaleNumber(30)} 0 l0 ${scaleNumber(137)}l${scaleNumber(-30)} 0 l0 ${scaleNumber(-137)}`
                        break;
                    case 12:
                        let r12 = 220
                        d = `m ${centerX - scaleNumber(248)} ${centerY - scaleNumber(96)} l${scaleNumber(30)} 0 a${scaleNumber(r12)},${scaleNumber(r12)} 0 0,0 ${scaleNumber(129)},${scaleNumber(136)} l${scaleNumber(-77)} ${scaleNumber(193)} l${scaleNumber(-82)} 0 l0 ${scaleNumber(-330)}`
                        break;
                    case 13:
                        let r13 = 245
                        d = `m ${centerX - scaleNumber(90)} ${centerY + scaleNumber(40)}  a${scaleNumber(r13)},${scaleNumber(r13)} 0 0,0 ${scaleNumber(179)},0 l${scaleNumber(77)} ${scaleNumber(193.5)} l${scaleNumber(-333)} 0 l${scaleNumber(77)} ${scaleNumber(-193)}`
                        break;
                    case 14:
                        let r14 = 220
                        d = `m ${centerX + scaleNumber(219)} ${centerY - scaleNumber(96)} l${scaleNumber(30)} 0 l0 ${scaleNumber(330)} l${scaleNumber(-83)} 0 l${scaleNumber(-77)} ${scaleNumber(-193.5)} a${scaleNumber(r14)},${scaleNumber(r14)} 0 0,0 ${scaleNumber(130)},${scaleNumber(-137)}  `
                        break;
                    case 15:
                        d = `m ${centerX + scaleNumber(219)} ${centerY - scaleNumber(233)}  l${scaleNumber(30)} 0 l0 ${scaleNumber(137)}l${scaleNumber(-30)} 0 l0 ${scaleNumber(-137)}`
                        break;
                }
                coloredZones.push(<Path id={zoneId} d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />)
            }
            //let dRad = `m ${centerX} ${centerY - scaleNumber(180)}  l200 500`
            // let r345 = 5
            //let d345 = `m ${centerX - scaleNumber(160)} ${centerY - scaleNumber(233)} l ${scaleNumber(318)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r345)},${scaleNumber(5.25)} 0 0,1 ${scaleNumber(-318)},0 l0 ${scaleNumber(-56)}`
            //<Path id="zone345" d={d345} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
            let styles = {
                position: "absolute",
                transform: `translate(${-(width / 2)}px, ${-height / 2}px)`,
                zIndex: 0
            }
            return (<div id="inner-imageview-div" style={styles}>
                <Svg className="imageview-child" id="zones-underneath" height={height} width={width} >
                    {coloredZones}
                </Svg>
            </div>)
        }
    }

    function generateZoneLabels(view, inputShots) {
        console.log(`generateZoneLabels(${view})`)
        if (inputShots && view === "Zone") {
            let allZones = mapShotsToZones(inputShots)
            let zoneLabels = []
            let dimensions = getDimensions()
            const height = dimensions.height
            const width = dimensions.width
            let fontSizeFrac = scaleNumber(18)
            let fontSizePerc = scaleNumber(16)
            //let fontWidth = scaleNumber(10 * fontSizeFrac)
            for (let i = 1; i < allZones.length; i++) {
                let divStyles = { position: "absolute", width: "auto", backgroundColor: "transparent", zIndex: 1 }
                let labelFracStyle = {
                    fontSize: fontSizeFrac,
                    margin: "0px",
                }
                let labelPercStyle = {
                    fontSize: fontSizePerc,
                    margin: "0px",
                }
                switch (i) {
                    case 1:
                        divStyles.transform = `translate(0px,${-scaleNumber(215)}px)`
                        break;
                    case 2:
                        divStyles.transform = `translate(0px,${-scaleNumber(120)}px)`
                        break;
                    case 3:
                        divStyles.transform = `translate(${-scaleNumber(115)}px,${-scaleNumber(155)}px)`
                        break;
                    case 4:
                        divStyles.transform = `translate(0px,${-scaleNumber(57)}px)`
                        break;
                    case 5:
                        divStyles.transform = `translate(${scaleNumber(115)}px,${scaleNumber(-155)}px)`
                        break;
                    case 6:
                        divStyles.transform = `translate(${-scaleNumber(185)}px,${-scaleNumber(115)}px)`
                        break;
                    case 7:
                        divStyles.transform = `translate(${-scaleNumber(120)}px,${-scaleNumber(20)}px)`
                        break;
                    case 8:
                        divStyles.transform = `translate(0px,${scaleNumber(20)}px)`
                        break;
                    case 9:
                        divStyles.transform = `translate(${scaleNumber(120)}px,${-scaleNumber(20)}px)`
                        break;
                    case 10:
                        divStyles.transform = `translate(${scaleNumber(185)}px,${-scaleNumber(115)}px)`
                        break;
                    case 11:
                        divStyles.transform = `translate(${scaleNumber(-205)}px,${-scaleNumber(200)}px)`
                        labelFracStyle.textAlign = "left"
                        labelPercStyle.textAlign = "left"
                        break;
                    case 12:
                        divStyles.transform = `translate(${-scaleNumber(165)}px,${scaleNumber(70)}px)`
                        break;
                    case 13:
                        divStyles.transform = `translate(0px,${scaleNumber(100)}px)`
                        break;
                    case 14:
                        divStyles.transform = `translate(${scaleNumber(165)}px,${scaleNumber(70)}px)`
                        break;
                    case 15:
                        divStyles.transform = `translate(${scaleNumber(205)}px,${-scaleNumber(200)}px)`
                        labelFracStyle.textAlign = "right"
                        labelPercStyle.textAlign = "right"
                        break;
                }
                let percent = "0%"
                if (allZones[i][1] !== 0) {
                    percent = (allZones[i][0] * 100 / allZones[i][1]) % 1 === 0 ? `${Number(allZones[i][0] / allZones[i][1] * 100).toFixed(0)}%` : `${Number(allZones[i][0] / allZones[i][1] * 100).toFixed(1)}%`
                }
                zoneLabels.push(<div height={height} width={width} style={divStyles}>
                    <p className="labelFrac" style={labelFracStyle}>{`${allZones[i][0]}/${allZones[i][1]}`}</p>
                    <p className="labelPerc" style={labelPercStyle}>{percent}</p>
                </div>)
            }
            return zoneLabels
        }
        return
    }

    function displayHeat(inputShots) {
        console.log("displayHeat()")
        if (inputShots && inputShots.length !== 0) {
            let allShotsTemp = inputShots.simplesearch ? inputShots.simplesearch : inputShots.advancedsearch
            let allTiles = {}
            for (let x = -250; x <= 250; x++) {
                for (let y = -55; y < 400; y++) {
                    allTiles[`tile_${x}_${y}`] = { x: x, y: y, shotinfo: [0.0, 0.0, 0.0] }
                }
            }
            let shots = allShotsTemp.filter(param => param.y < 400)
            let shotCounter = allShotsTemp.length
            shots.forEach(eachShot => {
                allTiles[`tile_${eachShot.x}_${eachShot.y}`].shotinfo[1] = allTiles[`tile_${eachShot.x}_${eachShot.y}`].shotinfo[1] + 1
                if (eachShot.make === 1) {
                    allTiles[`tile_${eachShot.x}_${eachShot.y}`].shotinfo[0] = allTiles[`tile_${eachShot.x}_${eachShot.y}`].shotinfo[0] + 1
                }
            })
            Object.values(allTiles).forEach(each => {
                if (each.shotinfo[1] !== 0) {
                    each.shotinfo[2] = each.shotinfo[0] / each.shotinfo[1]
                }
            })
            let aSum = 0, bSum = 0, p = 2, offset = 10, maxDistanceBetweenNodes = 30
            let tileValues = {}
            let allKeys = Object.keys(allTiles)
            let counter = 0;
            const delay = ms => new Promise(res => setTimeout(res, ms));
            while (counter < allKeys.length) {
                let tempTile = [allTiles[allKeys[counter]]]
                let tempValue = [allKeys[counter]]
                const idw = async () => {
                    if (tempTile[0].x % offset === 0 && (tempTile[0].y) % offset === 0) {
                        await delay(1)
                        aSum = 0;
                        bSum = 0;
                        let lowerBoundX = tempTile[0].x - maxDistanceBetweenNodes >= -250 ? tempTile[0].x - maxDistanceBetweenNodes : -250
                        let upperBoundX = tempTile[0].x + maxDistanceBetweenNodes < 250 ? tempTile[0].x + maxDistanceBetweenNodes : 249
                        let lowerBoundY = tempTile[0].y - maxDistanceBetweenNodes >= -55 ? tempTile[0].y - maxDistanceBetweenNodes : -55
                        let upperBoundY = tempTile[0].y + maxDistanceBetweenNodes < 400 ? tempTile[0].y + maxDistanceBetweenNodes : 399
                        for (let i = lowerBoundX; i <= upperBoundX; i++) {
                            for (let j = lowerBoundY; j <= upperBoundY; j++) {
                                let calcDistance = getDistance(tempTile[0], allTiles[`tile_${i}_${j}`])
                                if (calcDistance < maxDistanceBetweenNodes && calcDistance > 0) {
                                    aSum = aSum + (allTiles[`tile_${i}_${j}`].shotinfo[1] * calcDistance / Math.pow(calcDistance, p));
                                    bSum = bSum + (1 / Math.pow(calcDistance, p));
                                }
                            }
                        }
                        tileValues[tempValue[0]] = aSum / bSum;
                    }
                }
                idw()
                counter++;
            }

            console.log("HERE")
            const waitHere = async () => {
                console.log("Waiting........")
                await delay(100)
                let maxValue = 0.0
                Object.values(tileValues).forEach(eachValue => {
                    if (eachValue > maxValue) {
                        maxValue = eachValue
                    }
                })
                let heatTileInfo = []
                if (maxValue != 0) {
                    maxValue = maxValue * (500 * 1.0 / shotCounter);
                    let maxCutoff = 0.00004 * shotCounter / maxValue + 0.3065;
                    let diff = maxCutoff / 7;
                    Object.keys(tileValues).forEach(eachTileKey => {
                        let color = "", circleArray = ""
                        let value = tileValues[eachTileKey]
                        if (value > maxValue * (maxCutoff - (diff * 6))) {
                            if (value > maxValue * (maxCutoff - (diff * 6)) && value <= maxValue * (maxCutoff - (diff * 5))) {
                                color = "#bc53f8"
                                circleArray = "1"
                            } else if (value > maxValue * (maxCutoff - (diff * 5)) && value <= maxValue * (maxCutoff - (diff * 4))) {
                                color = "#dd76ff"
                                circleArray = "2"
                            } else if (value > maxValue * (maxCutoff - (diff * 4)) && value <= maxValue * (maxCutoff - (diff * 3))) {
                                color = "#e696fa"
                                circleArray = "3"
                            } else if (value > maxValue * (maxCutoff - (diff * 3)) && value <= maxValue * (maxCutoff - (diff * 2))) {
                                color = "#c4b8ff"
                                circleArray = "4"
                            } else if (value > maxValue * (maxCutoff - (diff * 2)) && value <= maxValue * (maxCutoff - (diff * 1))) {
                                color = "#6bb2f8"
                                circleArray = "5"
                            } else if (value > maxValue * (maxCutoff - (diff * 1)) && value <= maxValue * maxCutoff) {
                                color = "#62c8ff"
                                circleArray = "6"
                            } else {
                                color = "#90ebff"
                                circleArray = "7"
                            }
                            heatTileInfo.push({
                                x: allTiles[eachTileKey].x,
                                y: allTiles[eachTileKey].y,
                                color: color,
                                circleArray: circleArray
                            })
                        }
                    })
                    //heatTileInfo.length === 0 ? setCombinedState({ ...combinedState, allHeatTiles: <div></div> }) : setCombinedState({ ...combinedState, allHeatTiles: heatTileInfo.forEach(each => combinedState.allHeatTiles.push(each)) })
                    heatTileInfo.length === 0 ? setCombinedState({ ...combinedStateRef.current, allHeatTiles: <div></div>, legend: generateLegend("Heat") }) : setCombinedState({ ...combinedStateRef.current, allHeatTiles: heatTileInfo, legend: generateLegend("Heat") })
                }
            }
            waitHere()
        }
    }

    function resizeHeat() {
        console.log("resizeHeat()")
        if (combinedStateRef.current.allHeatTiles.length > 0) {
            chooseCourt("Heat")
            let circlesArray = [[], [], [], [], [], [], []]
            let gradients = []
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            let radius = 25 * height / 470
            combinedStateRef.current.allHeatTiles.forEach(eachHeatTile => {
                let cx = width / 2 + eachHeatTile.x * width / 500
                let cy = height / 2 + eachHeatTile.y * height / 470 - 185 * height / 470
                let circle = <Circle cx={cx} cy={cy} r={radius} fill={`url(#grad_${eachHeatTile.x}_${eachHeatTile.y})`} stroke="none" strokeWidth="3" />
                circlesArray[eachHeatTile.circleArray - 1].push(circle)
                let eachGradient = <RadialGradient id={`grad_${eachHeatTile.x}_${eachHeatTile.y}`} cx={cx} cy={cy} r={radius} fx={cx} fy={cy} gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={eachHeatTile.color} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={eachHeatTile.color} stopOpacity="0" />
                </RadialGradient>
                gradients.push(eachGradient)
            })
            return (<Svg className="imageview-child" height={height} width={width} >
                <Defs>
                    {gradients}
                </Defs>
                {circlesArray[0]}
                {circlesArray[1]}
                {circlesArray[2]}
                {circlesArray[3]}
                {circlesArray[4]}
                {circlesArray[5]}
                {circlesArray[6]}
            </Svg>)
        }
    }

    function generateLegend(view) {
        console.log(`generateLegend(${view})`)
        if (view === "Classic") {
            return <span></span>
        } else {
            let dimensions = getDimensions()
            let height = dimensions.height
            let width = dimensions.width
            let legendWidth = height / 470 * 175
            let legendHeight = height / 470 * 65
            let legendStyle = {
                width: legendWidth,
                height: legendHeight,
                transform: `translate(${width / -2 + legendWidth * 0.55}px,${height / 2 - legendHeight * 0.65}px)`
            }
            let topLabelStyle = { fontSize: height / 470 * 12 }
            let wrapperStyle = { fontSize: height / 470 * 10 }
            switch (view) {
                case "Hex":
                    let sizeLegendStyle = {
                        width: legendWidth * 0.7,
                        height: legendHeight,
                        transform: `translate(${width / 2 - legendWidth * 0.55}px,${height / 2 - legendHeight * 0.65}px)`
                    }
                    let s = width / (500 / squareSizeOrig) / 2 * 1.05
                    let h = s / Math.cos(30 * Math.PI / 180)
                    let tan = Math.tan(30 * Math.PI / 180)
                    let hexArray = [], hexArrayPlain = []
                    let fillMap = ["#7babff", "#8bc9ff", "#aed9ff", "white", "#ff9c9c", "#ff6363", "#fc2121"]
                    let sModSum = 0;
                    for (let i = 0; i < 7; i++) {
                        hexArray.push(<Path d={`m${(2 * s * i + s)} ${s / 2} l${s} ${s * tan} l0 ${h} l${-s} ${s * tan} 
                            l${-s} ${-s * tan} l0 ${-h} l${s} ${-s * tan} l${s} ${s * tan}`} fill={fillMap[i]} opacity="0.7" />)
                        let sMod = s * (0.3 + (i * 0.1))
                        let distance = s * 0.85
                        sModSum += sMod + distance + sMod / 2
                        let modifiedHeight = sMod / Math.cos(30 * Math.PI / 180)
                        hexArrayPlain.push(<Path d={`m${sModSum} ${s / 2 + (s - sMod)} l${sMod} ${sMod * tan} l0 ${modifiedHeight} l${-sMod} ${sMod * tan}
                            l${-sMod} ${-sMod * tan} l0 ${-modifiedHeight} l${sMod} ${-sMod * tan} l${sMod} ${sMod * tan}`} fill="white" opacity="0.7" />)
                    }
                    console.log("Returning Hex")
                    return [(< div id="color-legend" style={legendStyle} >
                        <p className="legend-top-label" style={topLabelStyle} >Shooting Percentage</p>
                        <div width="100%" style={wrapperStyle}>
                            <div className="legend-left-label legend-bottom-label" >Below Avg.</div><div className="legend-right-label legend-bottom-label" >Above Avg.</div>
                        </div>
                        <div className="hex-legend-wrapper" style={{ height: 4 * s }}>
                            <Svg width={14 * s} height={4 * s}>
                                {hexArray}
                            </Svg>
                        </div>
                    </div >), (
                        < div id="size-legend" style={sizeLegendStyle} >
                            <p className="legend-top-label" style={topLabelStyle} >Shot Frequency</p>
                            <div width="100%" style={wrapperStyle}>
                                <div className="legend-left-label legend-bottom-label" >Low</div><div className="legend-right-label legend-bottom-label" >High</div>
                            </div>
                            <div id="size-legend-gradient">
                                <Svg className="svg-size-legend" width={14 * s} height={4 * s}>
                                    {hexArrayPlain}
                                </Svg>
                            </div>
                        </div >)]
                case "Zone":
                    console.log("Returning Zone")
                    return (< div id="color-legend" style={legendStyle} >
                        <p className="legend-top-label" style={topLabelStyle} >Shooting Percentage</p>
                        <div width="100%" style={wrapperStyle}>
                            <div className="legend-left-label legend-bottom-label" >Below Avg.</div><div className="legend-right-label legend-bottom-label" >Above Avg.</div>
                        </div>
                        <div id="color-legend-gradient"></div>
                    </div >)
                case "Heat":
                    console.log("Returning Heat")
                    return (< div id="heat-color-legend" style={legendStyle} >
                        <p className="legend-top-label" style={topLabelStyle} >Shot Frequency</p>
                        <div width="100%" style={wrapperStyle}>
                            <div className="legend-left-label legend-bottom-label" >Low Freq.</div><div className="legend-right-label legend-bottom-label" >High Freq.</div>
                        </div>
                        <div id="heat-legend-gradient"></div>
                    </div>)
            }
        }
    }

    function scaleNumber(number) {
        if (document.getElementById('transparent-court').clientHeight === 0) {
            return number * document.getElementById('transparent-court-on-top').clientHeight / 470
        }
        return number * document.getElementById('transparent-court').clientHeight / 470
    }

    function determineHeight() {
        if (document.getElementById("transparent-court") === null) {
            return 0
        } else {
            return document.getElementById("transparent-court").clientHeight
        }
    }

    function getDimensions() {
        let height = 470
        let width = 500
        let court
        if (document.getElementById("transparent-court") && document.getElementById("transparent-court").clientHeight > 0) {
            court = document.getElementById("transparent-court")
        }
        if (!court && document.getElementById("transparent-court-on-top") && document.getElementById("transparent-court-on-top").clientHeight > 0) {
            court = document.getElementById("transparent-court-on-top")
        }
        if (court) {
            height = court.clientHeight
            width = court.clientWidth
        }
        return {
            height: height,
            width: width
        }
    }

    function makeLoadingAnimation(isLoading, viewType) {
        console.log("makeLoadingAnimation()")
        console.log(`${isLoading}, ${viewType}`)
        //if (true) {
        if (isLoading) {
            let dimensions = getDimensions()
            let height = dimensions.height
            let width = dimensions.width
            /*
            let rEach = height / 70
            let rLarge = height / 12
            let svgDivisor = 4
            let centerX = width / svgDivisor / 2
            let centerY = height / svgDivisor / 2
            function calcCoord(center, radius, angle, useSin) {
                return useSin ? center + (radius * Math.sin(angle * Math.PI / 180)) : center + (radius * Math.cos(angle * Math.PI / 180))
            }
            let circles = []
            let factor = 15
            for (let i = -180; i <= 180; i += 30) {
                let style = {
                    fillOpacity: 1,
                    fill: `rgb(0, 195, 255,${1 - 0.9 * (i / 30 + 6) / 12})`,
                    animationTimingFunction: "ease-in",
                    animationFillMode: "forwards",
                    animationName: "FillIn",
                    animationDuration: `${12 / factor}s`,
                    animationIterationCount: "infinite",
                    animationDelay: `${(i / 30 + 6) / factor}s`
                }
                console.log(style)
                circles.push(<Circle style={style} cx={calcCoord(centerX, rLarge, i, false)} cy={calcCoord(centerY, rLarge, i, true)} r={rEach} ></Circle>)
            }
     
             <Svg margin="auto" width={width / svgDivisor} height={height / svgDivisor} style={{ animation: `spin 4s linear infinite`, opacity: "1" }} >
     
                    </Svg>
            */
            /**
             * <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor="#FFD080" stopOpacity="1" />
                                <Stop offset="1" stopColor="red" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx={width / 10} cy={height / 10} r={height / 10} fill="url(#grad)" ></Circle>
                    
             */

            //let middleCircleR = height / 15
            let centerX = width / 6
            let centerY = height / 6
            // let gap = height / 30
            let innerR1 = height / 30
            let thickness1 = height / 50
            let outerR1 = innerR1 + thickness1
            let innerR2 = height / 16
            let thickness2 = height / 50
            let outerR2 = innerR2 + thickness2
            let innerR3 = height / 11
            let thickness3 = height / 50
            let outerR3 = innerR3 + thickness3
            //style={{ animation: `spin 3s linear infinite`, opacity: "1" }}
            // <Circle cx={centerX} cy={centerY} r={middleCircleR} fill="red" opacity="0.5"></Circle>
            /**
             * <Svg width={width / 3} height={height / 3} style={{ animation: `spin 0.6s linear infinite`, opacity: "1", position: "absolute" }} >
                            <Path d={`m${centerX} ${centerY - innerR1} l0 -${thickness1} a${outerR1},${outerR1} 0 0,1 0,${2 * (innerR1 + thickness1)} l0 ${-thickness1}  a${innerR1},${innerR1} 0 0,0 0,${-2 * innerR1}`} fill="lightblue" stroke="none" strokeWidth="1"></Path>
                        </Svg>
                        <Svg width={width / 3} height={height / 3} style={{ animation: `spin 1s linear infinite`, opacity: "1", position: "absolute" }} >
                            <Path d={`m${centerX} ${centerY - innerR2} l0 -${thickness2} a${outerR2},${outerR2} 0 0,1 0,${2 * (innerR2 + thickness2)} l0 ${-thickness2}  a${innerR2},${innerR2} 0 0,0 0,${-2 * innerR2}`} fill="lightblue" stroke="none" strokeWidth="1"></Path>
                        </Svg>
             */
            //let view = allShotsRef.current.shots === null ? allShotsRef.current.view : combinedState.localViewType.type
            //animation: `spin 0.5s linear infinite`,
            //                            <Path d={`m${centerX} ${centerY - innerR3} l0 -${thickness3} a${outerR3},${outerR3} 0 0,1 0,${2 * (innerR3 + thickness3)} l0 ${-thickness3}  a${innerR3},${innerR3} 0 0,0 0,${-2 * innerR3}`} fill="url(#loading-gradient)" stroke="none" strokeWidth="1"></Path>
            let mapTypesToLoadingDisplay = {
                Classic: "Generating Shots",
                Hex: "Generating Hex Map",
                Zone: "Generating Zones",
                Heat: "Generating Heat Map"
            }
            return (<div id="loadingAnimation" style={{ position: "absolute", backgroundColor: "gray", opacity: "0.8", zIndex: 1, width: width, height: height, textAlign: "center" }}>
                <div style={{ transform: `translate(0px, ${height / 3}px)` }}>
                    <p style={{ fontSize: height / 20, color: "white" }} id="loading-text">{mapTypesToLoadingDisplay[viewType]}</p>
                    <div width="100%" height={height} style={{ position: "absolute", transform: `translate(${width / 2 - centerX}px,0px)` }} >
                        <Svg id="loading-animation" width={width / 3} height={height / 3} style={{ animation: `spin 0.5s linear infinite`, opacity: "1", position: "absolute" }} >
                            <Defs>
                                <linearGradient
                                    id="loading-gradient"
                                    x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0%" stopColor="#bc53f8" stopOpacity="1" />
                                    <Stop offset="18%" stopColor="#dd76ff" stopOpacity="1" />
                                    <Stop offset="36%" stopColor="#e696fa" stopOpacity="1" />
                                    <Stop offset="50%" stopColor="#c4b8ff" stopOpacity="1" />
                                    <Stop offset="69%" stopColor="#6bb2f8" stopOpacity="1" />
                                    <Stop offset="83%" stopColor="#62c8ff" stopOpacity="1" />
                                    <Stop offset="95%" stopColor="#90ebff" stopOpacity="1" />
                                </linearGradient>
                            </Defs>
                            <Path d={`m${centerX + innerR3 * Math.sin(45 * Math.PI / 180)} ${centerY - innerR3 * Math.cos(45 * Math.PI / 180)} 
                            l${thickness3 * Math.sin(45 * Math.PI / 180)} -${thickness3 * Math.cos(45 * Math.PI / 180)} 
                            a${outerR3},${outerR3} 0 1,1 ${-2 * outerR3 * Math.sin(45 * Math.PI / 180)},0 
                            l${thickness3 * Math.sin(45 * Math.PI / 180)} ${thickness3 * Math.cos(45 * Math.PI / 180)}  
                            a${innerR3},${innerR3} 0 1,0 ${2 * innerR3 * Math.sin(45 * Math.PI / 180)},0`} fill="url(#loading-gradient)" stroke="none" strokeWidth="1"></Path>
                        </Svg>
                    </div>
                </div>
            </div >)
        } else {
            return (<span></span>)
        }
    }

    function handleViewTypeButtonClick(viewType) {
        if (!props.isLoading && combinedStateRef.current.localViewType.type !== viewType && !Array.isArray(allShotsRef.current)) {
            console.log(`${viewType} Button Clicked`)
            setCombinedState({ ...combinedStateRef.current, loadingAnimation: makeLoadingAnimation(true, viewType), localViewType: { type: viewType, isOriginal: false } })
        }
    }

    function getDistance(tile1, tile2) {
        return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2));
    }

    function makeClassicIcon() {
        let fill = combinedStateRef.current.localViewType.type === "Classic" ? "rgb(187, 104, 231)" : "white"
        return [<Path d={`m5,17 a30,30 0 0,1 10,-5`} stroke={fill} strokeWidth="1" />,
        <Path d={`m7,22 a30,30 0 0,1 10,-5`} stroke={fill} strokeWidth="1" />,
        <Circle cx="28" cy="12" r="6" fill={fill} strokeWidth="2" />
        ]
    }

    function makeHexagon() {
        let fill = combinedStateRef.current.localViewType.type === "Hex" ? "rgb(187, 104, 231)" : "white"
        let s = 9
        let h = s / Math.cos(30 * Math.PI / 180)
        let tan = Math.tan(30 * Math.PI / 180)
        return <Path d={`m17 5
                        l${s} ${s * tan} l0 ${h} l${-s} ${s * tan} 
                        l${-s} ${-s * tan} l0 ${-h} l${s} ${-s * tan} l${s} ${s * tan}`}
            fill={fill} />
    }

    function makeZoneIcon() {
        let fill = combinedStateRef.current.localViewType.type === "Zone" ? "rgb(187, 104, 231)" : "white"
        let height = 9, xStart = 8, yStart = 5, margin = 2
        return [
            <Rect x={xStart} y={yStart} height={height} width={height} fill={fill}></Rect>,
            <Rect x={xStart + height + margin} y={yStart} height={height} width={height} fill={fill}></Rect>,
            <Rect x={xStart} y={yStart + height + margin} height={height} width={height} fill={fill}></Rect>,
            <Rect x={xStart + height + margin} y={yStart + height + margin} height={height} width={height} fill={fill}></Rect>,
            <Circle cx={xStart + height + margin / 2} cy={yStart + height + margin / 2} r="6" fill="rgb(39, 39, 39)"></Circle>,
            <Circle cx={xStart + height + margin / 2} cy={yStart + height + margin / 2} r="4" fill={fill}></Circle>
        ]
    }

    function makeHeatIcon() {
        let fill = combinedStateRef.current.localViewType.type === "Heat" ? "rgb(187, 104, 231)" : "white"
        let fullHeight = 20, halfHeight = fullHeight / 2, almostHeight = fullHeight * 0.75
        return [
            //<Path d={`m15,25 c-${halfHeight / 4},-${halfHeight / 4} ${halfHeight / 4},-${3 * halfHeight / 4} 0,-${halfHeight}`} strokeWidth="1" stroke="white" fill="transparent"></Path>,
            <Path d={`m10,25 c-${almostHeight / 3},-${almostHeight / 3} ${almostHeight / 3},-${2 * almostHeight / 3} 0,-${almostHeight}`} strokeWidth="2" stroke={fill} fill="transparent"></Path>,
            <Path d={`m20,25 c-${fullHeight / 3},-${fullHeight / 3} ${fullHeight / 3},-${3 * fullHeight / 4} 0,-${fullHeight}`} strokeWidth="2" stroke={fill} fill="transparent"></Path>,
            <Path d={`m30,25 c-${almostHeight / 3},-${almostHeight / 3} ${almostHeight / 3},-${2 * almostHeight / 3} 0,-${almostHeight}`} strokeWidth="2" stroke={fill} fill="transparent"></Path>,
            // <Path d={`m35,25 c-${halfHeight / 4},-${halfHeight / 4} ${halfHeight / 4},-${3 * halfHeight / 4} 0,-${halfHeight}`} strokeWidth="1" stroke="white" fill="transparent"></Path>,
        ]
    }

    function checkForTooManyShots() {
        if (combinedStateRef.current.localViewType.type === "Classic") {
            if (props.isCurrentViewSimple && combinedStateRef.current.allShots.shots && combinedStateRef.current.allShots.shots.simplesearch && combinedStateRef.current.allShots.shots.simplesearch.length > maxClassicShots) {
                return <p><img src={exclam} id="exclam"></img>{`Shot limit reached, displaying first ${maxClassicShots} shots`}</p>
            } else if (!props.isCurrentViewSimple && combinedStateRef.current.allShots.shots && combinedStateRef.current.allShots.shots.advancedsearch && combinedStateRef.current.allShots.shots.advancedsearch.length > maxClassicShots) {
                return <p><img src={exclam} id="exclam"></img>{`Shot limit reached, displaying first ${maxClassicShots} shots`}</p>
            }
        }
        return ""
        //&& combinedStateRef.current.allShots.length > maxClassicShots ?  : ""
    }

    useEffect(() => {
        setCombinedState({ ...combinedStateRef.current, whatToDisplay: generateWhatToDisplay(localViewTypeRef.current.type, allShotsRef.current.shots), legend: generateLegend(combinedStateRef.current.localViewType.type) })
    }, [props.size])

    useEffect(() => {
        console.log(props.isCurrentViewSimple)
        setCombinedState({
            allHexTiles: [],
            allHeatTiles: [],
            hexAverages: props.hexAverages,
            zoneAverages: props.zoneAverages,
            whatToDisplay: [],
            allShots: [],
            localViewType: { type: "Classic", isOriginal: false },
            loadingAnimation: "",
            legend: [],
        })
    }, [props.isCurrentViewSimple])

    useEffect(() => {
        console.log(`useEffect for localViewType`)
        if (!combinedStateRef.current.localViewType.isOriginal) {
            setTimeout(() => {
                console.log(combinedStateRef.current)
                let display = generateWhatToDisplay(combinedStateRef.current.localViewType.type, allShotsRef.current.shots)
                if (typeof (display[0]) !== "undefined") {
                    setCombinedState({
                        ...combinedStateRef.current, whatToDisplay: display,
                        legend: generateLegend(combinedState.localViewType.type)
                    })
                }
            }, 500);
        }
    }, [combinedState.localViewType])

    useEffect(() => {
        console.log("useEffect for props.allSearchData")
        if (Object.keys(props.allSearchData).length !== 0 || props.allSearchData.shots === null) {
            if (Object.keys(props.allSearchData).length !== 0 && props.allSearchData.shots) {
                setCombinedState({
                    ...combinedStateRef.current, allShots: props.allSearchData, allHexTiles: [], allHeatTiles: [],
                    localViewType: { type: props.allSearchData.view, isOriginal: true },
                })
                setTimeout(() => {
                    setCombinedState({
                        ...combinedStateRef.current,
                        whatToDisplay: generateWhatToDisplay(props.allSearchData.view, props.allSearchData.shots),
                        legend: generateLegend(props.allSearchData.view)
                    })
                }, 1500);
            } else {
                setCombinedState({ ...combinedStateRef.current, allHexTiles: [], allHeatTiles: [] })
            }
        } else {
            console.log(combinedStateRef.current)
            console.log(`Switch: ${combinedStateRef.current.localViewType.type}`)
            if (combinedStateRef.current.whatToDisplay.length !== 0) {
                setCombinedState({ ...combinedStateRef.current, allShots: [], whatToDisplay: [], legend: [], localViewType: { type: "Classic", isOriginal: false }, })
                chooseCourt("Classic")
            }
        }
    }, [props.allSearchData])

    useEffect(() => {
        console.log("useEffect for props.isLoading")
        if (props.isLoading.state && props.isLoading.newShots && props.isCurrentViewSimple) {
            setCombinedState({ ...combinedStateRef.current, loadingAnimation: makeLoadingAnimation(props.isLoading.state, props.latestSimpleViewType) })
        } else if (props.isLoading.state && props.isLoading.newShots && !props.isCurrentViewSimple) {
            setCombinedState({ ...combinedStateRef.current, loadingAnimation: makeLoadingAnimation(props.isLoading.state, props.latestAdvancedViewType) })
        } else {
            setCombinedState({ ...combinedStateRef.current, loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [props.isLoading])

    useEffect(() => {
        console.log("useEffect for loadingAnimation")
        //props.setIsLoading({ state: true, newShots: false })
    }, [combinedState.loadingAnimation])

    useEffect(() => {
        console.log("useEffect for props.latestAdvancedViewType")
    }, [props.latestAdvancedViewType])

    useEffect(() => {
        console.log("useEffect for whatToDisplay")
        if (typeof (combinedState.whatToDisplay[0]) !== "undefined" && combinedStateRef.current.whatToDisplay.length !== 0) {
            props.setIsLoading(false)
            setCombinedState({ ...combinedStateRef.current, loadingAnimation: makeLoadingAnimation(false) })
            chooseCourt(combinedStateRef.current.localViewType.type)
        }
    }, [combinedState.whatToDisplay])

    useEffect(() => {
        console.log("useEffect for allHexTiles")
        if (combinedStateRef.current.allHexTiles.length !== 0) {
            props.setIsLoading(false)
            setCombinedState({ ...combinedStateRef.current, whatToDisplay: resizeHex(), loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [combinedState.allHexTiles])

    useEffect(() => {
        console.log("useEffect for allHeatTiles")
        if (combinedStateRef.current.allHeatTiles.length !== 0) {
            props.setIsLoading(false)
            setCombinedState({ ...combinedStateRef.current, whatToDisplay: resizeHeat(), loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [combinedState.allHeatTiles])

    useEffect(() => {
        chooseCourt(combinedStateRef.current.localViewType.type)
    }, [])

    useEffect(() => {
        setCombinedState({ ...combinedStateRef.current, hexAverages: props.hexAverages })
    }, [props.hexAverages])

    useEffect(() => {
        setCombinedState({ ...combinedStateRef.current, zoneAverages: props.zoneAverages })
    }, [props.zoneAverages])

    useEffect(() => {
        console.log(combinedState)
    }, [combinedState])

    useEffect(() => {
        console.log("useEffect for combinedState.allShots")
        console.log(combinedState.allShots)
    }, [combinedState.allShots])

    return (
        <div className='ShotView'>
            <div id="shotview-wrapper">
                <p id="view-title">{props.title}</p>
                <div id="hideable-imageview-div">
                    <div id="imageview-div">
                        <div className="court-image" id="gray-background" height={determineHeight()} >
                            <Svg height="100%" width="100%">
                                <Rect height="100%" width="100%" fill="#2d2d2d"></Rect>
                            </Svg>
                        </div>
                        <img src={transparentCourt} className="court-image" id="transparent-court"></img>
                        <img src={transparentCourt} className="court-image" id="transparent-court-on-top" ></img>
                        {whatToDisplayRef.current}
                        {combinedState.legend}
                        {combinedStateRef.current.loadingAnimation}
                    </div>
                    <br></br>
                    <p id="shotview-warning">{checkForTooManyShots()}</p>
                    <div id="view-switch-buttons-wrapper">
                        <Button className="view-switch-button" id="classic-view-switch-button" style={{ fontSize: props.isMobile ? "14px" : "20px", color: combinedStateRef.current.localViewType.type === "Classic" ? "rgb(187, 104, 231)" : "white" }}
                            onClick={() => handleViewTypeButtonClick("Classic")} >
                            <Svg height="30px" width="35px" >
                                {makeClassicIcon()}
                            </Svg>
                            <br></br>Classic</Button>
                        <Button className="view-switch-button" id="hex-view-switch-button" style={{ fontSize: props.isMobile ? "14px" : "20px", color: combinedStateRef.current.localViewType.type === "Hex" ? "rgb(187, 104, 231)" : "white" }}
                            onClick={() => handleViewTypeButtonClick("Hex")} >
                            <Svg height="30px" width="35px" >
                                {makeHexagon()}
                            </Svg>
                            <br></br>Hex</Button>
                        <Button className="view-switch-button" id="zone-view-switch-button" style={{ fontSize: props.isMobile ? "14px" : "20px", color: combinedStateRef.current.localViewType.type === "Zone" ? "rgb(187, 104, 231)" : "white" }}
                            onClick={() => handleViewTypeButtonClick("Zone")} >
                            <Svg height="30px" width="35px" >
                                {makeZoneIcon()}
                            </Svg>
                            <br></br>Zone</Button>
                        <Button className="view-switch-button" id="heat-view-switch-button" style={{ fontSize: props.isMobile ? "14px" : "20px", color: combinedStateRef.current.localViewType.type === "Heat" ? "rgb(187, 104, 231)" : "white" }}
                            onClick={() => handleViewTypeButtonClick("Heat")} >
                            <Svg height="30px" width="35px" >
                                {makeHeatIcon()}
                            </Svg>
                            <br></br>Heat</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShotView