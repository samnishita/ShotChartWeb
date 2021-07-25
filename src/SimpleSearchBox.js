import './SimpleSearchBox.css'
import SearchTypeButtons from './SearchTypeButtons'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

const SimpleSearchBox = (props) => {
    //STATES

    const [activePlayers, setActivePlayers] = useState([])
    const [activeSeasons, setActiveSeasons] = useState([])
    const [yearDisplay, setYearDisplay] = useState([])
    const [activePlayersDisplay, setActivePlayersDisplay] = useState([])
    const [activeSeasonsDisplay, setActiveSeasonsDisplay] = useState([])
    const [shotPercentageData, setShotPercentageData] = useState({})
    const [latestSimpleViewType, setLatestSimpleViewType] = useState(props.latestSimpleViewType)
    //STATE REFS
    const selectedYearRef = useRef({});
    selectedYearRef.current = props.selectedYear;
    const selectedPlayerRef = useRef({});
    selectedPlayerRef.current = props.selectedPlayer;
    const selectedSeasonRef = useRef({});
    selectedSeasonRef.current = props.selectedSeason;
    const activePlayersRef = useRef({});
    activePlayersRef.current = activePlayers;
    const initPlayersReverseMapRef = useRef({});
    initPlayersReverseMapRef.current = props.initPlayersReverseMap;

    function getActivePlayersData(year) {
        let response = props.getSearchData(`https://customnbashotcharts.com:8443/shots_request?activeplayers=${year}`)
            .then(res => {
                let activePlayersArray = []
                //let activePlayersJson = {}
                for (let i = 0; i < res.activeplayers.length; i++) {
                    activePlayersArray.push(
                        {
                            displayname: (`${res.activeplayers[i].firstname} ${res.activeplayers[i].lastname}`).trim(),
                            playerinfo: {
                                id: res.activeplayers[i].id,
                                playerfirstname: res.activeplayers[i].firstname,
                                playerlastname: res.activeplayers[i].lastname
                            }
                        })

                    //activePlayersArray.push((`${res.activeplayers[i].firstname} ${res.activeplayers[i].lastname}`).trim())
                }
                activePlayersArray.sort((a, b) => {
                    if (a.displayname < b.displayname) { return -1; }
                    if (a.displayname > b.displayname) { return 1; }
                    return 0;
                })

                console.log("getActivePlayersData: ")
                // console.log(activePlayersArray)
                setActivePlayers(activePlayersArray)
                return activePlayersArray
            })
        // console.log("response")
        // console.log(response)
        return response;
    }

    async function getSeasonsData(year, playerId, playerFirstName, playerLastName) {
        let response = await props.getSearchData(`https://customnbashotcharts.com:8443/shots_request?singleseasonactivity=true&playerlastname=${playerLastName}&playerfirstname=${playerFirstName}&playerid=${playerId}&year=${year}`)
            .then(res => {
                console.log("getSeasonsData()")
                //console.log(res)
                let activeSeasonsRes = []
                if (res.singleseason[0].preseason === 1) {
                    activeSeasonsRes.push("Preseason")
                }
                if (res.singleseason[0].reg === 1) {
                    activeSeasonsRes.push("Regular Season")
                }
                if (res.singleseason[0].playoffs === 1) {
                    activeSeasonsRes.push("Playoffs")
                }
                //console.log("getSeasonsData: ")
                //console.log(activeSeasonsRes)
                if (!activeSeasonsRes.includes(selectedSeasonRef.current)) {
                    if (activeSeasonsRes.includes("Regular Season")) {
                        props.setSelectedSeason("Regular Season")
                        console.log("Includes Regular Season")
                    } else {
                        props.setSelectedSeason(activeSeasonsRes[activeSeasonsRes.length - 1])
                        console.log("Does Not Include Regular Season")
                    }
                }
                setActiveSeasons(activeSeasonsRes)
            })
        return response
    }

    function displayAllYears(currentYear) {
        if (yearDisplay.length === 0) {
            console.log("displayAllYears()")
            let year = Number(currentYear.substring(0, 4));
            let subYearString;
            let elements = []
            while (year >= 1996) {
                if ((year - 1899) % 100 < 10) {
                    subYearString = "0" + (year - 1899) % 100;
                } else {
                    subYearString = "" + (year - 1899) % 100;
                }
                elements.push(<p className='dropdown-item year-display' id={year + "-" + subYearString} onClick={(event) => handleYearButtonClick(event)}>{year + "-" + subYearString}</p>)
                year--;
            }
            setYearDisplay(elements)//, console.log(yearDisplay)
        }
    }

    function displayActivePlayers() {
        console.log("displayActivePlayers()")
        let playerElements = []
        //console.log(activePlayers)
        //console.log(activePlayers[0])
        activePlayers.forEach(value => {
            //console.log(value)
            // console.log(value.displayname)
            //console.log(value.playerinfo.id)
            playerElements.push(<p className='dropdown-item player-display' id={value.displayname.toUpperCase()} playerid={value.playerinfo.id} onClick={(event) => handlePlayerButtonClick(event)}>{value.displayname}</p>)
        });
        setActivePlayersDisplay(playerElements)//, console.log(activePlayersDisplay)
    }

    function displayActiveSeasons() {
        console.log("displayActiveSeasons()")
        let activeSeasonsElements = []
        Object.values(activeSeasons).map(value => activeSeasonsElements.push(<p className='dropdown-item season-display' onClick={(event) => handleSeasonButtonClick(event)}>{value}</p>));
        setActiveSeasonsDisplay(activeSeasonsElements)//, console.log(activeSeasons)
    }

    async function handleYearButtonClick(event) {
        console.log('handleYearButtonClick()')
        if (event.target.classList.contains("year-display") && selectedYearRef.current !== event.target.textContent) {
            //console.log("selectedYear: " + props.selectedYear + ", " + event.target.textContent)
            props.setSelectedYear(event.target.textContent, console.log("Set selected year to " + event.target.textContent));
            //console.log("event.target.textContent: " + event.target.textContent)
            let response = await getActivePlayersData(event.target.textContent)
            //console.log("response")
            //console.log(response)
            //console.log(props.selectedPlayer.playerfirstname + " " + props.selectedPlayer.playerlastname)
            let names = response.map(each => each.displayname)
            console.log(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)
            console.log(names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname))
            if (!names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)) {
                let firstPlayer = response[0]
                props.setSelectedPlayer({
                    id: firstPlayer.playerinfo.id,
                    playerfirstname: firstPlayer.playerinfo.playerfirstname,
                    playerlastname: firstPlayer.playerinfo.playerlastname
                })
                console.log("Selected Player: " + firstPlayer.displayname)
                getSeasonsData(event.target.textContent, firstPlayer.playerinfo.id, firstPlayer.playerinfo.playerfirstname, firstPlayer.playerinfo.playerlastname)
            } else {
                getSeasonsData(event.target.textContent, selectedPlayerRef.current.id, selectedPlayerRef.current.playerfirstname, selectedPlayerRef.current.playerlastname)
            }
        }
    }
    async function handlePlayerButtonClick(event) {
        console.log('handlePlayerButtonClick()')
        if (event.target.classList.contains("player-display") && selectedPlayerRef.current !== event.target.textContent) {
            //console.log(initPlayersReverseMapRef.current)
            //console.log(event.target.getAttribute('playerid'))
            //console.log(props.initPlayersReverseMap)
            //console.log(initPlayersReverseMapRef.current)
            props.setSelectedPlayer({
                id: event.target.getAttribute('playerid'),
                playerfirstname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][1],
                playerlastname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][2]
            }, console.log("Set selected player to " + event.target.textContent));
            getSeasonsData(selectedYearRef.current, props.initPlayers[event.target.textContent][0], props.initPlayers[event.target.textContent][1], props.initPlayers[event.target.textContent][2])
        }
    }
    async function handleSeasonButtonClick(event) {
        console.log('handleSeasonButtonClick()')
        // console.log(`selectedSeason: ${selectedSeasonRef.current}`)
        // console.log(`event.target.textContent: ${event.target.textContent}`)
        //console.log(event.target.classList.contains("season-display"))
        if (event.target.classList.contains("season-display") && selectedSeasonRef.current !== event.target.textContent) {
            console.log(`Setting season to ${event.target.textContent}`)
            props.setSelectedSeason(event.target.textContent)
        }
    }

    async function runSimpleSearch() {
        console.log("runSimpleSearch()")
        let url = `https://customnbashotcharts.com:8443/shots_request?year=${selectedYearRef.current}&seasontype=${selectedSeasonRef.current}&simplesearch=true&playerid=${selectedPlayerRef.current.id}&playerlastname=${selectedPlayerRef.current.playerlastname}&playerfirstname=${selectedPlayerRef.current.playerfirstname}`
        console.log("Fetching " + url)
        const response = await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                //console.log("URL RESPONSE FROM " + url + ": ")
                //console.log(data)
                props.setTitle(`${selectedPlayerRef.current.playerfirstname} ${selectedPlayerRef.current.playerlastname}, ${selectedYearRef.current} ${selectedSeasonRef.current}`)
                props.updateLatestSimpleViewType(latestSimpleViewType)
                props.updateLatestSimpleSearchData(data)
                props.setAllSearchData({
                    shots: data,
                    view: latestSimpleViewType
                })
                setShotPercentageData(data)
                return data
            }).catch(error => console.log('error', error))
        return response
    }

    function handleViewSelectionButtonClick(event) {
        setLatestSimpleViewType(event.target.textContent)
    }

    useEffect(() => {
        getActivePlayersData(props.currentYear)
        getSeasonsData(props.currentYear, selectedPlayerRef.current.id, selectedPlayerRef.current.playerfirstname, selectedPlayerRef.current.playerlastname)
        displayAllYears(props.currentYear)
        window.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                console.log("SPACEBAR")
                event.preventDefault();
            }
        });
    }, []);
    async function processYearChange(yearResult) {
        let response = await getActivePlayersData(document.getElementById(yearResult).textContent)
        //console.log("response")
        //console.log(response)
        //console.log(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)
        let names = []
        response.forEach(each => names.push(each.displayname))
        //console.log(names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname))
        if (!names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)) {
            let firstPlayer = response[0]
            props.props.setSelectedPlayer({
                id: firstPlayer.playerinfo.id,
                playerfirstname: firstPlayer.playerinfo.playerfirstname,
                playerlastname: firstPlayer.playerinfo.playerlastname
            })
            console.log("Selected Player: " + firstPlayer.displayname)
            getSeasonsData(document.getElementById(yearResult).textContent, firstPlayer.playerinfo.id, firstPlayer.playerinfo.playerfirstname, firstPlayer.playerinfo.playerlastname)
        } else {
            getSeasonsData(document.getElementById(yearResult).textContent, selectedPlayerRef.current.id, selectedPlayerRef.current.playerfirstname, selectedPlayerRef.current.playerlastname)
        }

    }
    useEffect(() => {
        displayActivePlayers()
    }, [activePlayers])
    useEffect(() => {
        displayActiveSeasons()
    }, [activeSeasons])

    useEffect(() => {
        //console.log("props.keyPressedBuilder")
        //console.log(props.keyPressedBuilder.id)
        //console.log(typeof (props.keyPressedBuilder.id))
        let classes = ""
        if (typeof (props.keyPressedBuilder.id) === 'string') {
            classes = props.keyPressedBuilder.id
        } else if (props.keyPressedBuilder.id !== null) {
            classes = props.keyPressedBuilder.id.baseVal
        }
        //console.log(classes)
        if (classes.indexOf('player-dd') !== -1) {
            let latestArray = activePlayersRef.current.map(eachPlayer => eachPlayer.displayname.toUpperCase())
            for (let i = 0; i < props.keyPressedBuilder.builder.length; i++) {
                let tempArray = []
                //console.log(keyPressedBuilderRef.current.length)
                //console.log((keyPressedBuilderRef.current.substring(0, i + 1)))
                latestArray.forEach(eachPlayer => {
                    if (eachPlayer.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1))) {
                        // console.log(`Pushing ${eachPlayer}`)
                        tempArray.push(eachPlayer)
                    }
                })
                if (tempArray.length !== 0) {
                    latestArray = tempArray
                }
                //console.log(latestArray)
            }
            let result = latestArray[0]
            //document.getElementById(result).scrollIntoView({ behavior: 'auto', block: 'nearest' })
            document.getElementById(result).parentNode.scrollTop = document.getElementById(result).offsetTop;
            props.setSelectedPlayer({
                id: document.getElementById(result).getAttribute('playerid'),
                playerfirstname: props.initPlayersReverseMap[document.getElementById(result).getAttribute('playerid')][1],
                playerlastname: props.initPlayersReverseMap[document.getElementById(result).getAttribute('playerid')][2]
            }, getSeasonsData(selectedYearRef.current, props.initPlayers[document.getElementById(result).textContent][0], props.initPlayers[document.getElementById(result).textContent][1], props.initPlayers[document.getElementById(result).textContent][2])
            );
        }
        else if (classes.indexOf('year-dd') !== -1) {
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
                //console.log(keyPressedBuilderRef.current.length)
                //console.log((keyPressedBuilderRef.current.substring(0, i + 1)))
                years.forEach(eachYear => {
                    if (eachYear.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1))) {
                        tempArray.push(eachYear)
                    }
                })
                if (tempArray.length !== 0) {
                    years = tempArray
                }
                //console.log(latestArray)
            }
            let yearResult = years[0]
            document.getElementById(yearResult).scrollIntoView({ behavior: 'auto' })
            props.setSelectedYear(document.getElementById(yearResult).textContent);
            processYearChange(yearResult)
        }
    }, [props.keyPressedBuilder])

    useEffect(() => {
        console.log("SELECTED PLAYER")
        console.log(props.selectedPlayer)
    }, [props.selectedPlayer])

    return (
        <div className="SimpleSearchBox">
            <div className="search-box-body">
                <div className="search-box-inner-body">
                    <h6 className="choose-parameters-label">Choose your search parameters</h6>
                    <button class="dropdown-button year-dd" id="year-button" onClick={(e) => { props.handleDDButtonClick(e, "season-dd") }}>
                        <span className="dropdown-button-display  year-dd">{selectedYearRef.current}</span>
                        <span className="arrow year-dd">
                            <Svg className="arrow-svg year-dd" height="20" width="20">
                                <Path className="arrow-path year-dd" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content scrollable" id="season-dd">
                            {yearDisplay}
                        </div>
                    </button>
                    <br></br>
                    <button class="dropdown-button player-dd" id="player-button" onClick={(e) => props.handleDDButtonClick(e, "player-dd")}>
                        <span className="dropdown-button-display  player-dd" id="player-dd-display">{selectedPlayerRef.current.playerfirstname} {selectedPlayerRef.current.playerlastname}</span>
                        <span className="arrow  player-dd" id="player-dd-arrow">
                            <Svg className="arrow-svg  player-dd" id="player-dd-arrow-svg" height="20" width="20">
                                <Path className="arrow-path  player-dd" id="player-dd-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content scrollable" id="player-dd">
                            {activePlayersDisplay}
                        </div>
                    </button>
                    <br></br>
                    <button class="dropdown-button" id="season-type-button" onClick={(e) => props.handleDDButtonClick(e, "season-type-dd")}>
                        <span className="dropdown-button-display">{selectedSeasonRef.current}</span>
                        <span className="arrow">
                            <Svg className="arrow-svg" height="20" width="20">
                                <Path className="arrow-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content" id="season-type-dd">
                            {activeSeasonsDisplay}
                        </div>
                    </button>
                    <br></br>
                    <button class="dropdown-button" id="view-selector" onClick={e => props.handleDDButtonClick(e, "view-selection-dd")}>
                        <span className="dropdown-button-display">{latestSimpleViewType}</span>
                        <span className="arrow">
                            <Svg className="arrow-svg" height="20" width="20">
                                <Path className="arrow-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content" id="view-selection-dd">
                            <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Traditional</p>
                            <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Grid</p>
                            <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Zone</p>
                            <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Heat</p>
                        </div>
                    </button>
                    <button id="run-simple-search-button" onClick={e => runSimpleSearch()}>
                        Run It
                    </button>

                </div>
            </div>
            <ShotPercentageView simpleShotData={shotPercentageData} isCurrentViewSimple={props.isCurrentViewSimple} />
        </div>
    )
}
export default SimpleSearchBox