import './ShotView.css'
import tradCourt from './images/newbackcourt.png'
import transparentCourt from './images/transparent.png'
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

import { useEffect, useState, useRef } from "react";

const ShotView = (props) => {
    console.log("RERENDER ShotView")
    const [size, setWindowSize] = useState([window.innerHeight, window.innerWidth])
    const [allGridTiles, setAllGridTiles] = useState([])
    const [allHeatTiles, setAllHeatTiles] = useState([])
    const [gridAverages, setGridAverages] = useState([])
    const [zoneAverages, setZoneAverages] = useState([])
    const [whatToDisplay, setWhatToDisplay] = useState([])
    const [allShots, setAllShots] = useState()
    const [localViewType, setLocalViewType] = useState({ type: "Traditional", isOriginal: false })
    const [loadingAnimation, setLoadingAnimation] = useState("")
    const [legend, setLegend] = useState([])
    const whatToDisplayRef = useRef([])
    whatToDisplayRef.current = whatToDisplay
    const allShotsRef = useRef({})
    allShotsRef.current = allShots
    const allGridTilesRef = useRef({})
    allGridTilesRef.current = allGridTiles
    const gridAveragesRef = useRef({})
    gridAveragesRef.current = gridAverages
    const allHeatTilesRef = useRef({})
    allHeatTilesRef.current = allHeatTiles
    const zoneAveragesRef = useRef({})
    zoneAveragesRef.current = zoneAverages
    const loadingAnimationRef = useRef({})
    loadingAnimationRef.current = loadingAnimation
    const localViewTypeRef = useRef({})
    localViewTypeRef.current = localViewType

    async function getGridAverages() {
        console.log("getGridAverages()")
        let response = await getSearchData("https://customnbashotcharts.com:8443/shots_request?gridaverages=true")
            .then(res => {
                let averageJson = {}
                res.gridaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                console.log(averageJson)
                return averageJson
            })
        return response
    }

    async function getZoneAverages() {
        console.log("getZoneAverages()")
        let response = await getSearchData("https://customnbashotcharts.com:8443/shots_request?zoneaverages=true")
            .then(res => {
                let averageJson = {}
                res.zoneaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                return averageJson
            })
        return response
    }

    async function getSearchData(url) {
        console.log(`getSearchData(${url})`)
        const response = await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                return data
            }).catch(error => console.log('error', error))
        return response
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
        switch (view) {
            case "Traditional":
                if (typeof (allShotsRef.current) === 'undefined') {
                    showElement("transparent-court")
                    hideElement("trad-court")
                    hideElement("transparent-court-on-top")
                    hideElement("gray-background")
                    console.log("Showing transparent-court")
                } else {
                    showElement("trad-court")
                    hideElement("transparent-court")
                    hideElement("transparent-court-on-top")
                    hideElement("gray-background")
                    console.log("Showing trad-court")
                }
                break;
            case "Grid":
                showElement("transparent-court")
                showElement("gray-background")
                hideElement("trad-court")
                hideElement("transparent-court-on-top")
                console.log("Showing transparent-court & gray-background")
                break;
            case "Heat":
                showElement("transparent-court")
                hideElement("gray-background")
                hideElement("trad-court")
                hideElement("transparent-court-on-top")
                console.log("Showing transparent-court")
                break;
            case "Zone":
                showElement("transparent-court-on-top")
                hideElement("trad-court")
                hideElement("gray-background")
                hideElement("transparent-court")
                console.log("Showing transparent-court-on-top")
                break;
        }
        setLegend(generateLegend())
    }

    function generateWhatToDisplay() {
        let buffer = []
        buffer.push(determineView(localViewTypeRef.current.type))
        let zoneLabels = generateZoneLabels(localViewTypeRef.current.type)
        if (zoneLabels) {
            buffer.push(zoneLabels)
        }
        setWhatToDisplay(buffer)
    }

    function handleResize() {
        console.log("handleResize()")
        if (size[0] !== window.innerHeight || size[1] !== window.innerWidth) {
            console.log("Size Not Okay")
            console.log(`${window.innerHeight}!=${size[0]} OR ${window.innerWidth}!=${size[1]}`)
            setWindowSize([window.innerHeight, window.innerWidth])
            console.log(`Resizing with ${localViewTypeRef.current.type}`)
            generateWhatToDisplay()
        } else {
            console.log("Size Okay")
            console.log(`${window.innerHeight}=${size[0]} AND ${window.innerWidth}=${size[1]}`)
        }
    }

    function determineView(viewType) {
        console.log("Determining viewtype: " + viewType)
        chooseCourt(viewType)
        switch (viewType) {
            case "Traditional":
                console.log("Displaying Traditional")
                return displayTraditional()
            case "Grid":
                if (allGridTiles.length === 0) {
                    console.log("Displaying Grid")
                    displayGrid()
                }
                return resizeGrid()
            case "Zone":
                console.log("Displaying Zone")
                return displayZone()
            case "Heat":
                if (allHeatTiles.length === 0) {
                    console.log("Displaying Heat")
                    displayHeat()
                }
                return resizeHeat()
        }
        return <div></div>
    }

    function displayTraditional() {
        console.log("displayTraditional()")
        let tradArray = []
        if (allShotsRef.current.shots && allShotsRef.current.shots.length !== 0) {
            let searchType = Object.keys(allShotsRef.current.shots)[0]
            let allShotsTemp = allShotsRef.current.shots[searchType]
            const height = document.getElementById('trad-court').clientHeight
            const width = document.getElementById('trad-court').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            const rad = 5 * height / 470;
            const strokeWidth = 2 * height / 470
            let counter = 0;
            allShotsTemp.forEach(each => {
                if (each.y <= 410 && counter < 7500) {
                    if (each.make === 1) {
                        tradArray.push(<Circle cx={widthAltered / 2 + each.x * width / 500} cy={heightAltered / 2 + each.y * height / 470 - 185 * height / 470} r={rad} fill="none" stroke="limegreen" strokeWidth={strokeWidth} />)
                    } else {
                        tradArray.push(<Line x1={widthAltered / 2 - rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 + rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />)
                        tradArray.push(<Line x1={widthAltered / 2 + rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 - rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />)
                    }
                    counter++;
                }
            })
            let styles = {
                position: "absolute",
                transform: `translate(${-(widthAltered / 2)}px, ${-heightAltered / 2}px)`,
            }
            return (<div id="inner-imageview-div" style={styles}>
                <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                    {tradArray}
                </Svg>
            </div>)
        }
        return tradArray
    }
    const squareSizeOrig = 15

    function displayGrid() {
        console.log("displayGrid()")
        if (allShotsRef.current.shots && allShotsRef.current.shots.length !== 0) {
            let allShotsTemp = allShotsRef.current.shots.simplesearch ? allShotsRef.current.shots.simplesearch : allShotsRef.current.shots.advancedsearch
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
            let aSum = 0, bSum = 0, p = 2, offset = 10, maxDistanceBetweenNodes = squareSizeOrig, calcDistance = 0;
            let tileValues = {}
            let min = 1, minFactor = 0.00045;
            if (shotCounter * minFactor > 1) {
                min = shotCounter * minFactor;
            } else {
                factor = 4.1008 * Math.pow(shotCounter, -0.798);
            }
            let maxShotsPerMaxSquare = 0;
            maxShotsPerMaxSquare = factor * shotCounter;
            if (maxShotsPerMaxSquare == 0) {
                maxShotsPerMaxSquare = 1;
            }
            let temp, avg;
            let squareElements = []
            Object.keys(allTiles).forEach(eachTile => {
                if (Math.round(allTiles[eachTile].x / squareSizeOrig) * squareSizeOrig % (offset / 2) === 0 && (allTiles[eachTile].y) % (offset / 2) === 0) {
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
                    temp = "(" + (Math.round(allTiles[eachTile].x / 10) * 10) + "," + (allTiles[eachTile].y % 2 === 0 ? allTiles[eachTile].y + 5 : allTiles[eachTile].y) + ")";
                    avg = gridAveragesRef.current[temp]
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
            setAllGridTiles(squareElements)
        }
    }

    function resizeGrid() {
        console.log("resizeGrid()")
        if (allGridTilesRef.current.length > 0) {
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            let squareSize = width / (500 / squareSizeOrig);
            let allNewTiles = []
            allGridTilesRef.current.forEach(eachTile => {
                let squareSide = eachTile.squareSide * squareSize
                if (squareSide !== 0) {
                    let s = squareSide / 2 * 1.05
                    let h = s / Math.cos(30 * Math.PI / 180)
                    let tan = Math.tan(30 * Math.PI / 180)
                    let moveX = (eachTile.y + 5) % 10 === 0 ? widthAltered / 2 + (eachTile.x + squareSizeOrig * 1.1547005 / 2) * height / 470 : widthAltered / 2 + (eachTile.x) * height / 470
                    let moveY = heightAltered / 2 + (eachTile.y - 175 - squareSide / 2) * height / 470 - 5
                    allNewTiles.push(<Path d={`m${moveX} ${moveY} 
                    l${s} ${s * tan} l0 ${h} l${-s} ${s * tan} 
                    l${-s} ${-s * tan} l0 ${-h} l${s} ${-s * tan} l${s} ${s * tan}`}
                        fill={eachTile.tileFill} opacity="0.7" />)
                }
            })
            return (<Svg className="imageview-child grid-tile" height={heightAltered} width={widthAltered}>
                {allNewTiles}
            </Svg>)
        }
    }

    function mapShotsToZones() {
        console.log("mapShotsToZones()")
        if (allShotsRef.current.shots && allShotsRef.current.shots.length !== 0) {
            let allZones = []
            for (let i = 0; i < 16; i++) {
                allZones.push([0, 0, 0])
            }
            function addShot(i, make) {
                allZones[i][1] = allZones[i][1] + 1
                if (make) { allZones[i][0] = allZones[i][0] + 1 }
            }
            let allShotsTemp = allShotsRef.current.shots.simplesearch ? allShotsRef.current.shots.simplesearch : allShotsRef.current.shots.advancedsearch
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

    function displayZone() {
        console.log("displayZone()")
        if (allShotsRef.current) {
            let allZones = mapShotsToZones()
            let coloredZones = []
            let fill = ""
            const height = document.getElementById('transparent-court-on-top').clientHeight
            const width = document.getElementById('transparent-court-on-top').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            for (let i = 1; i < allZones.length; i++) {
                if (allZones[i][1] === 0) {
                    //fill = "rgba(178,178,178, 1)"
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
                        //fill = "gray"
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
                let centerX = widthAltered / 2
                let centerY = heightAltered / 2
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
                transform: `translate(${-(widthAltered / 2)}px, ${-heightAltered / 2}px)`,
                zIndex: 0
            }
            return (<div id="inner-imageview-div" style={styles}>
                <Svg className="imageview-child" id="zones-underneath" height={heightAltered} width={widthAltered} >
                    {coloredZones}
                </Svg>
            </div>)
        }
    }

    function generateZoneLabels(view) {
        console.log(`generateZoneLabels(${view})`)
        if (allShotsRef.current && view === "Zone") {
            let allZones = mapShotsToZones()
            let zoneLabels = []
            const height = document.getElementById('transparent-court-on-top').clientHeight
            const width = document.getElementById('transparent-court-on-top').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            let fontSizeFrac = scaleNumber(18)
            let fontSizePerc = scaleNumber(16)
            let fontWidth = scaleNumber(10 * fontSizeFrac)
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
                zoneLabels.push(<div height={heightAltered} width={widthAltered} style={divStyles}>
                    <p className="labelFrac" style={labelFracStyle}>{`${allZones[i][0]}/${allZones[i][1]}`}</p>
                    <p className="labelPerc" style={labelPercStyle}>{percent}</p>
                </div>)
            }
            return zoneLabels
        }
        return
    }

    function displayHeat() {
        console.log("displayHeat()")
        if (allShotsRef.current.shots && allShotsRef.current.shots.length !== 0) {
            let allShotsTemp = allShotsRef.current.shots.simplesearch ? allShotsRef.current.shots.simplesearch : allShotsRef.current.shots.advancedsearch
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
            let aSum = 0, bSum = 0, p = 2, offset = 15, maxDistanceBetweenNodes = 30
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
                if (heatTileInfo.length === 0) {
                    setAllHeatTiles(<div></div>)
                } else {
                    setAllHeatTiles(heatTileInfo)
                }
            }
        }
    }

    function resizeHeat() {
        console.log("resizeHeat()")
        if (allHeatTiles.length > 0) {
            let circles1 = [], circles2 = [], circles3 = [], circles4 = [], circles5 = [], circles6 = [], circles7 = []
            let gradients = []
            const height = document.getElementById('transparent-court').clientHeight
            const width = document.getElementById('transparent-court').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            let radius = 25 * height / 470
            allHeatTiles.forEach(eachHeatTile => {
                let cx = widthAltered / 2 + eachHeatTile.x * width / 500
                let cy = heightAltered / 2 + eachHeatTile.y * height / 470 - 185 * height / 470
                let circle = <Circle cx={cx} cy={cy} r={radius} fill={`url(#grad_${eachHeatTile.x}_${eachHeatTile.y})`} stroke="none" strokeWidth="3" />
                switch (eachHeatTile.circleArray) {
                    case "1":
                        circles1.push(circle)
                        break;
                    case "2":
                        circles2.push(circle)
                        break;
                    case "3":
                        circles3.push(circle)
                        break;
                    case "4":
                        circles4.push(circle)
                        break;
                    case "5":
                        circles5.push(circle)
                        break;
                    case "6":
                        circles6.push(circle)
                        break;
                    case "7":
                        circles7.push(circle)
                        break;
                }
                let eachGradient = <RadialGradient id={`grad_${eachHeatTile.x}_${eachHeatTile.y}`} cx={cx} cy={cy} r={radius} fx={cx} fy={cy} gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={eachHeatTile.color} stopOpacity="0.8" />
                    <Stop offset="1" stopColor={eachHeatTile.color} stopOpacity="0" />
                </RadialGradient>
                gradients.push(eachGradient)
            })
            return (<Svg className="imageview-child" height={height * 1.1} width={width * 1.1} >
                <Defs>
                    {gradients}
                </Defs>
                {circles1}
                {circles2}
                {circles3}
                {circles4}
                {circles5}
                {circles6}
                {circles7}
            </Svg>)
        }
        return <div></div>
    }

    function generateLegend() {
        if (localViewTypeRef.current.type === "Traditional") {
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
            switch (localViewTypeRef.current.type) {
                case "Grid":
                    let sizeLegendStyle = {
                        width: legendWidth * 0.7,
                        height: legendHeight,
                        transform: `translate(${width / 2 - legendWidth * 0.55}px,${height / 2 - legendHeight * 0.65}px)`
                    }
                    let s = width / (500 / squareSizeOrig) / 2 * 1.05
                    let h = s / Math.cos(30 * Math.PI / 180)
                    let tan = Math.tan(30 * Math.PI / 180)
                    let hexArray = [], hexArrayPlain = []
                    let fillMap = {
                        1: "#7babff",
                        2: "#8bc9ff",
                        3: "#aed9ff",
                        4: "white",
                        5: "#ff9c9c",
                        6: "#ff6363",
                        7: "#fc2121"
                    }
                    let sModSum = 0;
                    for (let i = 0; i < 7; i++) {
                        hexArray.push(<Path d={`m${(2 * s * i + s)} ${s / 2} l${s} ${s * tan} l0 ${h} l${-s} ${s * tan} 
                            l${-s} ${-s * tan} l0 ${-h} l${s} ${-s * tan} l${s} ${s * tan}`} fill={fillMap[i + 1]} opacity="0.7" />)
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
        if (!court && document.getElementById("trad-court") && document.getElementById("trad-court").clientHeight > 0) {
            court = document.getElementById("trad-court")
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

    function makeLoadingAnimation() {
        console.log("makeLoadingAnimation()")
        //if (true) {
        if (props.isLoading) {
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
            console.log(localViewType.type)
            let view = allShotsRef.current.shots === null ? allShotsRef.current.view : localViewType.type
            return (<div id="loadingAnimation" style={{ position: "absolute", backgroundColor: "gray", opacity: "0.8", zIndex: 1, width: width, height: height, textAlign: "center" }}>
                <div style={{ transform: `translate(0px, ${height / 3}px)` }}>
                    <p>Loading {view}</p>
                    <div width="100%" height={height} style={{ position: "absolute", transform: `translate(${width / 2 - centerX}px,0px)` }} >
                        <Svg width={width / 3} height={height / 3} style={{ animation: `spin 1s linear infinite`, opacity: "1", position: "absolute" }} >
                            <Path d={`m${centerX} ${centerY - innerR3} l0 -${thickness3} a${outerR3},${outerR3} 0 0,1 0,${2 * (innerR3 + thickness3)} l0 ${-thickness3}  a${innerR3},${innerR3} 0 0,0 0,${-2 * innerR3}`} fill="white" stroke="none" strokeWidth="1"></Path>
                        </Svg>
                    </div>

                </div>
            </div >)
        } else {
            return (<span></span>)
        }
    }

    function handleViewTypeButtonClick(viewType) {
        if (!props.isLoading && localViewType.type !== viewType && allShotsRef.current) {
            console.log(`${viewType} Button Clicked`)
            setLocalViewType({ type: viewType, isOriginal: false })
        }
    }

    function getDistance(tile1, tile2) {
        return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2));
    }

    useEffect(() => {
        console.log(`useEffect for localViewType`)
        //Initial case
        if (!allShotsRef.current && whatToDisplay.length === 0) {

        }//Click button after running search
        else if (allShotsRef.current.shots && !props.isLoading) {
            props.setIsLoading(true)
        } else if (allShotsRef.current.shots && allShotsRef.current.length !== 0 && props.isLoading) {
            setWhatToDisplay([])
        } else if (allShotsRef.current.length === 0 && props.isLoading) {
            setLoadingAnimation(makeLoadingAnimation())
        }
    }, [localViewType])

    useEffect(() => {
        console.log("useEffect for props.allSearchData")
        setAllShots(props.allSearchData)
        if (Object.keys(props.allSearchData).length !== 0 || props.allSearchData.shots === null) {
            setAllGridTiles([])
        }
    }, [props.allSearchData])

    useEffect(() => {
        console.log("useEffect for props.isLoading")
        if (props.isLoading) {
            setWhatToDisplay([])
        } else {
            setLoadingAnimation(makeLoadingAnimation())
        }
    }, [props.isLoading])

    useEffect(() => {
        console.log("useEffect for loadingAnimation")
        setTimeout(() => {
            console.log("TIMEOUT")
            if (allShotsRef.current && allShotsRef.current.length !== 0 && whatToDisplay.length === 0) {
                generateWhatToDisplay()
            }
        }, 100)
    }, [loadingAnimation])

    useEffect(() => {
        console.log("useEffect for props.latestAdvancedViewType")
    }, [props.latestAdvancedViewType])

    useEffect(() => {
        console.log("useEffect (adding eventlistener)")
        window.addEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        console.log("useEffect for whatToDisplay")
        if (allShotsRef.current && allShotsRef.current.shots !== null && whatToDisplay.length !== 0) {
            if (typeof (whatToDisplay) === 'object') {
                props.setIsLoading(false)
            }
            //Switching view of current shots
        } else if (allShotsRef.current && whatToDisplay.length === 0) {
            if (props.isLoading) {
                setLoadingAnimation(makeLoadingAnimation())
            } else {
                console.log("Setting isLoading to true from useEffect(whatToDisplay)")
                props.setIsLoading(true)
            }
        } else {
            chooseCourt(localViewType.type)
        }
    }, [whatToDisplay])

    useEffect(() => {
        console.log("useEffect for allGridTiles")
        if (allGridTiles.length !== 0) {
            setWhatToDisplay(resizeGrid())
        } else {
            setAllHeatTiles([])
        }
    }, [allGridTiles])

    useEffect(() => {
        console.log("useEffect for allHeatTiles")
        if (allHeatTiles.length !== 0) {
            setWhatToDisplay(resizeHeat())
        } else {
            if (allShotsRef.current && allShotsRef.current.length !== 0) {
                setLocalViewType({ type: allShotsRef.current.view, isOriginal: true })
            } else if (allShotsRef.current && allShotsRef.current.length === 0 && !props.isCurrentViewSimple) {
                setLocalViewType({ type: props.latestAdvancedViewType, isOriginal: true })
            }
        }
    }, [allHeatTiles])

    useEffect(() => {
        getGridAverages().then(res => setGridAverages(res))
        getZoneAverages().then(res => setZoneAverages(res))
        setLocalViewType(makeLoadingAnimation())
    }, [])

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
                <img src={tradCourt} className="court-image" id="trad-court" ></img>
                <img src={transparentCourt} className="court-image" id="transparent-court-on-top" ></img>
                {whatToDisplayRef.current}
                {legend}
                {loadingAnimation}
            </div>
            <br></br>
            <button className="view-switch-button" onClick={() => handleViewTypeButtonClick("Traditional")} >Traditional</button>
            <button className="view-switch-button" onClick={() => handleViewTypeButtonClick("Grid")} >Grid</button>
            <button className="view-switch-button" onClick={() => handleViewTypeButtonClick("Zone")} >Zone</button>
            <button className="view-switch-button" onClick={() => handleViewTypeButtonClick("Heat")} >Heat</button>
        </div>
    )
}

export default ShotView