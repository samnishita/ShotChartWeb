import './ShotView.css'
import tradCourt from './images/newbackcourt.png'
import transparentCourt from './images/transparent.png'
import newBackcourt from './images/newbackcourt.png'
import Svg, { Circle, Path, Line, Rect } from 'react-native-svg';

import { View, Dimensions, StyleSheet } from 'react-native';
import { useEffect, useState, useRef, useLayoutEffect } from "react";

const ShotView = (props) => {
    const [size, setWindowSize] = useState([window.innerHeight, window.innerWidth])
    const [allGridTiles, setAllGridTiles] = useState([])
    const [gridAverages, setGridAverages] = useState([])
    const [zoneAverages, setZoneAverages] = useState([])
    useEffect(() => { handleResize() }, [size])
    useEffect(() => { window.addEventListener('resize', handleResize) }, [])
    useEffect(() => { setAllGridTiles([]) }, [props.simpleShotData])
    function handleResize() {
        //console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
        if (size[0] !== window.innerHeight || size[1] !== window.innerWidth) {
            console.log("Size Not Okay")
            console.log(`${window.innerHeight}!=${size[0]} OR ${window.innerWidth}!=${size[1]}`)
            setWindowSize([window.innerHeight, window.innerWidth], () => {
                determineView(props.latestSimpleViewType, true)
            })
        } else {
            console.log("Size Okay")
            console.log(`${window.innerHeight}=${size[0]} AND ${window.innerWidth}=${size[1]}`)
        }
    }
    function resizeGrid() {
        console.log(allGridTiles.length > 0)
        if (allGridTiles.length > 0) {
            const height = document.getElementById('court-image').clientHeight
            const width = document.getElementById('court-image').clientWidth
            //console.log(`height: ${height}, width: ${width}`)
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            let squareSize = width / 50;
            let allNewTiles = []
            allGridTiles.forEach(eachTile => {
                /*
                console.log(eachTile.squareSide)
                console.log(eachTile.tileFill)
                console.log(eachTile.x)
                console.log(eachTile.y)
                */
                let squareSide = eachTile.squareSide * squareSize * 0.9
                let tileFill = eachTile.tileFill
                let transX = (eachTile.x + (squareSize - squareSide) / 2) * height / 470
                let transY = (eachTile.y - 175 + (squareSize - squareSide) / 2) * height / 470
                allNewTiles.push(<Svg className="imageview-child grid-tile" height={heightAltered} width={widthAltered}>
                    <Rect x={widthAltered / 2 + transX} y={heightAltered / 2 + transY - 5} width={squareSide} height={squareSide} fill={tileFill} />
                </Svg>)
            })
            return allNewTiles

        }
    }

    console.log("Updating ShotView")
    // console.log(props.simpleShotData)
    //const [currentView, setCurrentView] = useState(props.viewType)

    // const currentViewRef = useRef({});
    //currentViewRef.current = currentView;

    function displayTraditional() {
        console.log("displayTraditional()")
        let allShots = props.simpleShotData.simplesearch
        //console.log(allShots)
        let tradArray = []
        if (allShots) {
            const height = document.getElementById('court-image').clientHeight
            const width = document.getElementById('court-image').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            //console.log("height: " + height)
            // console.log("width: " + width)
            const rad = 5 * height / 470;
            const strokeWidth = 2 * height / 470
            allShots.forEach(each => {
                if (each.y <= 410) {
                    if (each.make === 1) {
                        tradArray.push(
                            <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                                <Circle cx={widthAltered / 2 + each.x * width / 500} cy={heightAltered / 2 + each.y * height / 470 - 185 * height / 470} r={rad} fill="none" stroke="limegreen" strokeWidth={strokeWidth} />
                            </Svg>)
                    } else {
                        tradArray.push(
                            <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                                <Line x1={widthAltered / 2 - rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 + rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />
                                <Line x1={widthAltered / 2 + rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 - rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth={strokeWidth} />
                            </Svg>)
                    }
                }
                //translate="200, 200"
            })
        }
        // console.log("Returning Traditional")
        //console.log(tradArray)
        return tradArray
    }

    function determineView(viewType) {
        console.log("Determining viewtype: " + viewType)
        /*
        if (!shouldResize) {
            switch (viewType) {
                case "Traditional":
                    console.log("Displaying Traditional")
                    return displayTraditional()
                case "Grid":
                    console.log("Displaying Grid")
                    return displayGrid()
                case "Zone":
                    console.log("Displaying Zone")
                    return displayZone()
                case "Heat":
                    console.log("Displaying Heat")
                    return displayHeat()
            }
        } else {
            switch (viewType) {
                case "Traditional":
                    console.log("Resizing Traditional")
                //return displayTraditional()
                case "Grid":
                    console.log("Resizing Grid")
                    return resizeGrid()
                case "Zone":
                    console.log("Resizing Zone")
                //return displayZone()
                case "Heat":
                    console.log("Resizing Heat")
                //return displayHeat()
            }
        }
        /** 
        switch (viewType) {
            case "Traditional":
                console.log("Resizing Traditional")
            //return displayTraditional()
            case "Grid":
                console.log("Resizing Grid")
                return resizeGrid()
            case "Zone":
                console.log("Resizing Zone")
            //return displayZone()
            case "Heat":
                console.log("Resizing Heat")
            //return displayHeat()
        }
        */
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
                console.log("Displaying Heat")
                return displayHeat()
        }
    }

    function displayGrid() {
        //console.log("gridAverages before: ")
        //console.log(gridAverages)
        //console.log(typeof (gridAverages))
        if (props.simpleShotData.simplesearch) {
            //const height = document.getElementById('court-image').clientHeight
            //const width = document.getElementById('court-image').clientWidth
            //console.log(`height: ${height}, width: ${width}`)
            //const heightAltered = height * 1.1
            //const widthAltered = width * 1.1
            let allTiles = {}
            let squareSizeOrig = 10
            for (let j = -55; j < 400; j = j + squareSizeOrig) {
                for (let i = -250; i < 250; i = i + squareSizeOrig) {
                    let tempTile = {}
                    let info = []
                    info.push(0.0);
                    info.push(0.0);
                    info.push(0.0);
                    tempTile.x = i
                    tempTile.y = j
                    tempTile.shotinfo = info;
                    allTiles[`tile_${i}_${j}`] = tempTile
                }
            }
            let factor = 0.007;
            //console.log(allTiles)
            let shots = props.simpleShotData.simplesearch.filter(param => param.y <= 400)
            let shotCounter = props.simpleShotData.simplesearch.length
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
            })
            Object.values(allTiles).forEach(each => {
                if (each.shotinfo[1] !== 0) {
                    each.shotinfo[2] = each.shotinfo[0] / each.shotinfo[1]
                }
            })
            let predictedValue = 0, aSum = 0, bSum = 0, p = 2, value = 0, offset = 10, maxDistanceBetweenNodes = 20, calcDistance = 0;
            let tileValues = {}
            Object.keys(allTiles).forEach(eachTile => {
                if (allTiles[eachTile].x % offset === 0 && (allTiles[eachTile].y - 5) % offset === 0) {
                    aSum = 0;
                    bSum = 0;
                    Object.keys(allTiles).forEach(eachTile2 => {
                        calcDistance = getDistance(allTiles[eachTile], allTiles[eachTile2])
                        if (eachTile !== eachTile2 && calcDistance < maxDistanceBetweenNodes) {
                            value = allTiles[eachTile2].shotinfo[2]
                            aSum = aSum + (value / Math.pow(calcDistance, p));
                            bSum = bSum + (1 / Math.pow(getDistance(allTiles[eachTile], allTiles[eachTile2]), p));
                        }
                    })
                    predictedValue = aSum / bSum;
                    tileValues[eachTile] = predictedValue
                }
            })
            // console.log("tileValues")
            //console.log(tileValues)
            let min = 1;
            let minFactor = 0.00045;
            // console.log("shotCounter: " + shotCounter)
            if (shotCounter * minFactor > 1) {
                min = shotCounter * minFactor;
            } else {
                factor = 4.1008 * Math.pow(shotCounter, -0.798);
            }
            //console.log("factor: " + factor)
            let maxShotsPerMaxSquare = 0;
            maxShotsPerMaxSquare = factor * shotCounter;
            if (maxShotsPerMaxSquare == 0) {
                maxShotsPerMaxSquare = 1;
            }
            //let squareSize = width / 50;
            //let allSquares = []
            let temp, avg;
            let squareElements = []
            //console.log("maxShotsPerMaxSquare: " + maxShotsPerMaxSquare)
            Object.keys(allTiles).forEach(eachTile => {
                let squareSide = 0
                //console.log("allTiles[eachTile].shotinfo[1]: " + allTiles[eachTile].shotinfo[1])
                let eachTileShotCount = allTiles[eachTile].shotinfo[1]
                //console.log("eachTileShotCount: " + eachTileShotCount)
                if (eachTileShotCount < maxShotsPerMaxSquare && eachTileShotCount > min) {
                    squareSide = eachTileShotCount / maxShotsPerMaxSquare
                    //squareSide = eachTileShotCount / maxShotsPerMaxSquare * squareSize * 0.9
                } else if (eachTileShotCount > maxShotsPerMaxSquare) {
                    //squareSide = squareSize * 0.9
                    squareSide = 1
                }
                //console.log("squareSide: " + squareSide)
                temp = "(" + allTiles[eachTile].x + "," + allTiles[eachTile].y + ")";
                avg = gridAverages[temp]
                //console.log("avg: " + avg)
                let tileFill = ""
                //console.log("tileValues[eachTile]: " + tileValues[eachTile])
                if (tileValues[eachTile] > avg + 0.07) {
                    tileFill = "#fc2121"
                    //square.setFill(Color.web("#fc2121"));
                } else if (tileValues[eachTile] > avg + 0.05 && tileValues[eachTile] <= avg + 0.07) {
                    tileFill = "#ff6363"
                    //square.setFill(Color.web("#ff6363"));
                } else if (tileValues[eachTile] > avg + 0.015 && tileValues[eachTile] <= avg + 0.05) {
                    tileFill = "#ff9c9c"
                    //square.setFill(Color.web("#ff9c9c"));
                } else if (tileValues[eachTile] > avg - 0.015 && tileValues[eachTile] <= avg + 0.015) {
                    tileFill = "white"
                    //square.setFill(Color.WHITE);
                } else if (tileValues[eachTile] > avg - 0.05 && tileValues[eachTile] <= avg - 0.015) {
                    tileFill = "#aed9ff"
                    //square.setFill(Color.web("#aed9ff"));
                } else if (tileValues[eachTile] > avg - 0.07 && tileValues[eachTile] <= avg - 0.05) {
                    tileFill = "#8bc9ff"
                    //square.setFill(Color.web("#8bc9ff"));
                } else {
                    tileFill = "#7babff"
                    //square.setFill(Color.web("#7babff"));
                }
                //let opacity = 0.85
                //let transX = (allTiles[eachTile].x + (squareSize - squareSide) / 2) * height / 470
                //let transY = (allTiles[eachTile].y - 175 + (squareSize - squareSide) / 2) * height / 470
                /** 
                allSquares[eachTile] = {
                    squareSide: squareSide,
                    fill: tileFill,
                    transX: transX,
                    transY: transY
                }*/
                //console.log("transX: " + transX)
                //console.log("transY: " + transY)
                /**
                squareElements.push(
                    <Svg className="imageview-child grid-tile" height={heightAltered} width={widthAltered}>
                        <Rect x={widthAltered / 2 + transX} y={heightAltered / 2 + transY - 5} width={squareSide} height={squareSide} fill={tileFill} />
                    </Svg>
                ) */
                squareElements.push({
                    x: allTiles[eachTile].x,
                    y: allTiles[eachTile].y,
                    tileFill: tileFill,
                    squareSide: squareSide
                })
            })
            setAllGridTiles(squareElements)
            //console.log("allGridTiles")
            //console.log(allGridTiles)
            //console.log("Returning Grid")
            //console.log(squareElements)
            //return squareElements
        }
    }

    function getDistance(tile1, tile2) {
        return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2));
    }

    async function getGridAverages() {
        console.log("getGridAverages()")
        //let response = await getSearchData("http://138.68.52.234:8080/shots_request?gridaverages=true")
        let response = await getSearchData("https://customnbashotcharts.com:8443/shots_request?gridaverages=true")
            .then(res => {
                //console.log("getGridAverages")
                //console.log(res.gridaverages)
                let averageJson = {}
                res.gridaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                //console.log(averageJson)
                return averageJson
            })
        return response
    }

    async function getSearchData(url) {
        console.log("Fetching " + url)
        const response = await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                //console.log("URL RESPONSE FROM " + url + ": ")
                //console.log(data)
                return data
            }).catch(error => console.log('error', error))
        return response
    }

    function displayZone() {
        const height = document.getElementById('court-image').clientHeight
        const width = document.getElementById('court-image').clientWidth
        const heightAltered = height * 1.1
        const widthAltered = width * 1.1
        let allShots = props.simpleShotData.simplesearch
        let allZones = []
        for (let i = 0; i < 16; i++) {
            let array = [0, 0, 0]
            allZones.push(array)
        }
        function addShot(i, make) {
            allZones[i][1] = allZones[i][1] + 1
            if (make) { allZones[i][0] = allZones[i][0] + 1 }
        }
        allShots.forEach(eachShot => {
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
        //console.log(allZones)
        let coloredZones = []
        let zoneLabels = []
        let fill = ""
        //console.log(zoneAverages)
        for (let i = 1; i < allZones.length; i++) {
            if (allZones[i][1] === 0) {
                fill = "rgba(178,178,178, 1)"
            } else {
                let diff = allZones[i][2] - zoneAverages[i]
                if (diff > 0.06) {
                    //rect.setFill(Color.web("#fc2121"));
                    fill = "rgba(252,33,33, 1)"
                } else if (diff < 0.06 && diff >= 0.04) {
                    // rect.setFill(Color.web("#ff6363"));
                    fill = "rgba(255,99,99, 1)"
                } else if (diff < 0.04 && diff >= 0.02) {
                    //rect.setFill(Color.web("#ff9c9c"));
                    fill = "rgba(255,156,156, 1)"
                } else if (diff < 0.02 && diff >= -0.02) {
                    //rect.setFill(Color.web("#b2b2b2"));
                    fill = "rgba(178,178,178, 1)"
                } else if (diff < -0.02 && diff >= -0.04) {
                    // rect.setFill(Color.web("#91c6f4"));
                    fill = "rgba(145,198,244, 1)"
                } else if (diff < -0.04 && diff >= -0.06) {
                    // rect.setFill(Color.web("#56b0ff"));
                    fill = "rgba(86,176,255, 1)"
                } else if (diff < -0.06) {
                    //rect.setFill(Color.web("#2373ff"));
                    fill = "rgba(35,115,255, 1)"
                }
            }
            let d = ""
            let zoneId = `zone${i}`
            let centerX = widthAltered / 2
            let centerY = heightAltered / 2
            let strokeWidth = scaleNumber(3)
            let stroke = "rgba(0,0,0,1)"
            let fontSizeFrac = scaleNumber(18)
            let fontSizePerc = scaleNumber(16)
            let fontWidth = scaleNumber(10 * fontSizeFrac)
            let divStyles = {
                position: "absolute",
                width: fontWidth,
                backgroundColor: "transparent"
            }
            let labelFracStyle = {
                fontSize: fontSizeFrac,
                margin: "0px"
            }
            let labelPercStyle = {
                fontSize: fontSizePerc,
                margin: "0px"
            }
            let centerLabelX = centerX - fontWidth / 2
            switch (i) {
                case 1:
                    d = `m ${centerX - scaleNumber(39)} ${centerY - scaleNumber(233)}  l ${scaleNumber(78)} 0 l0 ${scaleNumber(56)} a${scaleNumber(4)},${scaleNumber(3.7)} 0 0,1 ${scaleNumber(-77)},0 l0 ${scaleNumber(-56)}`
                    divStyles.transform = `translate(${centerLabelX}px,${scaleNumber(23)}px)`
                    break;
                case 2:
                    d = `m ${centerX - scaleNumber(80)} ${centerY - scaleNumber(233)} l ${scaleNumber(41)} 0 l0 ${scaleNumber(56)} a${scaleNumber(4)},${scaleNumber(3.7)} 0 0,0 ${scaleNumber(77)},0  l0 ${scaleNumber(-56)} l${scaleNumber(40)} 0 l0 ${scaleNumber(56)}a${scaleNumber(5)},${scaleNumber(5.25)} 0 0,1 ${scaleNumber(-157)},0 l0 ${scaleNumber(-56)}`
                    divStyles.transform = `translate(${centerLabelX}px,${scaleNumber(120)}px)`
                    break;
                case 3:
                    let r3 = 85, r3_2 = 170
                    d = `m ${centerX - scaleNumber(160)} ${centerY - scaleNumber(233)} l ${scaleNumber(81)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r3)},${scaleNumber(r3)} 0 0,0 ${scaleNumber(38.7)},${scaleNumber(71.2)} l${scaleNumber(-41)} ${scaleNumber(73)} a${scaleNumber(r3_2)},${scaleNumber(r3_2)} 0 0,1 ${scaleNumber(-78.6)} ${scaleNumber(-145)}  l0 ${scaleNumber(-56)}`
                    divStyles.transform = `translate(${centerLabelX - scaleNumber(115)}px,${scaleNumber(85)}px)`
                    break;
                case 4:
                    let r4 = 85, r4_2 = 160
                    d = `m ${centerX - scaleNumber(40)} ${centerY - scaleNumber(105)}  a${scaleNumber(r4)},${scaleNumber(r4)} 0 0,0 ${scaleNumber(80)} 0 l${scaleNumber(41)} ${scaleNumber(71.8)} a${scaleNumber(r4_2)},${scaleNumber(r4_2)} 0 0,1 ${scaleNumber(-162)} 0 l${scaleNumber(41)} ${scaleNumber(-73)}`
                    divStyles.transform = `translate(${centerLabelX}px,${scaleNumber(180)}px)`
                    break;
                case 5:
                    let r5 = 85, r5_2 = 170
                    d = `m ${centerX + scaleNumber(78)} ${centerY - scaleNumber(233)} l ${scaleNumber(80)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r5_2)},${scaleNumber(r5_2)} 0 0,1 ${scaleNumber(-77.4)} ${scaleNumber(143.5)} l${scaleNumber(-41)} ${scaleNumber(-72.6)} a${scaleNumber(r5)},${scaleNumber(r5)} 0 0,0 ${scaleNumber(38.7)},${scaleNumber(-71.2)}  l0 ${scaleNumber(-56)}`
                    divStyles.transform = `translate(${centerLabelX + scaleNumber(115)}px,${scaleNumber(85)}px)`
                    break;
                case 6:
                    let r6 = 200
                    d = `m ${centerX - scaleNumber(219)} ${centerY - scaleNumber(233)}  l ${scaleNumber(59)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r6)},${scaleNumber(r6)} 0 0,0 ${scaleNumber(24)},${scaleNumber(88.5)} l${scaleNumber(-60)} ${scaleNumber(40)}  a${scaleNumber(r6)},${scaleNumber(r6)} 0 0,1 ${scaleNumber(-22.75)},${scaleNumber(-48)} l0 ${scaleNumber(-137)}`
                    divStyles.transform = `translate(${centerLabelX - scaleNumber(180)}px,${scaleNumber(130)}px)`
                    break;
                case 7:
                    let r7 = 150, r7_2 = 230
                    d = `m ${centerX - scaleNumber(136)} ${centerY - scaleNumber(89)}  a${scaleNumber(r7)},${scaleNumber(r7)} 0 0,0 ${scaleNumber(80)} ${scaleNumber(68)} l${scaleNumber(-22)} ${scaleNumber(65)} a${scaleNumber(r7_2)},${scaleNumber(r7_2)} 0 0,1 ${scaleNumber(-118)} ${scaleNumber(-92.5)} l${scaleNumber(60)} ${scaleNumber(-40)}`
                    divStyles.transform = `translate(${centerLabelX - scaleNumber(120)}px,${scaleNumber(215)}px)`
                    break;
                case 8:
                    let r8 = 150, r8_2 = 230
                    d = `m ${centerX + scaleNumber(-57)} ${centerY - scaleNumber(21)}  a${scaleNumber(r8)},${scaleNumber(r8)} 0 0,0 ${scaleNumber(113)} 0 l${scaleNumber(21.5)} ${scaleNumber(65)} a${scaleNumber(r8_2)},${scaleNumber(r8_2)} 0 0,1 ${scaleNumber(-155.5)} 0 l${scaleNumber(22)} ${scaleNumber(-65)} `
                    divStyles.transform = `translate(${centerLabelX}px,${scaleNumber(257)}px)`
                    break;
                case 9:
                    let r9 = 150, r9_2 = 230
                    d = `m ${centerX + scaleNumber(135)} ${centerY - scaleNumber(90)} l${scaleNumber(61)} ${scaleNumber(42)} a${scaleNumber(r9_2)},${scaleNumber(r9_2)} 0 0,1 ${scaleNumber(-118)} ${scaleNumber(92.5)} l${scaleNumber(-22)} ${scaleNumber(-66)} a${scaleNumber(r9)},${scaleNumber(r9)} 0 0,0 ${scaleNumber(80)} ${scaleNumber(-70)}  `
                    divStyles.transform = `translate(${centerLabelX + scaleNumber(120)}px,${scaleNumber(215)}px)`
                    break;
                case 10:
                    let r10 = 200
                    d = `m ${centerX + scaleNumber(158)} ${centerY - scaleNumber(233)}  l ${scaleNumber(60.5)} 0 l0 ${scaleNumber(137)} a${scaleNumber(r10)},${scaleNumber(r10)} 0 0,1 ${scaleNumber(-22.75)},${scaleNumber(48)}  l${scaleNumber(-60)} ${scaleNumber(-41.5)}  a${scaleNumber(r10)},${scaleNumber(r10)} 0 0,0 ${scaleNumber(23)},${scaleNumber(-88.5)} l0 ${scaleNumber(-56)}`
                    divStyles.transform = `translate(${centerLabelX + scaleNumber(180)}px,${scaleNumber(130)}px)`
                    break;
                case 11:
                    d = `m ${centerX - scaleNumber(248)} ${centerY - scaleNumber(233)}  l${scaleNumber(30)} 0 l0 ${scaleNumber(137)}l${scaleNumber(-30)} 0 l0 ${scaleNumber(-137)}`
                    divStyles.transform = `translate(${centerLabelX - scaleNumber(215)}px,${scaleNumber(35)}px)`
                    break;
                case 12:
                    let r12 = 220
                    d = `m ${centerX - scaleNumber(248)} ${centerY - scaleNumber(96)} l${scaleNumber(30)} 0 a${scaleNumber(r12)},${scaleNumber(r12)} 0 0,0 ${scaleNumber(129)},${scaleNumber(136)} l${scaleNumber(-77)} ${scaleNumber(193)} l${scaleNumber(-82)} 0 l0 ${scaleNumber(-330)}`
                    divStyles.transform = `translate(${centerLabelX - scaleNumber(170)}px,${scaleNumber(305)}px)`
                    break;
                case 13:
                    let r13 = 245
                    d = `m ${centerX - scaleNumber(90)} ${centerY + scaleNumber(40)}  a${scaleNumber(r13)},${scaleNumber(r13)} 0 0,0 ${scaleNumber(179)},0 l${scaleNumber(77)} ${scaleNumber(193.5)} l${scaleNumber(-333)} 0 l${scaleNumber(77)} ${scaleNumber(-193)}`
                    divStyles.transform = `translate(${centerLabelX}px,${scaleNumber(340)}px)`
                    break;
                case 14:
                    let r14 = 220
                    d = `m ${centerX + scaleNumber(219)} ${centerY - scaleNumber(96)} l${scaleNumber(30)} 0 l0 ${scaleNumber(330)} l${scaleNumber(-83)} 0 l${scaleNumber(-77)} ${scaleNumber(-193.5)} a${scaleNumber(r14)},${scaleNumber(r14)} 0 0,0 ${scaleNumber(130)},${scaleNumber(-137)}  `
                    divStyles.transform = `translate(${centerLabelX + scaleNumber(170)}px,${scaleNumber(305)}px)`
                    break;
                case 15:
                    d = `m ${centerX + scaleNumber(219)} ${centerY - scaleNumber(233)}  l${scaleNumber(30)} 0 l0 ${scaleNumber(137)}l${scaleNumber(-30)} 0 l0 ${scaleNumber(-137)}`
                    divStyles.transform = `translate(${centerLabelX + scaleNumber(215)}px,${scaleNumber(35)}px)`
                    break;
            }
            coloredZones.push(<Path id={zoneId} d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />)
            zoneLabels.push(<div height={heightAltered} width={widthAltered} style={divStyles}>
                <p className="labelFrac" style={labelFracStyle}>{`${allZones[i][0]}/${allZones[i][1]}`}</p>
                <p className="labelPerc" style={labelPercStyle}>{`${Number(allZones[i][0] / allZones[i][1] * 100).toFixed(1)}%`}</p>
            </div>)
        }

        //let dRad = `m ${centerX} ${centerY - scaleNumber(180)}  l200 500`
        // let r345 = 5
        //let d345 = `m ${centerX - scaleNumber(160)} ${centerY - scaleNumber(233)} l ${scaleNumber(318)} 0 l0 ${scaleNumber(56)} a${scaleNumber(r345)},${scaleNumber(5.25)} 0 0,1 ${scaleNumber(-318)},0 l0 ${scaleNumber(-56)}`
        //<Path id="zone345" d={d345} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        let styles = {
            position: "absolute",
            transform: `translate(${-(widthAltered / 2)}px, ${-heightAltered / 2}px)`,
        }
        let styleImage = {
            position: "absolute",
            width: width,
            height: "auto",
            transform: `rotate(180deg) translate(${-(widthAltered - width) / 2}px, ${-(heightAltered - height) / 2}px)`,
        }
        return (
            <div id="inner-imageview-div" style={styles}>
                <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                    {coloredZones}
                </Svg>
                <img src={transparentCourt} style={styleImage}></img>
                {zoneLabels}

            </div>
        )
    }
    async function getZoneAverages() {
        console.log("getZoneAverages()")
        //let response = await getSearchData("http://138.68.52.234:8080/shots_request?zoneaverages=true")
        let response = await getSearchData("https://customnbashotcharts.com:8443/shots_request?zoneaverages=true")
            .then(res => {
                //console.log("getGridAverages")
                //console.log(res.gridaverages)
                let averageJson = {}
                res.zoneaverages.forEach(each => averageJson[each.uniqueid] = each.average)
                //console.log(averageJson)
                return averageJson
            })
        return response
    }
    function displayHeat() {

    }
    function scaleNumber(number) {
        const height = document.getElementById('court-image').clientHeight
        let scaleFactor = height / 470
        return number * scaleFactor
    }

    useEffect(() => {
        getGridAverages().then(res => setGridAverages(res))
        getZoneAverages().then(res => setZoneAverages(res))
    }, [])

    // let d = `m 1 1 l210 380`

    return (
        <div className='ShotView'>
            <p>Title Goes Here</p>
            <div id="imageview-div"  >
                <img src={transparentCourt} id="court-image"></img>
                {determineView(props.latestSimpleViewType)}
            </div>
            <br></br>
            <button onClick={() => props.updateLatestSimpleViewType("Traditional")} >Traditional</button>
            <button onClick={() => props.updateLatestSimpleViewType("Grid")} >Grid</button>
            <button onClick={() => props.updateLatestSimpleViewType("Zone")} >Zone</button>
            <button onClick={() => props.updateLatestSimpleViewType("Heat")} >Heat</button>
        </div>
    )
}

export default ShotView