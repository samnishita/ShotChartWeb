import './SimpleSearchBox.css'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';

const SimpleSearchBox = (props) => {
    console.log("RERENDER SimpleSearchBox")
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
    const initPlayersRef = useRef({});
    initPlayersRef.current = props.initPlayers;
    const initPlayersReverseMapRef = useRef({});
    initPlayersReverseMapRef.current = props.initPlayersReverseMap;

    function getActivePlayersData(year) {
        console.log(`getActivePlayersData(${year})`)
        let response = props.getSearchData(`https://customnbashotcharts.com:8443/shots_request?activeplayers=${year}`)
            .then(res => {
                let activePlayersArray = res.activeplayers.map(eachPlayer => {
                    return {
                        displayname: (`${eachPlayer.firstname} ${eachPlayer.lastname}`).trim(),
                        playerinfo: {
                            id: eachPlayer.id,
                            playerfirstname: eachPlayer.firstname,
                            playerlastname: eachPlayer.lastname
                        }
                    }
                })
                activePlayersArray.sort((a, b) => {
                    if (a.displayname.toLowerCase() < b.displayname.toLowerCase()) { return -1; }
                    if (a.displayname.toLowerCase() > b.displayname.toLowerCase()) { return 1; }
                    return 0;
                })
                setActivePlayers(activePlayersArray)
                return activePlayersArray
            })
        return response;
    }

    async function getSeasonsData(year, playerId, playerFirstName, playerLastName) {
        console.log(`getSeasonsData(${year}, ${playerId}, ${playerFirstName}, ${playerLastName})`)
        let response = await props.getSearchData(`https://customnbashotcharts.com:8443/shots_request?singleseasonactivity=true&playerlastname=${playerLastName}&playerfirstname=${playerFirstName}&playerid=${playerId}&year=${year}`)
            .then(res => {
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
                if (!activeSeasonsRes.includes(selectedSeasonRef.current)) {
                    activeSeasonsRes.includes("Regular Season") ? props.setSelectedSeason("Regular Season") : props.setSelectedSeason(activeSeasonsRes[activeSeasonsRes.length - 1])
                }
                setActiveSeasons(activeSeasonsRes)
            })
        return response
    }

    function displayAllYears(currentYear) {
        console.log(`displayAllYears(${currentYear})`)
        if (yearDisplay.length === 0) {
            setYearDisplay(generateYears(currentYear))
        }
    }

    function generateYears(currentYear) {
        let year = Number(currentYear.substring(0, 4)), subYearString, elements = []
        for (let eachYear = year; eachYear >= 1996; eachYear--) {
            subYearString = (eachYear - 1899) % 100 < 10 ? subYearString = "0" + (eachYear - 1899) % 100 : subYearString = "" + (eachYear - 1899) % 100
            elements.push(<p className='dropdown-item year-display' id={eachYear + "-" + subYearString} onClick={(event) => handleYearButtonClick(event)}>{eachYear + "-" + subYearString}</p>)
        }
        return elements
    }

    function displayActivePlayers() {
        console.log("displayActivePlayers()")
        setActivePlayersDisplay(<ul>{activePlayers.map(value =>
            <li className='dropdown-item player-display' id={value.displayname.toUpperCase()} playerid={value.playerinfo.id}
                onClick={(event) => handlePlayerButtonClick(event)}>{value.displayname}</li>)}</ul>)
    }

    function displayActiveSeasons() {
        console.log("displayActiveSeasons()")
        let activeSeasonsElements = Object.values(activeSeasons).map(value => (<li className='dropdown-item season-display' onClick={(event) => handleSeasonButtonClick(event)}>{value}</li>));
        setActiveSeasonsDisplay(<ul>{activeSeasonsElements}</ul>)
    }

    async function handleYearButtonClick(event) {
        console.log(`handleYearButtonClick(${event})`)
        if (event.target.classList.contains("year-display") && selectedYearRef.current !== event.target.textContent) {
            props.setSelectedYear(event.target.textContent, console.log("Set selected year to " + event.target.textContent));
            processYearChange(event.target.textContent)
        }
    }
    async function handlePlayerButtonClick(event) {
        console.log(`handlePlayerButtonClick(${event})`)
        if (event.target.classList.contains("player-display") && selectedPlayerRef.current !== event.target.textContent) {
            props.setSelectedPlayer({
                id: event.target.getAttribute('playerid'),
                playerfirstname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][1],
                playerlastname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][2]
            }, console.log("Set selected player to " + event.target.textContent));
            getSeasonsData(selectedYearRef.current, initPlayersRef.current[event.target.textContent][0], initPlayersRef.current[event.target.textContent][1], initPlayersRef.current[event.target.textContent][2])
        }
    }
    async function handleSeasonButtonClick(event) {
        console.log(`handleSeasonButtonClick(${event})`)
        if (event.target.classList.contains("season-display") && selectedSeasonRef.current !== event.target.textContent) {
            console.log(`Setting season to ${event.target.textContent}`)
            props.setSelectedSeason(event.target.textContent)
        }
    }

    async function runSimpleSearch() {
        let url = `https://customnbashotcharts.com:8443/shots_request?year=${selectedYearRef.current}&seasontype=${selectedSeasonRef.current}&simplesearch=true&playerid=${selectedPlayerRef.current.id}&playerlastname=${selectedPlayerRef.current.playerlastname}&playerfirstname=${selectedPlayerRef.current.playerfirstname}`
        console.log(`runSimpleSearch(${url})`)
        const response = await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                props.setTitle(`${selectedPlayerRef.current.playerfirstname} ${selectedPlayerRef.current.playerlastname}, ${selectedYearRef.current} ${selectedSeasonRef.current}`)
                props.updateLatestSimpleViewType(latestSimpleViewType)
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
        console.log(`handleViewSelectionButtonClick(${event})`)
        setLatestSimpleViewType(event.target.textContent)
    }

    useEffect(() => {
        console.log("useEffect for SimpleSearchBox []")
        getActivePlayersData(props.selectedYear)
        getSeasonsData(props.selectedYear, selectedPlayerRef.current.id, selectedPlayerRef.current.playerfirstname, selectedPlayerRef.current.playerlastname)
        displayAllYears(props.currentYear)
        window.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                console.log("SPACEBAR")
                event.preventDefault();
            }
        });
    }, []);

    async function processYearChange(yearResult) {
        console.log(`processYearChange(${yearResult})`)
        let response = await getActivePlayersData(document.getElementById(yearResult).textContent)
        let names = response.map(each => each.displayname)
        if (!names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)) {
            let firstPlayer = response[0]
            props.setSelectedPlayer({
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
        console.log("useEffect for activePlayers")
        displayActivePlayers()
    }, [activePlayers])
    useEffect(() => {
        console.log("useEffect for activeSeasons")
        displayActiveSeasons()
    }, [activeSeasons])

    useEffect(() => {
        console.log("useEffect for SimpleSearchBox keyPressedBuilder")
        let classes = ""
        console.log(props.keyPressedBuilder)
        if (typeof (props.keyPressedBuilder.id) === 'string') {
            classes = props.keyPressedBuilder.id
        } else if (props.keyPressedBuilder.id !== null) {
            classes = props.keyPressedBuilder.id.baseVal
        }
        console.log(classes)
        console.log(classes.indexOf('player-dd'))
        if (classes.indexOf('player-dd') !== -1) {
            let latestArray = activePlayersRef.current.map(eachPlayer => eachPlayer.displayname.toUpperCase())
            for (let i = 0; i < props.keyPressedBuilder.builder.length; i++) {
                let tempArray = latestArray.filter(eachPlayer => eachPlayer.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1)))
                if (tempArray.length !== 0) {
                    latestArray = tempArray
                }
            }
            let result = latestArray[0]

            document.getElementById(result).parentNode.parentNode.scrollTop = document.getElementById(result).offsetTop;
            props.setSelectedPlayer({
                id: document.getElementById(result).getAttribute('playerid'),
                playerfirstname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][1],
                playerlastname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][2]
            }, getSeasonsData(selectedYearRef.current, initPlayersRef.current[document.getElementById(result).textContent][0], initPlayersRef.current[document.getElementById(result).textContent][1], initPlayersRef.current[document.getElementById(result).textContent][2])
            );
        }
        else if (classes.indexOf('year-dd') !== -1) {
            let years = generateYears(props.currentYear)
            for (let i = 0; i < props.keyPressedBuilder.builder.length; i++) {
                let tempArray = years.filter(eachYear => eachYear.props.children.startsWith(props.keyPressedBuilder.builder.substring(0, i + 1)))
                if (tempArray.length !== 0) {
                    years = tempArray
                }
            }
            let yearResult = years[0].props.children
            document.getElementById(yearResult).scrollIntoView({ behavior: 'auto' })
            props.setSelectedYear(document.getElementById(yearResult).textContent);
            processYearChange(yearResult)
        }
    }, [props.keyPressedBuilder])

    useEffect(() => {
        console.log(`useEffect for SimpleSearchBox selectedPlayer`)
        // console.log(props.selectedPlayer)
    }, [props.selectedPlayer])

    function createButton(id, selection, displayState, scrollable) {
        let height = 20
        return (<button class={`dropdown-button ${id}-dd`} id={`${id}-button`} onClick={(e) => { props.handleDDButtonClick(e, `${id}-dd`) }}>
            <p className={`dropdown-button-display ${id}-dd`}>{selection}</p >
            <Svg className={`arrow-svg ${id}-dd`} height={height} width={height}>
                <Path className={`arrow-path ${id}-dd`} d={`m0,${height / 2} l16 0 l-8 8 l-8 -8`} fill="gray" strokeWidth="2"  >
                </Path>
            </Svg>
            <div className={`dropdown-content ${scrollable}`} id={`${id}-dd`}>
                {displayState}
            </div>
        </button>)
    }

    /**
     * <button class="dropdown-button year-dd" id="year-button" onClick={(e) => { props.handleDDButtonClick(e, "year-dd") }}>
                        <p className="dropdown-button-display  year-dd">{selectedYearRef.current}</p >
                        <Svg className="arrow-svg year-dd" height="20" width="20">
                            <Path className="arrow-path year-dd" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                            </Path>
                        </Svg>
                        <div className="dropdown-content scrollable" id="year-dd">
                            {yearDisplay}
                        </div>
                    </button>
                    <button class="dropdown-button player-dd" id="player-button" onClick={(e) => props.handleDDButtonClick(e, "player-dd")}>
                        <p className="dropdown-button-display  player-dd" id="player-dd-display">{selectedPlayerRef.current.playerfirstname} {selectedPlayerRef.current.playerlastname}</p>
                        <Svg className="arrow-svg  player-dd" id="player-dd-arrow-svg" height="20" width="20">
                            <Path className="arrow-path  player-dd" id="player-dd-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                            </Path>
                        </Svg>
                        <div className="dropdown-content scrollable" id="player-dd">
                            {activePlayersDisplay}
                        </div>
                    </button>
                     <button class="dropdown-button" id="season-type-button" onClick={(e) => props.handleDDButtonClick(e, "season-type-dd")}>
                        <p className="dropdown-button-display">{selectedSeasonRef.current}</p>
                        <Svg className="arrow-svg" height="20" width="20">
                            <Path className="arrow-path" d='m0,8 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                            </Path>
                        </Svg>
                        <div className="dropdown-content" id="season-type-dd">
                            {activeSeasonsDisplay}
                        </div>
                    </button>
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
     */
    return (
        <div className="SimpleSearchBox">
            <div className="search-box-body">
                <div className="search-box-inner-body">
                    <h6 className="choose-parameters-label">Choose your search parameters</h6>
                    {createButton("year", selectedYearRef.current, yearDisplay, "scrollable")}
                    <br></br>
                    {createButton("player", `${selectedPlayerRef.current.playerfirstname} ${selectedPlayerRef.current.playerlastname}`, activePlayersDisplay, "scrollable")}
                    <br></br>
                    {createButton("season-type", selectedSeasonRef.current, activeSeasonsDisplay, "")}
                    <br></br>
                    {createButton("view-selection", latestSimpleViewType, [<p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Traditional</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Grid</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Zone</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Heat</p>,
                    ], "")}
                    <br></br>
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