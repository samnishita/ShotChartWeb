import './ShotView.css'
import tradCourt from './images/newbackcourt.png'
import transparentCourt from './images/transparent.png'
import Svg, {
    Circle,
    Ellipse,
    G,
    Text,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from "react";



//            <div className="rectangle" id="rect12"  >Rectangle</div>

const ShotView = (props) => {
    console.log("UPDATED SHOTVIEW")
    console.log(props.simpleShotData)
    const [currentView, setCurrentView] = useState(props.viewType)
    const currentViewRef = useRef({});
    currentViewRef.current = currentView;

    function displayTraditional() {
        let allShots = props.simpleShotData.simplesearch
        console.log(allShots)
        let tradArray = []
        if (allShots) {
            const height = document.getElementById('court-image').clientHeight
            const width = document.getElementById('court-image').clientWidth
            const heightAltered = height * 1.1
            const widthAltered = width * 1.1
            console.log("height: " + height)
            console.log("width: " + width)
            const rad = 5;
            allShots.forEach(each => {
                let trans = `\"${each.x}, ${each.y}\"`
                if (each.y <= 410) {
                    if (each.make === 1) {
                        tradArray.push(
                            <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                                <Circle cx={widthAltered / 2 + each.x * width / 500} cy={heightAltered / 2 + each.y * height / 470 - 185 * height / 470} r={rad} fill="none" stroke="limegreen" strokeWidth="3" />
                            </Svg>)
                    } else {
                        tradArray.push(
                            <Svg className="imageview-child" height={heightAltered} width={widthAltered} >
                                <Line x1={widthAltered / 2 - rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 + rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth="2" />
                                <Line x1={widthAltered / 2 + rad + each.x * width / 500} y1={heightAltered / 2 - rad + each.y * height / 470 - 185 * height / 470} x2={widthAltered / 2 - rad + each.x * width / 500} y2={heightAltered / 2 + rad + each.y * height / 470 - 185 * height / 470} stroke="red" strokeWidth="2" />
                            </Svg>)
                    }
                }
                //translate="200, 200"
            })
        }
        return tradArray
    }

    function determineView(viewType) {
        console.log("Determining viewtype: " + viewType)
        switch (viewType) {
            case "Traditional":
                console.log("Displaying Traditional")
                return displayTraditional()
            case "Grid":
                console.log("Displaying Grid")
                return displayGrid()
        }

    }
    let gridAverages = ""

    async function displayGrid() {

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
                //allShots.put(coord, info);
            }
        }
        let factor = 0.007;
        console.log(allTiles)
        let shotCounter = 0

        let shots = props.simpleShotData.simplesearch.filter(param => param.y <= 400)
        Object.keys(allTiles).forEach(eachTile => {
            let upperBoundX = allTiles[eachTile].x + 5 + squareSizeOrig * 1.5
            let lowerBoundX = allTiles[eachTile].x + 5 - squareSizeOrig * 1.5
            let upperBoundY = allTiles[eachTile].y + 5 + squareSizeOrig * 1.5
            let lowerBoundY = allTiles[eachTile].y + 5 - squareSizeOrig * 1.5
            //console.log(allTiles[each].y)
            shots.forEach(eachShot => {
                shotCounter++
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
        console.log("tileValues")
        console.log(tileValues)
        //Object.values(allTiles).forEach(each => console.log(each.shotinfo[1]))
        return (<Svg>
            <Rect x="0" y="0" width="100" height="100" fill="black" />
        </Svg>)
    }

    function idwGrid() {

    }

    function getDistance(tile1, tile2) {
        return Math.sqrt(Math.pow(tile1.x - tile2.x, 2) + Math.pow(tile1.y - tile2.y, 2));
    }


    async function getGridAverages() {
        let response = await getSearchData("http://138.68.52.234:8080/shots_request?gridaverages=true")
            .then(res => {
                console.log("getGridAverages")
                console.log(res.gridaverages)
                let averageJson = {}
                res.gridaverages.forEach(each => averageJson[each.uniqueid] = each.average)
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
    useEffect(() => {
        gridAverages = getGridAverages()
    }, [])
    // This will launch only if propName value has chaged.
    useEffect(() => { setCurrentView(props.viewType) }, [props.viewType]);
    /**
     * <Svg height="20" width="20" fill="blue" className="imageview-child" >
                    <Line x1="5" y1="5" x2="15" y2="15" stroke="red" strokeWidth="2" />
                    <Line x1="15" y1="5" x2="5" y2="15" stroke="red" strokeWidth="2" />
                </Svg>
                <Svg height="20" width="20" fill="blue" className="imageview-child">
                    <Circle cx="10" cy="10" r="5" fill="transparent" stroke="limegreen" strokeWidth="2" />
                </Svg>
     */
    return (
        <div className='ShotView'>
            <p>Title Goes Here</p>
            <div id="imageview-div"  >
                <img src={transparentCourt} id="court-image"></img>
                {determineView(currentViewRef.current)}
            </div>
            <br></br>
            <button onClick={event => {
                setCurrentView("Traditional")
            }}>Traditional</button>
            <button onClick={event => determineView("Grid")}>Grid</button>
            <button onClick={event => determineView("Zone")}>Zone</button>
            <button onClick={event => determineView("Heat")}>Heat</button>
        </div>
    )
}
//            <img src={tradCourt} className="court-image"></img>

export default ShotView