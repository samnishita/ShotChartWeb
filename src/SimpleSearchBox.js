import './SimpleSearchBox.css'
import SearchTypeButtons from './SearchTypeButtons'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';


const SimpleSearchBox = (props) => {
    const currentYear = '2020-21'
    //STATES
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedPlayer, setSelectedPlayer] = useState({
        id: 203932,
        playerfirstname: "Aaron",
        playerlastname: "Gordon"
    });
    const [selectedSeason, setSelectedSeason] = useState("Regular Season");
    const [activePlayers, setActivePlayers] = useState([])
    const [activeSeasons, setActiveSeasons] = useState([])
    const [yearDisplay, setYearDisplay] = useState([])
    const [activePlayersDisplay, setActivePlayersDisplay] = useState([])
    const [activeSeasonsDisplay, setActiveSeasonsDisplay] = useState([])
    const [shotPercentageData, setShotPercentageData] = useState({})
    const [latestSimpleViewType, setLatestSimpleViewType] = useState(props.latestSimpleViewType)
    const [keyPressedBuilder, setKeyPressedBuilder] = useState("")
    const [keyPressedState, setKeyPressedState] = useState(() => (event) => {
        //console.log("KEYDOWN")
        //console.log(`${event.keyCode}: ${String.fromCharCode(event.keyCode)}`)
        //console.log(`${event.target.id}`)
        //console.log(activePlayersRef.current)
        if (event.keyCode === 8 && keyPressedBuilderRef.current.length > 0) {
            console.log("Backspace: " + keyPressedBuilderRef.current.substring(0, keyPressedBuilderRef.current.length - 1))
            setKeyPressedBuilder(keyPressedBuilderRef.current.substring(0, keyPressedBuilderRef.current.length - 1))
        } else if (event.keyCode === 222) {
            console.log(keyPressedBuilderRef.current + "'")
            setKeyPressedBuilder(keyPressedBuilderRef.current + "'")
        } else if (event.keyCode === 189) {
            console.log(keyPressedBuilderRef.current + "-")
            setKeyPressedBuilder(keyPressedBuilderRef.current + "-")
        } else if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 32) {
            console.log(keyPressedBuilderRef.current + String.fromCharCode(event.keyCode))
            setKeyPressedBuilder(keyPressedBuilderRef.current + String.fromCharCode(event.keyCode))
        }
        switch (event.target.id) {
            case "player-button":
                let latestArray = activePlayersRef.current.map(eachPlayer => eachPlayer.displayname.toUpperCase())
                for (let i = 0; i < keyPressedBuilderRef.current.length; i++) {
                    let tempArray = []
                    //console.log(keyPressedBuilderRef.current.length)
                    //console.log((keyPressedBuilderRef.current.substring(0, i + 1)))
                    latestArray.forEach(eachPlayer => {
                        if (eachPlayer.startsWith(keyPressedBuilderRef.current.substring(0, i + 1))) {
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
                console.log(result)
                //document.getElementById(result).scrollIntoView({ behavior: 'auto', block: 'nearest' })
                document.getElementById(result).parentNode.scrollTop = document.getElementById(result).offsetTop;
                setSelectedPlayer({
                    id: document.getElementById(result).getAttribute('playerid'),
                    playerfirstname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][1],
                    playerlastname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][2]
                }, getSeasonsData(selectedYearRef.current, initPlayersRef.current[document.getElementById(result).textContent][0], initPlayersRef.current[document.getElementById(result).textContent][1], initPlayersRef.current[document.getElementById(result).textContent][2])
                );
                break;
            case "year-button":
                let year = Number(currentYear.substring(0, 4));
                let subYearString;
                let years = []
                while (year >= 1996) {
                    if ((year - 1899) % 100 < 10) {
                        subYearString = "0" + (year - 1899) % 100;
                    } else {
                        subYearString = "" + (year - 1899) % 100;
                    }
                    years.push(year + "-" + subYearString)
                    year--;
                }
                for (let i = 0; i < keyPressedBuilderRef.current.length; i++) {
                    let tempArray = []
                    //console.log(keyPressedBuilderRef.current.length)
                    //console.log((keyPressedBuilderRef.current.substring(0, i + 1)))
                    years.forEach(eachYear => {
                        if (eachYear.startsWith(keyPressedBuilderRef.current.substring(0, i + 1))) {
                            tempArray.push(eachYear)
                        }
                    })
                    if (tempArray.length !== 0) {
                        years = tempArray
                    }
                    //console.log(latestArray)
                }
                let yearResult = years[0]
                console.log(yearResult)
                document.getElementById(yearResult).scrollIntoView({ behavior: 'auto' })
                setSelectedYear(document.getElementById(yearResult).textContent, console.log("Set selected year to " + document.getElementById(yearResult).textContent));
                processYearChange(yearResult)
        }
    })

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
            setSelectedPlayer({
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
    //STATE REFS
    const selectedYearRef = useRef({});
    selectedYearRef.current = selectedYear;
    const selectedPlayerRef = useRef({});
    selectedPlayerRef.current = selectedPlayer;
    const selectedSeasonRef = useRef({});
    selectedSeasonRef.current = selectedSeason;
    const activePlayersRef = useRef({});
    activePlayersRef.current = activePlayers;
    const initPlayersRef = useRef({})
    const initPlayersReverseMapRef = useRef({})
    const keyPressedStateRef = useRef({});
    keyPressedStateRef.current = keyPressedState;
    const keyPressedBuilderRef = useRef({});
    keyPressedBuilderRef.current = keyPressedBuilder;

    let initState = ""
    let initPlayers = "";
    let initPlayersReverseMap = ""

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

    async function getInitData() {
        let response = await getSearchData("https://customnbashotcharts.com:8443/shots_request?init=true")
            .then(res => {
                //console.log("getInitData")
                //console.log(res.init)
                initState = res
            })
        return response
    }

    function getInitPlayersData() {
        let players = {}
        let playersReverse = {}
        console.log("getInitPlayersData()")
        let response = getSearchData("https://customnbashotcharts.com:8443/shots_request?initallplayers=true")
            .then(res => {
                for (let i = 0; i < res.initallplayers.length; i++) {
                    let nameArray = [3]
                    nameArray[0] = res.initallplayers[i].id;
                    nameArray[1] = res.initallplayers[i].firstname;
                    nameArray[2] = res.initallplayers[i].lastname;
                    players[(res.initallplayers[i].firstname + " " + res.initallplayers[i].lastname).trim()] = nameArray;
                    playersReverse[res.initallplayers[i].id] = nameArray;
                }
                initPlayers = players
                initPlayersReverseMap = playersReverse
                //console.log("SETTING initPlayers/initPlayersReverseMap")
                //console.log(initPlayers)
                //console.log(initPlayersReverseMap)
                initPlayersRef.current = initPlayers
                initPlayersReverseMapRef.current = initPlayersReverseMap
                return res
            })
        return response
    }
    function getActivePlayersData(year) {
        let response = getSearchData(`https://customnbashotcharts.com:8443/shots_request?activeplayers=${year}`)
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
        // let response = await getSearchData(`http://138.68.52.234:8080/shots_request?singleseasonactivity=true&playerlastname=${playerLastName}&playerfirstname=${playerFirstName}&playerid=${playerId}&year=${year}`)
        let response = await getSearchData(`https://customnbashotcharts.com:8443/shots_request?singleseasonactivity=true&playerlastname=${playerLastName}&playerfirstname=${playerFirstName}&playerid=${playerId}&year=${year}`)
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
                        setSelectedSeason("Regular Season")
                        console.log("Includes Regular Season")
                    } else {
                        setSelectedSeason(activeSeasonsRes[activeSeasonsRes.length - 1])
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
            //console.log("selectedYear: " + selectedYearRef.current + ", " + event.target.textContent)
            setSelectedYear(event.target.textContent, console.log("Set selected year to " + event.target.textContent));
            //console.log("event.target.textContent: " + event.target.textContent)
            let response = await getActivePlayersData(event.target.textContent)
            //console.log("response")
            //console.log(response)
            //console.log(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)
            let names = []
            response.forEach(each => names.push(each.displayname))
            //console.log(names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname))
            if (!names.includes(selectedPlayerRef.current.playerfirstname + " " + selectedPlayerRef.current.playerlastname)) {
                let firstPlayer = response[0]
                setSelectedPlayer({
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
        if (event.target.classList.contains("player-display") && selectedPlayer !== event.target.textContent) {
            //console.log(initPlayersReverseMapRef.current)
            //console.log(event.target.getAttribute('playerid'))
            setSelectedPlayer({
                id: event.target.getAttribute('playerid'),
                playerfirstname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][1],
                playerlastname: initPlayersReverseMapRef.current[event.target.getAttribute('playerid')][2]
            }, console.log("Set selected player to " + event.target.textContent));
            getSeasonsData(selectedYearRef.current, initPlayersRef.current[event.target.textContent][0], initPlayersRef.current[event.target.textContent][1], initPlayersRef.current[event.target.textContent][2])
        }
    }
    async function handleSeasonButtonClick(event) {
        console.log('handleSeasonButtonClick()')
        console.log(`selectedSeason: ${selectedSeasonRef.current}`)
        console.log(`event.target.textContent: ${event.target.textContent}`)
        console.log(event.target.classList.contains("season-display"))
        if (event.target.classList.contains("season-display") && selectedSeasonRef.current !== event.target.textContent) {
            console.log(`Setting season to ${event.target.textContent}`)
            setSelectedSeason(event.target.textContent)
        }
    }

    function hideDD(event) {
        //console.log(event.target)
        if (!event.target.matches('.dropdown-button') && !event.target.matches('.dropdown-button-display') && !event.target.matches('.arrow-path') && !event.target.matches('.arrow-svg') && !event.target.matches('.arrow')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                    window.removeEventListener('keydown', keyPressedStateRef.current)
                    setKeyPressedBuilder("")
                    console.log("Removing event listener")
                }
            }
        }
    }
    window.onclick = hideDD;

    function handleDDButtonClick(event, type) {
        console.log("handleDDButtonClick()")
        //console.log(event)
        hideDD(event);
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var dropdown = dropdowns[i];
            if (dropdown.id !== type) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                    window.removeEventListener('keydown', keyPressedStateRef.current)
                    setKeyPressedBuilder("")
                    console.log("Removing event listener")
                }
            } else {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                    window.removeEventListener('keydown', keyPressedStateRef.current)
                    setKeyPressedBuilder("")
                    console.log("Removing event listener")
                } else {
                    window.addEventListener('keydown', keyPressedStateRef.current)
                    console.log("Adding event listener")
                    document.getElementById(type).classList.toggle("show")
                }
                //window.addEventListener('keydown', keyPressedStateRef.current)
                // console.log("Adding event listener")
            }
        }
        //console.log(document.getElementById(type).classList)
        //console.log(keyPressedStateRef.current)

    };

    async function runSimpleSearch() {
        console.log("runSimpleSearch()")
        //props.setIsLoading(true)
        // console.log(initPlayersReverseMapRef.current)
        // console.log(selectedPlayerRef.current)
        // console.log(selectedPlayerRef.current.id)
        //console.log(initPlayersReverseMapRef.current[selectedPlayerRef.current.id])
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
        getInitData()
        getInitPlayersData().then(res => {
            getActivePlayersData(currentYear)
            getSeasonsData(currentYear, selectedPlayer.id, selectedPlayer.playerfirstname, selectedPlayer.playerlastname)
        })
        displayAllYears(currentYear)
        window.addEventListener('keydown', function (event) {
            if (event.keyCode == 32) {
                console.log("SPACEBAR")
                event.preventDefault();
            }
        });
    }, []);

    useEffect(() => {
        displayActivePlayers()
    }, [activePlayers])
    useEffect(() => {
        displayActiveSeasons()
    }, [activeSeasons])

    return (
        <div className="SimpleSearchBox">
            <div className="search-box-body">
                <div className="search-box-inner-body">
                    <h6>Choose your search parameters</h6>
                    <button class="dropdown-button" id="year-button" onClick={(e) => { handleDDButtonClick(e, "season-dd") }}>
                        <span className="dropdown-button-display">{selectedYear}</span>
                        <span className="arrow">
                            <Svg className="arrow-svg" height="20" width="20">
                                <Path className="arrow-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content scrollable" id="season-dd">
                            {yearDisplay}
                        </div>
                    </button>
                    <br></br>
                    <button class="dropdown-button" id="player-button" onClick={(e) => handleDDButtonClick(e, "player-dd")}>
                        <span className="dropdown-button-display">{selectedPlayer.playerfirstname} {selectedPlayer.playerlastname}</span>
                        <span className="arrow">
                            <Svg className="arrow-svg" height="20" width="20">
                                <Path className="arrow-path" d='m0,5 l16 0 l-8 8 l-8 -8' fill="gray" strokeWidth="2"  >
                                </Path>
                            </Svg>
                        </span>
                        <div className="dropdown-content scrollable" id="player-dd">
                            {activePlayersDisplay}
                        </div>
                    </button>
                    <br></br>
                    <button class="dropdown-button" id="season-type-button" onClick={(e) => handleDDButtonClick(e, "season-type-dd")}>
                        <span className="dropdown-button-display">{selectedSeason}</span>
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
                    <button class="dropdown-button" id="view-selector" onClick={e => handleDDButtonClick(e, "view-selection-dd")}>
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
            <ShotPercentageView simpleShotData={shotPercentageData} />
        </div>
    )
}
export default SimpleSearchBox