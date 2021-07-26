import './AdvancedSearchBox.css'
import SelectionViewer from './SelectionViewer'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path } from 'react-native-svg';

const AdvancedSearchBox = (props) => {
    console.log("RERENDER AdvancedSearchBox")
    const [latestAdvancedViewType, setLatestAdvancedViewType] = useState(props.latestAdvancedViewType)
    const [shotPercentageData, setShotPercentageData] = useState({})

    useEffect(() => {
        console.log("useEffect for props.allSearchParameters")
    }, [props.allSearchParameters])

    const relevantTeams = {
        "Atlanta Hawks": 1610612737,
        "Boston Celtics": 1610612738,
        "Brooklyn Nets": 1610612751,
        "Charlotte Hornets": 1610612766,
        "Chicago Bulls": 1610612741,
        "Cleveland Cavaliers": 1610612739,
        "Dallas Mavericks": 1610612742,
        "Denver Nuggets": 1610612743,
        "Detroit Pistons": 1610612765,
        "Golden State Warriors": 1610612744,
        "Houston Rockets": 1610612745,
        "Indiana Pacers": 1610612754,
        "Los Angeles Clippers": 1610612746,
        "Los Angeles Lakers": 1610612747,
        "Memphis Grizzlies": 1610612763,
        "Miami Heat": 1610612748,
        "Milwaukee Bucks": 1610612749,
        "Minnesota Timberwolves": 1610612750,
        "New Orleans Pelicans": 1610612740,
        "New York Knicks": 1610612752,
        "Oklahoma City Thunder": 1610612760,
        "Orlando Magic": 1610612753,
        "Philadelphia 76ers": 1610612755,
        "Phoenix Suns": 1610612756,
        "Portland Trail Blazers": 1610612757,
        "Sacramento Kings": 1610612758,
        "San Antonio Spurs": 1610612759,
        "Toronto Raptors": 1610612761,
        "Utah Jazz": 1610612762,
        "Washington Wizards": 1610612764,
        "Adelaide 36ers": 15019,
        "Alba Berlin": 12323,
        "Beijing Ducks": 15021,
        "FC Barcelona": 12304,
        "Fenerbahce": 12321,
        "Flamengo": 12325,
        "Franca": 12332,
        "Maccabi Haifa": 93,
        "Maccabi Tel Aviv": 12401,
        "Melbourne United": 15016,
        "Montepaschi Siena": 12322,
        "New Zealand Breakers": 15020,
        "Olimpia Milano": 94,
        "Real Madrid": 12315,
        "San Lorenzo": 12330,
        "Shanghai Sharks": 12329,
        "Sydney Kings": 15015
    }
    const courtAreas = ["Restricted Area", "In The Paint (Non-RA)", "Mid-Range",
        "Left Corner 3", "Right Corner 3", "Above the Break 3", "Backcourt"]
    const courtSides = ["Left", "Left-Center", "Center",
        "Right-Center", "Right", "Back Court"]
    const mapIdsToSearchParams = {
        "year-advanced-dd-begin": "beginSeason",
        "year-advanced-dd-end": "endSeason",
        "player-advanced-dd": "allSelectedPlayers",
        "season-advanced-dd": "allSelectedSeasonTypes",
        "distance-begin": "beginDistance",
        "distance-end": "endDistance",
        "success": "shotSuccess",
        "shot-value": "shotValue",
        "shot-types": "allSelectedShotTypes",
        "shooting-teams": "allSelectedTeams",
        "home-teams": "allSelectedHomeTeams",
        "away-teams": "allSelectedAwayTeams",
        "court-areas": "allSelectedCourtAreas",
        "court-sides": "allSelectedCourtSides",
    }
    const initPlayersRef = useRef({});
    initPlayersRef.current = props.initPlayers;
    const allSearchParametersRef = useRef({});
    allSearchParametersRef.current = props.allSearchParameters;
    const initPlayersReverseMapRef = useRef({});
    initPlayersReverseMapRef.current = props.initPlayersReverseMap;
    const initPlayersSortedRef = useRef({});
    initPlayersSortedRef.current = Object.values(initPlayersRef.current).map(value => `${value[1]} ${value[2]}`.trim().toUpperCase()).sort((a, b) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    })

    function createDropDown(className) {
        console.log(`createDropDown(${className})`)
        switch (className) {
            case "year-advanced-dd-begin":
            case "year-advanced-dd-end":
                return createYearDropDown(className)
            case "player-advanced-dd":
                return createPlayerDropDown(className)
            case "season-advanced-dd":
                return [createMultipleSelectionDD(className, "Preseason"), createMultipleSelectionDD(className, "Regular Season"), createMultipleSelectionDD(className, "Playoffs")]
            case "distance-begin":
            case "distance-end":
                let distances = []
                for (let i = 0; i < 89; i++) {
                    distances.push(createSingleSelectionDD(className, i))
                }
                return distances
            case "success":
                return [createSingleSelectionDD(className, "Makes"), createSingleSelectionDD(className, "Misses")]
            case "shot-value":
                return [createSingleSelectionDD(className, "2PT"), createSingleSelectionDD(className, "3PT")]
            case "shot-types":
                return props.shotTypes.map(shotType => createMultipleSelectionDD(className, shotType))
            case "shooting-teams":
            case "home-teams":
            case "away-teams":
                return Object.keys(relevantTeams).map(key => createMultipleSelectionDD(className, key))
            case "court-areas":
                return courtAreas.map(courtArea => createMultipleSelectionDD(className, courtArea))
            case "court-sides":
                return courtSides.map(courtSide => createMultipleSelectionDD(className, courtSide))
        }
    }

    function createSingleSelectionDD(className, display) {
        return <p className={`dropdown-item ${className}`} onClick={event => props.setAllSearchParameters({ ...props.allSearchParameters, [className]: event.target.textContent })}>{display}</p>
    }

    function createMultipleSelectionDD(className, display) {
        return <p className={`dropdown-item ${className}`} onClick={event => checkIfExistsInArray(className, display)}>{display}</p>
    }

    function checkIfExistsInArray(key, value) {
        if (!allSearchParametersRef.current[key].includes(value)) {
            props.setAllSearchParameters({ ...allSearchParametersRef.current, [key]: [...allSearchParametersRef.current[key], value] })
        }
    }

    function createYearDropDown(inputClassName) {
        console.log(`createYearDropDown(${inputClassName})`)
        let year = Number(props.currentYear.substring(0, 4)), subYearString, elements = []
        for (let eachYear = year; eachYear >= 1996; eachYear--) {
            subYearString = (eachYear - 1899) % 100 < 10 ? subYearString = "0" + (eachYear - 1899) % 100 : subYearString = "" + (eachYear - 1899) % 100
            elements.push(createSingleSelectionDD(inputClassName, `${eachYear}-${subYearString}`))
        }
        return elements
    }

    function createPlayerDropDown(inputClassName) {
        console.log(`createPlayerDropDown(${inputClassName})`)
        let elements = []
        Object.values(initPlayersRef.current).forEach(value => {
            elements.push(<p className='dropdown-item player-display'
                id={`${value[1]} ${value[2]}`.trim().toUpperCase()
                } playerid={value[0]}
                onClick={() => checkIfExistsInArray(inputClassName, `${value[1]} ${value[2]}`.trim())}>{`${value[1]} ${value[2]}`.trim()}</p>)
        })
        elements.sort((a, b) => {
            if (a.props.id < b.props.id) { return -1; }
            if (a.props.id > b.props.id) { return 1; }
            return 0;
        })
        return elements
    }

    function makeButton(name, descriptor) {
        console.log(`makeButton(${name}, ${descriptor}`)
        if (props.allSearchParameters[descriptor] && props.allSearchParameters[descriptor].length !== 0) {
            if (Array.isArray(props.allSearchParameters[descriptor])) {
                name = props.allSearchParameters[descriptor][props.allSearchParameters[descriptor].length - 1]
            } else {
                name = props.allSearchParameters[descriptor]
            }
        }
        let scrollable = "scrollable"
        if (descriptor === "season-advanced-dd" || descriptor === "success" || descriptor === "shot-value") {
            scrollable = ""
        }
        return <button className={`dropdown-button ${descriptor}`} id={`${descriptor}-button`} onClick={(e) => { props.handleDDButtonClick(e, descriptor) }}>
            <span className={`dropdown-button-display ${descriptor}`}>{name}</span>
            <span className={`arrow ${descriptor}`}>
                <Svg className={`arrow-svg ${descriptor}`} height="20" width="20">
                    <Path className={`arrow-path ${descriptor}`} d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                    </Path>
                </Svg>
            </span>
            <div className={`dropdown-content ${scrollable}`} id={descriptor}>
                {createDropDown(descriptor)}
            </div>
        </button>
    }
    async function runAdvancedSearch() {
        console.log("runAdvancedSearch()")
        let url = `https://customnbashotcharts.com:8443/shots_request_advanced?`
        let urlBuilder = ""
        let isMoreThanOne = false
        Object.keys(allSearchParametersRef.current).forEach(eachKey => {
            if (Array.isArray(allSearchParametersRef.current[eachKey])) {
                allSearchParametersRef.current[eachKey].forEach(eachValue => {
                    if (eachKey === "player-advanced-dd") {
                        urlBuilder = urlBuilder + mapIdsToSearchParams[eachKey] + "=" + props.initPlayers[eachValue][0]
                    } else if (eachKey === "shooting-teams" || eachKey === "home-teams" || eachKey === "away-teams") {
                        urlBuilder = urlBuilder + mapIdsToSearchParams[eachKey] + "=" + relevantTeams[eachValue]
                    } else {
                        urlBuilder = urlBuilder + mapIdsToSearchParams[eachKey] + "=" + eachValue
                    }
                    isMoreThanOne = true
                    if (isMoreThanOne) {
                        urlBuilder = urlBuilder + "&"
                    }
                })
            } else {
                if (allSearchParametersRef.current[eachKey] !== "") {
                    urlBuilder = urlBuilder + mapIdsToSearchParams[eachKey] + "=" + allSearchParametersRef.current[eachKey]
                    isMoreThanOne = true
                    if (isMoreThanOne) {
                        urlBuilder = urlBuilder + "&"
                    }
                }
            }
        })
        if (urlBuilder !== "") {
            props.setTitle("Custom Search")
            url = url + urlBuilder
            console.log(url)
            props.setAllSearchData({ shots: null, view: latestAdvancedViewType })
            props.updateLatestAdvancedViewType(latestAdvancedViewType)
            setTimeout(async () => {
                await fetch(url, {
                    method: 'GET'
                }).then(res => res.json())
                    .then(data => {
                        console.log(data)
                        props.setAllSearchData({
                            shots: data,
                            view: latestAdvancedViewType
                        })
                        setShotPercentageData(data)
                    })
            }, 300)
        }
    }

    useEffect(() => {
        let classes = ""
        if (typeof (props.keyPressedBuilder.id) === 'string') {
            classes = props.keyPressedBuilder.id
        } else if (props.keyPressedBuilder.id !== null) {
            classes = props.keyPressedBuilder.id.baseVal
        }
        if (classes.indexOf('player-advanced-dd') !== -1) {
            let latestArray = initPlayersSortedRef.current
            for (let i = 0; i < props.keyPressedBuilder.builder.length; i++) {
                let tempArray = []
                latestArray.forEach(eachPlayer => {
                    if (eachPlayer.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1))) {
                        tempArray.push(eachPlayer)
                    }
                })
                if (tempArray.length !== 0) {
                    latestArray = tempArray
                }
            }
            let result = latestArray[0]
            document.getElementById(result).parentNode.scrollTop = document.getElementById(result).offsetTop;
        } else if (classes.indexOf('year-advanced-dd') !== -1) {
            let year = Number(props.currentYear.substring(0, 4));
            let subYearString, years = []
            while (year >= 1996) {
                if ((year - 1899) % 100 < 10) {
                    subYearString = "0" + (year - 1899) % 100;
                } else {
                    subYearString = "" + (year - 1899) % 100;
                }
                years.push(year + "-" + subYearString)
                year--;
            }
            for (let i = 0; i < props.keyPressedBuilder.builder.length; i++) {
                let tempArray = []
                years.forEach(eachYear => {
                    if (eachYear.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1))) {
                        tempArray.push(eachYear)
                    }
                })
                if (tempArray.length !== 0) {
                    years = tempArray
                }
            }
            let yearResult = years[0]
            document.getElementById(yearResult).scrollIntoView({ behavior: 'auto' })
        }
    }, [props.keyPressedBuilder])

    const selectionViewerRef = useRef({})
    selectionViewerRef.current = <SelectionViewer allSearchParameters={allSearchParametersRef.current} setAllSearchParameters={props.setAllSearchParameters} />
    return (
        <div className="AdvancedSearchBox">
            <div className="search-box-body">
                <div className='search-box-inner-body'>
                    <h6 className="choose-parameters-label">Choose your search filters</h6>
                    <div id='selection-scrollable'>
                        <p>Seasons: {makeButton("Begin", "year-advanced-dd-begin")} - {makeButton("End", "year-advanced-dd-end")}</p>
                        <p>Players: {makeButton("Choose Players", "player-advanced-dd")}</p>
                        <p>Season Types: {makeButton("Choose Season Types", "season-advanced-dd")}</p>
                        <p>Shot Distance (ft.): {makeButton("Begin", "distance-begin")} - {makeButton("End", "distance-end")}</p>
                        <p>Shot Success: {makeButton("Choose Makes or Misses", "success")}</p>
                        <p>Shot Value: {makeButton("Choose 2PT or 3PT", "shot-value")}</p>
                        <p>Shot Types: {makeButton("Choose Shot Types", "shot-types")}</p>
                        <p>Shooting Teams: {makeButton("Choose Teams", "shooting-teams")}</p>
                        <p>Home Teams: {makeButton("Choose Home Teams", "home-teams")}</p>
                        <p>Away Teams: {makeButton("Choose Away Teams", "away-teams")}</p>
                        <p>Court Areas: {makeButton("Choose Court Areas", "court-areas")}</p>
                        <p>Sides of Court: {makeButton("Choose Sides of Court", "court-sides")}</p>
                    </div>
                    <button className="dropdown-button static-button" onClick={e => props.handleDDButtonClick(e, "view-selection-dd")}>
                        <span className="dropdown-button-display">{latestAdvancedViewType}</span>
                        <span className="arrow">
                            <Svg className="arrow-svg" height="20" width="20">
                                <Path className="arrow-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content" id="view-selection-dd">
                            <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Traditional</p>
                            <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Grid</p>
                            <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Zone</p>
                            <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Heat</p>
                        </div></button>

                    <button className="static-button" id="run-advanced-search-button" onClick={() => runAdvancedSearch()}>Run It</button>
                    <br></br>
                    <p id="current-selections">Current Selections: </p>
                    {selectionViewerRef.current}
                </div>
            </div>
            <ShotPercentageView advancedShotData={shotPercentageData} isCurrentViewSimple={props.isCurrentViewSimple} />
        </div>
    )
}

export default AdvancedSearchBox