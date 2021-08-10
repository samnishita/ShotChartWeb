import './AdvancedSearchBox.css'
import SelectionViewer from './SelectionViewer'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path } from 'react-native-svg';
import TextareaAutosize from 'react-textarea-autosize';
import 'antd/dist/antd.css';
import { Switch } from 'antd';

const AdvancedSearchBox = (props) => {
    console.log("RERENDER AdvancedSearchBox")
    const [latestAdvancedViewType, setLatestAdvancedViewType] = useState(props.latestAdvancedViewType)
    const [invisibleRows, setInvisibleRows] = useState(1)
    const [displayAdvancedSearchSelections, setDisplayAdvancedSearchSelections] = useState(true)

    useEffect(() => {
        console.log("useEffect for props.allSearchParameters")
    }, [props.allSearchParameters])

    useEffect(() => {
        window.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                console.log("SPACEBAR")
                event.preventDefault();
            }
        });
    }, [])

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
        "distance-dd-begin": "beginDistance",
        "distance-dd-end": "endDistance",
        "success-dd": "shotSuccess",
        "shot-value-dd": "shotValue",
        "shot-types-dd": "allSelectedShotTypes",
        "shooting-teams-dd": "allSelectedTeams",
        "home-teams-dd": "allSelectedHomeTeams",
        "away-teams-dd": "allSelectedAwayTeams",
        "court-areas-dd": "allSelectedCourtAreas",
        "court-sides-dd": "allSelectedCourtSides",
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
        switch (className) {
            case "year-advanced-dd-begin":
            case "year-advanced-dd-end":
                return createYearDropDown(className)
            case "player-advanced-dd":
                return createPlayerDropDown(className)
            case "season-advanced-dd":
                return [createMultipleSelectionDD(className, "Preseason"), createMultipleSelectionDD(className, "Regular Season"), createMultipleSelectionDD(className, "Playoffs")]
            case "distance-dd-begin":
            case "distance-dd-end":
                let distances = []
                for (let i = 0; i < 89; i++) {
                    distances.push(createSingleSelectionDD(className, i, className + "-" + i))
                }
                return distances
            case "success-dd":
                return [createSingleSelectionDD(className, "Makes"), createSingleSelectionDD(className, "Misses")]
            case "shot-value-dd":
                return [createSingleSelectionDD(className, "2PT"), createSingleSelectionDD(className, "3PT")]
            case "shot-types-dd":
                return props.shotTypes.map(shotType => createMultipleSelectionDD(className, shotType, shotType.replace(/ /g, "-").toLowerCase()))
            case "shooting-teams-dd":
            case "home-teams-dd":
            case "away-teams-dd":
                return Object.keys(relevantTeams).map(key => createMultipleSelectionDD(className, key, className.replace("teams-dd", "") + key.replace(/ /g, "-").toLowerCase()))
            case "court-areas-dd":
                return courtAreas.map(courtArea => createMultipleSelectionDD(className, courtArea))
            case "court-sides-dd":
                return courtSides.map(courtSide => createMultipleSelectionDD(className, courtSide))
        }
    }

    function createSingleSelectionDD(className, display, id) {
        return <p className={`dropdown-item ${className}`} id={id} onClick={event => props.setAllSearchParameters({ ...props.allSearchParameters, [className]: event.target.textContent })}>{display}</p>
    }

    function createMultipleSelectionDD(className, display, id) {
        return <p className={`dropdown-item ${className}`} id={id} onClick={event => checkIfExistsInArray(className, display)}>{display}</p>
    }

    function checkIfExistsInArray(key, value) {
        if (!allSearchParametersRef.current[key].includes(value)) {
            props.setAllSearchParameters({ ...allSearchParametersRef.current, [key]: [...allSearchParametersRef.current[key], value] })
        }
    }

    function createYearDropDown(inputClassName) {
        console.log(`createYearDropDown(${inputClassName})`)
        return generateYears(props.currentYear).map(eachYear => createSingleSelectionDD(inputClassName, eachYear, eachYear))
    }

    function createPlayerDropDown(inputClassName) {
        console.log(`createPlayerDropDown(${inputClassName})`)
        return Object.values(initPlayersRef.current).map(value =>
            <p className='dropdown-item player-display'
                id={`${value[1]} ${value[2]}`.trim().toUpperCase()
                } playerid={value[0]}
                onClick={() => checkIfExistsInArray(inputClassName, `${value[1]} ${value[2]}`.trim())}>{`${value[1]} ${value[2]}`.trim()}</p>
        ).sort((a, b) => {
            if (a.props.id < b.props.id) { return -1; }
            if (a.props.id > b.props.id) { return 1; }
            return 0;
        })
    }

    function handleKeyPress(event, id) {
        let newString = event.target.value
        //builds string
        if (event.keyCode === 8) {
            newString = newString.substring(0, newString.length - 1)
        } else if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 32 || event.keyCode === 222 || event.keyCode === 189) {
            newString += event.key
        } else if (event.key === 'Enter') {
            event.preventDefault()
            props.handleDDButtonClick(event, `${id}-dd`)
        }
        //Close drowdown and set search parameter
        if (event.key === 'Enter') {
            handleTextInput(id, newString, event.key === 'Enter')
        }
        props.setTextAreaText({ id: id, text: newString })
    }

    function handleTextInput(id, builtString, isKeyEnter) {
        switch (id) {
            case "year-advanced-dd-begin":
            case "year-advanced-dd-end":
                return searchDropDown(generateYears(props.currentYear), builtString, isKeyEnter, false, id)
            case "player-advanced-dd":
                return searchDropDown(initPlayersSortedRef.current.map(eachPlayer => eachPlayer.toUpperCase()), builtString, isKeyEnter, true, id)
            case "distance-dd-begin":
            case "distance-dd-end":
                let distanceArray = []
                for (let i = 0; i < 89; i++) {
                    distanceArray.push(i + "")
                }
                return searchDropDown(distanceArray, builtString, isKeyEnter, false, id)
            case "shot-types-dd":
                return searchDropDown(props.shotTypes.map(eachShotType => eachShotType.toUpperCase()), builtString, isKeyEnter, true, id)
            case "shooting-teams-dd":
            case "home-teams-dd":
            case "away-teams-dd":
                return searchDropDown(Object.keys(relevantTeams).map(each => each.toUpperCase()), builtString, isKeyEnter, true, id)
        }
    }

    function generateYears(currentYear) {
        let year = Number(currentYear.substring(0, 4)), subYearString
        let elements = []
        for (let eachYear = year; eachYear >= 1996; eachYear--) {
            subYearString = (eachYear - 1899) % 100 < 10 ? subYearString = "0" + (eachYear - 1899) % 100 : subYearString = "" + (eachYear - 1899) % 100
            elements.push(eachYear + "-" + subYearString)
        }
        return elements
    }

    function searchDropDown(inputArray, inputText, isFinal, isMultiSelect, id) {
        let found = true;
        for (let i = 0; i < inputText.length; i++) {
            let tempArray = inputArray.filter(eachItem => eachItem.startsWith(inputText.substring(0, i + 1).toUpperCase()))
            if (tempArray.length !== 0) {
                inputArray = tempArray
            } else {
                found = false
            }
        }
        let result = inputArray[0]
        let elementId = result
        switch (id) {
            case "distance-dd-begin":
            case "distance-dd-end":
                elementId = id + "-" + result
                break;
            case "shot-types-dd":
                elementId = result.replace(/ /g, "-").toLowerCase()
                break;
            case "shooting-teams-dd":
            case "home-teams-dd":
            case "away-teams-dd":
                elementId = id.replace("teams-dd", "") + result.replace(/ /g, "-").toLowerCase()
                break;
        }
        if (document.getElementById(elementId)) {
            document.getElementById(elementId).parentNode.scrollTop = document.getElementById(elementId).offsetTop;
            let disp = result
            if (id === "player-advanced-dd") {
                disp = initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][1] + " " + initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][2]
            } else if (id === "distance-begin-dd" || id === "distance-end-dd" || id === "shot-types-dd" || id.includes("teams")) {
                disp = document.getElementById(elementId).textContent
            }
            if (isFinal && !isMultiSelect) {
                props.setAllSearchParameters({ ...props.allSearchParameters, [id]: disp })
            } else if (isFinal && isMultiSelect) {
                checkIfExistsInArray(id, disp)
            }
            return found ? inputText + disp.substring(inputText.length, disp.length) : inputText
        }
    }

    function handleButtonClick(event, id) {
        props.setTextAreaText({ id: id, text: "" })
        props.handleDDButtonClick(event, `${id}`)
    }

    useEffect(() => {
        if (document.getElementById("player-button-display-invisible") && Number.parseInt(document.getElementById("player-button-display-invisible").clientHeight / 20) !== invisibleRows) {
            console.log(invisibleRows)
            setInvisibleRows(Number.parseInt(document.getElementById("player-button-display-invisible").clientHeight / 20))
        }
    })

    function makeButton(id, suffix, scrollable, placeholder) {
        let fullId = suffix !== "" ? id + "-dd-" + suffix : id + "-dd"
        let whatToShow = placeholder
        //Display latest search parameter if applicable
        if (props.allSearchParameters[fullId] && props.allSearchParameters[fullId].length !== 0) {
            if (Array.isArray(props.allSearchParameters[fullId])) {
                whatToShow = props.allSearchParameters[fullId][props.allSearchParameters[fullId].length - 1]
            } else {
                whatToShow = props.allSearchParameters[fullId]
            }
        }
        //If dropdown is showing, set display text to the text input
        if (document.getElementById(fullId) && document.getElementById(fullId).classList.contains("show") && scrollable && !id.includes("court")) {
            whatToShow = props.textAreaText.text
        }
        //If dropdown is showing and there is text input, display autofill
        let value = ""
        if (props.textAreaText.text.length !== 0 && document.getElementById(fullId) && document.getElementById(fullId).classList.contains("show")) {
            value = handleTextInput(fullId, props.textAreaText.text, false)
        }
        let width = "70%"
        /*
        if (document.getElementById(`${fullId}-button`) && document.getElementById(`${fullId}-button`).clientWidth) {
            width = document.getElementById(`${fullId}-button`).clientWidth * 0.7
        }*/
        let rangeButtonClass = suffix !== "" ? "range-button" : ""
        let minRows = 1
        if (document.getElementById(fullId) && document.getElementById(fullId).classList.contains("show")) {
            minRows = invisibleRows
        }
        let willShowTextArea = scrollable && !id.includes("court")
        let arrowOffset = willShowTextArea ? 0 : 10
        let buttonFace2 = willShowTextArea ? <TextareaAutosize spellcheck="false" minRows={minRows}
            className={`dropdown-button-display ${fullId} text-area-2`} id={`${fullId}-button-display-2`} maxRows="3"
            value={value} style={{ resize: "none", overflowWrap: "break-word", outline: "none", maxWidth: width, minWidth: width, position: "absolute", color: "rgba(255,255,255,0.5)", }} />
            : <p className={`dropdown-button-display ${fullId}`} style={{ textAlign: "left", maxWidth: width, minWidth: width, position: "absolute" }}>{value}</p>
        let buttonFace = willShowTextArea ? < TextareaAutosize spellcheck="false" minRows={minRows}
            className={`dropdown-button-display ${fullId} text-area `} id={`${id}-button-display`} maxRows="3"
            value={whatToShow} style={{ resize: "none", overflowWrap: "break-word", outline: "none", maxWidth: width, minWidth: width, borderBottom: "1px solid rgba(255,255,255,0.3)", }}
            onKeyDown={e => { handleKeyPress(e, fullId) }} placeholder={placeholder} />
            : <p className={`dropdown-button-display ${fullId}`} style={{ textAlign: "left", maxWidth: width, minWidth: width, borderBottom: "1px solid rgba(255,255,255,0.3)" }}>{whatToShow}</p>

        return <button className={`${rangeButtonClass} dropdown-button ${fullId}`} id={`${fullId}-button`} onClick={(e) => { handleButtonClick(e, fullId) }}>
            {buttonFace2}{buttonFace}
            <p className={`arrow ${fullId}`}>
                <Svg className={`arrow-svg ${fullId}`} height="20" width="20">
                    <Path className={`arrow-path ${fullId}`} d={`m0,${arrowOffset} l16 0 l-8 8 l-8 -8`} fill="gray" strokeWidth="2"  >
                    </Path>
                </Svg>
            </p>
            <div className={`dropdown-content ${scrollable}`} id={fullId}>
                {createDropDown(fullId)}
            </div>
        </button>
    }

    function createLeftButtons() {
        console.log(props.allSearchParameters)
        let allLeftButtons = [<p className="param-title">Seasons: </p>,
        <p className="param-content">{makeButton("year-advanced", "begin", "scrollable", "Start")} - {makeButton("year-advanced", "end", "scrollable", "End")}</p>,
        <p className="param-title">Players: </p >,
        <p className="param-content">{makeButton("player-advanced", "", "scrollable", "Player")}</p>,
        <p className="param-title">Season Types: </p>,
        <p className="param-content">{makeButton("season-advanced", "", "", "Season Type")}</p>,
        <p className="param-title">Shot Distance (ft.): </p >,
        <p className="param-content"> {makeButton("distance", "begin", "scrollable", "Start")} - {makeButton("distance", "end", "scrollable", "End")}</p >,
        <p className="param-title">Shot Success: </p>,
        <p className="param-content">{makeButton("success", "", "", "Makes or Misses")}</p>,
        <p className="param-title">Shot Value: </p>,
        <p className="param-content">{makeButton("shot-value", "", "", "2PT or 3PT")}</p>
        ]
        return allLeftButtons;
    }

    function createRightButtons() {
        let allRightButtons = [
            <p className="param-title">Shot Types: </p>,
            <p className="param-content">{makeButton("shot-types", "", "scrollable", "Shot Type")}</p>,
            <p className="param-title">Shooting Teams: </p>,
            <p className="param-content">{makeButton("shooting-teams", "", "scrollable", "Shooting Team")}</p>,
            <p className="param-title">Home Teams: </p>,
            <p className="param-content">{makeButton("home-teams", "", "scrollable", "Home Team")}</p>,
            <p className="param-title">Away Teams: </p>,
            <p className="param-content">{makeButton("away-teams", "", "scrollable", "Away Team")}</p>,
            <p className="param-title">Court Areas: </p>,
            <p className="param-content">{makeButton("court-areas", "", "scrollable", "Court Area")}</p>,
            <p className="param-title">Sides of Court: </p>,
            <p className="param-content"> {makeButton("court-sides", "", "scrollable", "Court Side")}</p>
        ]
        return allRightButtons
    }
    function createInvisibleTextArea() {
        let value = ""
        if (props.textAreaText.text.length !== 0) {
            if (document.getElementById("player-advanced-dd") && document.getElementById("player-advanced-dd").classList.contains("show")) {
                value = searchDropDown(initPlayersSortedRef.current.map(eachPlayer => eachPlayer.toUpperCase()), props.textAreaText.text, false, true, "player-advanced-dd")
            } else if (document.getElementById("shot-types-dd") && document.getElementById("shot-types-dd").classList.contains("show")) {
                value = searchDropDown(props.shotTypes.map(eachShotType => eachShotType.toUpperCase()), props.textAreaText.text, false, true, "shot-types-dd")
            } else if ((document.getElementById("shooting-teams-dd") && document.getElementById("shooting-teams-dd").classList.contains("show"))
                || (document.getElementById("home-teams-dd") && document.getElementById("home-teams-dd").classList.contains("show"))
                || (document.getElementById("away-teams-dd") && document.getElementById("away-teams-dd").classList.contains("show"))) {
                value = searchDropDown(Object.keys(relevantTeams).map(each => each.toUpperCase()), props.textAreaText.text, false, true, "shooting-teams-dd")
            }
        }
        let width = 50
        if (document.getElementById("shooting-teams-dd"))
            if (document.getElementById("player-advanced-dd") && document.getElementById("player-advanced-dd").classList.contains("show") && document.getElementById(`player-advanced-dd-button`) && document.getElementById(`player-advanced-dd-button`).clientWidth) {
                width = document.getElementById(`player-advanced-dd-button`).clientWidth
            } else if (document.getElementById("shot-types-dd") && document.getElementById("shot-types-dd").classList.contains("show") && document.getElementById(`shot-types-dd-button`) && document.getElementById(`shot-types-dd-button`).clientWidth) {
                width = document.getElementById(`shot-types-dd-button`).clientWidth
            } else if (document.getElementById("shooting-teams-dd") && document.getElementById("shooting-teams-dd").classList.contains("show") && document.getElementById(`shooting-teams-dd-button`) && document.getElementById(`shooting-teams-dd-button`).clientWidth) {
                width = document.getElementById(`shooting-teams-dd-button`).clientWidth
            } else if (document.getElementById("home-teams-dd") && document.getElementById("home-teams-dd").classList.contains("show") && document.getElementById(`home-teams-dd-button`) && document.getElementById(`home-teams-dd-button`).clientWidth) {
                width = document.getElementById(`home-teams-dd-button`).clientWidth
            } else if (document.getElementById("away-teams-dd") && document.getElementById("away-teams-dd").classList.contains("show") && document.getElementById(`away-teams-dd-button`) && document.getElementById(`away-teams-dd-button`).clientWidth) {
                width = document.getElementById(`away-teams-dd-button`).clientWidth
            }
        let innerWidth = width * 0.7
        return <button className={`dropdown-button player-invisible-dd`} id={`player-invisible-button`} style={{ position: "absolute", backgroundColor: "transparent", borderColor: "transparent", transform: "translate(-1000px,0px)", marginBottom: "0px", maxWidth: width, minWidth: width }} >
            <TextareaAutosize rows="1" className={`dropdown-button-display player-dd-invisible text-area-2`} id={`player-button-display-invisible`} maxRows="3"
                value={value} style={{ position: "absolute", resize: "none", overflowWrap: "break-word", position: "absolute", color: "transparent", maxWidth: innerWidth, minWidth: innerWidth }} />
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
                    } else if (eachKey === "shooting-teams-dd" || eachKey === "home-teams-dd" || eachKey === "away-teams-dd") {
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
            document.getElementById("shotview-grid-item").scrollIntoView({ behavior: "smooth" })
            props.setIsLoading({ state: true, newShots: true })
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
                        props.setShotPercentageData(data)
                    })
            }, 750)
        }
    }

    const selectionViewerRef = useRef({})
    selectionViewerRef.current = <SelectionViewer allSearchParameters={allSearchParametersRef.current} setAllSearchParameters={props.setAllSearchParameters} />

    let willDisplayInGrid = props.isMobile ? (<div className="advanced-grid" style={{ gridTemplateColumns: "100% " }}>
        <div className="advanced-grid-item" >
            {createInvisibleTextArea()}
            {createLeftButtons()}
            {createRightButtons()}
        </div>
    </div>) : (<div className="advanced-grid">
        <div className="advanced-grid-item">
            {createInvisibleTextArea()}
            {createLeftButtons()}
        </div>
        <div className="advanced-grid-item">
            {createRightButtons()}
        </div>
    </div>)

    return (
        <div className="AdvancedSearchBox" id="advanced-search-box">
            <div className="search-box-body">
                <div className='search-box-inner-body'>
                    <h6 className="choose-parameters-label">Search Parameters
                        <Switch id="show-advanced-parameters" checkedChildren="Show" unCheckedChildren="Hide" defaultChecked onChange={(checked => setDisplayAdvancedSearchSelections(checked))} />
                    </h6>
                    {selectionViewerRef.current}
                    <div id="hide-advanced-div" style={displayAdvancedSearchSelections ? {} : { display: "none" }}>
                        {willDisplayInGrid}
                        <button className="dropdown-button static-button view-selection-adv-dd" id="view-selection-adv-button" onClick={e => props.handleDDButtonClick(e, "view-selection-adv-dd")}>
                            <p className="dropdown-button-display view-selection-adv-dd">{latestAdvancedViewType}</p>
                            <p className="arrow view-selection-adv-dd" >
                                <Svg className="arrow-svg view-selection-adv-dd" height="20" width="20">
                                    <Path className="arrow-path view-selection-adv-dd" d='m0,10 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                    </Path>
                                </Svg>
                            </p>
                            <div className="dropdown-content" id="view-selection-adv-dd">
                                <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Classic</p>
                                <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Hex</p>
                                <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Zone</p>
                                <p className='dropdown-item view-display' onClick={(event) => setLatestAdvancedViewType(event.target.textContent)}>Heat</p>
                            </div></button>
                        <br></br>
                        <button className="static-button" id="run-advanced-search-button" onClick={() => runAdvancedSearch()}>Run It</button>
                        <br></br>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvancedSearchBox