import './ShotView.css'
import tradCourt from './images/newbackcourt.png'
import transparentCourt from './images/transparent.png'
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

import { useEffect, useState, useRef } from "react";

const ShotView = (props) => {
    console.log("RERENDER ShotView")
    const [combinedState, setCombinedState] = useState({
        allHexTiles: [],
        allHeatTiles: [],
        hexAverages: [],
        zoneAverages: [],
        whatToDisplay: [],
        allShots: [],
        localViewType: { type: "Classic", isOriginal: false },
        loadingAnimation: "",
        legend: [],
    })
    const whatToDisplayRef = useRef([])
    whatToDisplayRef.current = combinedState.whatToDisplay
    const allShotsRef = useRef({})
    allShotsRef.current = combinedState.allShots
    const allHexTilesRef = useRef({})
    allHexTilesRef.current = combinedState.allHexTiles
    const hexAveragesRef = useRef({})
    hexAveragesRef.current = combinedState.hexAverages
    const allHeatTilesRef = useRef({})
    allHeatTilesRef.current = combinedState.allHeatTiles
    const zoneAveragesRef = useRef({})
    zoneAveragesRef.current = combinedState.zoneAverages
    const loadingAnimationRef = useRef({})
    loadingAnimationRef.current = combinedState.loadingAnimation
    const localViewTypeRef = useRef({})
    localViewTypeRef.current = combinedState.localViewType

    async function getHexAverages() {
        console.log("getHexAverages()")
        return await getSearchData("https://customnbashotcharts.com:8443/shots_request?gridaverages=true")
            .then(res => {
                let averageJson = {}
                res.gridaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                return averageJson
            })
    }

    async function getZoneAverages() {
        console.log("getZoneAverages()")
        return await getSearchData("https://customnbashotcharts.com:8443/shots_request?zoneaverages=true")
            .then(res => {
                let averageJson = {}
                res.zoneaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                return averageJson
            })
    }

    async function getSearchData(url) {
        console.log(`getSearchData(${url})`)
        return await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                return data
            }).catch(error => console.log('error', error))
    }

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
        chooseCourt(viewType)
        switch (viewType) {
            case "Classic":
                console.log("Displaying Classic")
                return displayClassic(shots)
            case "Hex":
                if (combinedState.allHexTiles.length === 0) {
                    console.log("Displaying Hex")
                    displayHex(shots)
                }
                return resizeHex()
            case "Zone":
                console.log("Displaying Zone")
                return displayZone(shots)
            case "Heat":
                if (combinedState.allHeatTiles.length === 0) {
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
                if (each.y <= 410 && counter < 7500) {
                    if (each.make === 1) {
                        tradArray.push(<Circle cx={width / 2 + each.x * width / 500} cy={height / 2 + each.y * height / 470 - 185 * height / 470} r={rad} fill="none" stroke="limegreen" strokeWidth={strokeWidth} />)
                    } else {
                        tradArray.push(<Line x1={width / 2 - rad + each.x * width / 500} y1={height / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={width / 2 + rad + each.x * width / 500} y2={height / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />)
                        tradArray.push(<Line x1={width / 2 + rad + each.x * width / 500} y1={height / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={width / 2 - rad + each.x * width / 500} y2={height / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />)
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
            setCombinedState({ ...combinedState, allHexTiles: squareElements.forEach(each => combinedState.allHexTiles.push(each)) })
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
            const height = document.getElementById('transparent-court-on-top').clientHeight
            const width = document.getElementById('transparent-court-on-top').clientWidth
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
                    margin: "0px"
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
            while (counter < allKeys.length) {
                if (allTiles[allKeys[counter]].x % offset === 0 && (allTiles[allKeys[counter]].y) % offset === 0) {
                    aSum = 0;
                    bSum = 0;
                    let lowerBoundX = allTiles[allKeys[counter]].x - maxDistanceBetweenNodes >= -250 ? allTiles[allKeys[counter]].x - maxDistanceBetweenNodes : -250
                    let upperBoundX = allTiles[allKeys[counter]].x + maxDistanceBetweenNodes < 250 ? allTiles[allKeys[counter]].x + maxDistanceBetweenNodes : 249
                    let lowerBoundY = allTiles[allKeys[counter]].y - maxDistanceBetweenNodes >= -55 ? allTiles[allKeys[counter]].y - maxDistanceBetweenNodes : -55
                    let upperBoundY = allTiles[allKeys[counter]].y + maxDistanceBetweenNodes < 400 ? allTiles[allKeys[counter]].y + maxDistanceBetweenNodes : 399
                    for (let i = lowerBoundX; i <= upperBoundX; i++) {
                        for (let j = lowerBoundY; j <= upperBoundY; j++) {
                            let calcDistance = getDistance(allTiles[allKeys[counter]], allTiles[`tile_${i}_${j}`])
                            if (calcDistance < maxDistanceBetweenNodes && calcDistance > 0) {
                                aSum = aSum + (allTiles[`tile_${i}_${j}`].shotinfo[1] * calcDistance / Math.pow(calcDistance, p));
                                bSum = bSum + (1 / Math.pow(calcDistance, p));
                            }
                        }
                    }
                    tileValues[allKeys[counter]] = aSum / bSum;
                }
                counter++;
            }
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
                heatTileInfo.length === 0 ? setCombinedState({ ...combinedState, allHeatTiles: <div></div> }) : setCombinedState({ ...combinedState, allHeatTiles: heatTileInfo.forEach(each => combinedState.allHeatTiles.push(each)) })
            }
        }
    }

    function resizeHeat() {
        console.log("resizeHeat()")
        if (combinedState.allHeatTiles.length > 0) {
            let circlesArray = [[], [], [], [], [], [], []]
            let gradients = []
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            let radius = 25 * height / 470
            combinedState.allHeatTiles.forEach(eachHeatTile => {
                let cx = width / 2 + eachHeatTile.x * width / 500
                let cy = height / 2 + eachHeatTile.y * height / 470 - 185 * height / 470
                let circle = <Circle cx={cx} cy={cy} r={radius} fill={`url(#grad_${eachHeatTile.x}_${eachHeatTile.y})`} stroke="none" strokeWidth="3" />
                circlesArray[eachHeatTile.circleArray - 1].push(circle)
                let eachGradient = <RadialGradient id={`grad_${eachHeatTile.x}_${eachHeatTile.y}`} cx={cx} cy={cy} r={radius} fx={cx} fy={cy} gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={eachHeatTile.color} stopOpacity="0.4" />
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
        return <div></div>
    }

    function generateLegend(view) {
        if (view === "Classic") {
            return <div></div>
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
                    return [(< div id="color-legend" style={legendStyle} >
                        <p className="legend-top-label" style={topLabelStyle} >Shooting Percentage</p>
                        <div width="100%" style={wrapperStyle}>
                            <div className="legend-left-label legend-bottom-label" >Below Avg.</div><div className="legend-right-label legend-bottom-label" >Above Avg.</div>
                        </div>
                        <div >
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
                    return (< div id="color-legend" style={legendStyle} >
                        <p className="legend-top-label" style={topLabelStyle} >Shooting Percentage</p>
                        <div width="100%" style={wrapperStyle}>
                            <div className="legend-left-label legend-bottom-label" >Below Avg.</div><div className="legend-right-label legend-bottom-label" >Above Avg.</div>
                        </div>
                        <div id="color-legend-gradient"></div>
                    </div >)
                case "Heat":
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

            return (<div id="loadingAnimation" style={{ position: "absolute", backgroundColor: "gray", opacity: "0.8", zIndex: 1, width: width, height: height, textAlign: "center" }}>
                <div style={{ transform: `translate(0px, ${height / 3}px)` }}>
                    <p style={{ fontSize: height / 20 }} id="loading-text">Generating {viewType}</p>
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
        if (!props.isLoading && combinedState.localViewType.type !== viewType && allShotsRef.current) {
            console.log(`${viewType} Button Clicked`)
            setCombinedState({ ...combinedState, loadingAnimation: makeLoadingAnimation(true, viewType), localViewType: { type: viewType, isOriginal: false } })
        }
    }

    function getDistance(tile1, tile2) {
        return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2));
    }

    useEffect(() => {
        console.log(props.size)
        setCombinedState({ ...combinedState, whatToDisplay: generateWhatToDisplay(localViewTypeRef.current.type, allShotsRef.current.shots), legend: generateLegend(combinedState.localViewType.type) })
    }, [props.size])

    useEffect(() => {
        console.log(props.isCurrentViewSimple)
        setCombinedState({
            ...combinedState, whatToDisplay: [], legend: [], allShots: []
        })
    }, [props.isCurrentViewSimple])

    useEffect(() => {
        console.log(`useEffect for localViewType`)
        if (!combinedState.localViewType.isOriginal) {
            setCombinedState({
                ...combinedState, whatToDisplay: generateWhatToDisplay(combinedState.localViewType.type,
                    allShotsRef.current.shots), legend: generateLegend(combinedState.localViewType.type)
            })
        }
    }, [combinedState.localViewType])

    useEffect(() => {
        console.log("useEffect for props.allSearchData")
        console.log(props.allSearchData.shots)
        if (Object.keys(props.allSearchData).length !== 0 || props.allSearchData.shots === null) {
            if (Object.keys(props.allSearchData).length !== 0) {
                setCombinedState({
                    ...combinedState, allShots: props.allSearchData, allHexTiles: [], allHeatTiles: [],
                    localViewType: { type: props.allSearchData.view, isOriginal: true }, loadingAnimation: makeLoadingAnimation(false),
                    whatToDisplay: generateWhatToDisplay(props.allSearchData.view, props.allSearchData.shots),
                    legend: generateLegend(props.allSearchData.view)
                })
                chooseCourt(props.allSearchData.view)
            } else {
                setCombinedState({ ...combinedState, allHexTiles: [], allHeatTiles: [] })
            }
        }
    }, [props.allSearchData])

    useEffect(() => {
        console.log("useEffect for props.isLoading")
        if (props.isLoading.state && props.isLoading.newShots && props.isCurrentViewSimple) {
            setCombinedState({ ...combinedState, loadingAnimation: makeLoadingAnimation(props.isLoading.state, props.latestSimpleViewType) })
        } else if (props.isLoading.state && props.isLoading.newShots && !props.isCurrentViewSimple) {
            setCombinedState({ ...combinedState, loadingAnimation: makeLoadingAnimation(props.isLoading.state, props.latestAdvancedViewType) })
        } else {
            setCombinedState({ ...combinedState, loadingAnimation: makeLoadingAnimation(false) })
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
        if (combinedState.whatToDisplay.length !== 0) {
            props.setIsLoading(false)
            setCombinedState({ ...combinedState, loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [combinedState.whatToDisplay])

    useEffect(() => {
        console.log("useEffect for allHexTiles")
        if (combinedState.allHexTiles.length !== 0) {
            setCombinedState({ ...combinedState, whatToDisplay: resizeHex(), loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [combinedState.allHexTiles])

    useEffect(() => {
        console.log("useEffect for allHeatTiles")
        if (combinedState.allHeatTiles.length !== 0) {
            setCombinedState({ ...combinedState, whatToDisplay: resizeHeat(), loadingAnimation: makeLoadingAnimation(false) })
        }
    }, [combinedState.allHeatTiles])

    useEffect(() => {
        let func = async () => {
            let hexAvg
            await getHexAverages().then(res => hexAvg = res)
            let zoneAvg
            await getZoneAverages().then(res => zoneAvg = res)
            setCombinedState({ ...combinedState, hexAverages: hexAvg, zoneAverages: zoneAvg })
        }
        func()
        chooseCourt(combinedState.localViewType.type)
    }, [])

    useEffect(() => {
        console.log(combinedState)
    }, [combinedState])

    return (
        <div className='ShotView'>
            <p id="view-title">{props.title}</p>
            <div id="imageview-div">
                <div className="court-image" id="gray-background" height={determineHeight()} >
                    <Svg height="100%" width="100%">
                        <Rect height="100%" width="100%" fill="#505050"></Rect>
                    </Svg>
                </div>
                <img src={transparentCourt} className="court-image" id="transparent-court"></img>
                <img src={transparentCourt} className="court-image" id="transparent-court-on-top" ></img>
                {whatToDisplayRef.current}
                {combinedState.legend}
                {combinedState.loadingAnimation}
            </div>
            <br></br>
            <button className="view-switch-button" style={combinedState.localViewType.type === "Classic" ? { borderBottom: "2px solid rgba(107, 208, 248, 1)" } : {}} onClick={() => handleViewTypeButtonClick("Classic")} >Classic</button>
            <button className="view-switch-button" style={combinedState.localViewType.type === "Hex" ? { borderBottom: "2px solid rgba(107, 208, 248, 1)" } : {}} onClick={() => handleViewTypeButtonClick("Hex")} >Hex</button>
            <button className="view-switch-button" style={combinedState.localViewType.type === "Zone" ? { borderBottom: "2px solid rgba(107, 208, 248, 1)" } : {}} onClick={() => handleViewTypeButtonClick("Zone")} >Zone</button>
            <button className="view-switch-button" style={combinedState.localViewType.type === "Heat" ? { borderBottom: "2px solid rgba(107, 208, 248, 1)" } : {}} onClick={() => handleViewTypeButtonClick("Heat")} >Heat</button>
        </div>
    )
}

export default ShotView