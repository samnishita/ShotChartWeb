import './SimpleSearchBox.css'
import ShotPercentageView from './ShotPercentageView'
import { useEffect, useState, useRef } from "react";
import Svg, { Path, Line, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import TextArea from 'antd/lib/input/TextArea';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import TextareaAutosize from 'react-textarea-autosize';
const SimpleSearchBox = (props) => {
    console.log("RERENDER SimpleSearchBox")
    //STATES
    const [activePlayers, setActivePlayers] = useState([])
    const [activeSeasons, setActiveSeasons] = useState([])
    const [yearDisplay, setYearDisplay] = useState([])
    const [activePlayersDisplay, setActivePlayersDisplay] = useState([])
    const [activeSeasonsDisplay, setActiveSeasonsDisplay] = useState([])
    const [invisibleRows, setInvisibleRows] = useState(1)
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
        props.updateLatestSimpleViewType(latestSimpleViewType)
        props.setIsLoading({ state: true, newShots: true })
        if (props.isMobile) {
            document.getElementById("shotview-grid-item").scrollIntoView({ behavior: "smooth" })
        }
        let url = `https://customnbashotcharts.com:8443/shots_request?year=${selectedYearRef.current}&seasontype=${selectedSeasonRef.current}&simplesearch=true&playerid=${selectedPlayerRef.current.id}&playerlastname=${selectedPlayerRef.current.playerlastname}&playerfirstname=${selectedPlayerRef.current.playerfirstname}`
        console.log(`runSimpleSearch(${url})`)
        const response = await fetch(url, {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                props.setTitle(`${selectedPlayerRef.current.playerfirstname} ${selectedPlayerRef.current.playerlastname}, ${selectedYearRef.current} ${selectedSeasonRef.current}`)
                props.setAllSearchData({
                    shots: data,
                    view: latestSimpleViewType
                })
                props.setShotPercentageData(data)
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

    function searchYear(inputText, isFinal) {
        let years = generateYears(props.currentYear)
        let found = true;
        for (let i = 0; i < inputText.length; i++) {
            let tempArray = years.filter(eachYear => eachYear.props.children.startsWith(inputText.substring(0, i + 1)))
            if (tempArray.length !== 0) {
                years = tempArray
            } else {
                found = false
            }
        }
        let yearResult = years[0].props.children
        if (document.getElementById(yearResult)) {
            document.getElementById(yearResult).parentNode.scrollTop = document.getElementById(yearResult).offsetTop;
        }
        if (isFinal) {
            props.setSelectedYear(document.getElementById(yearResult).textContent);
            processYearChange(yearResult)
        }
        let autofill = found ? inputText + yearResult.substring(inputText.length, yearResult.length) : inputText
        return autofill
    }
    function searchPlayer(inputText, isFinal) {
        let latestArray = activePlayersRef.current.map(eachPlayer => eachPlayer.displayname.toUpperCase())
        let found = true;
        for (let i = 0; i < inputText.length; i++) {
            let tempArray = latestArray.filter(eachPlayer => eachPlayer.startsWith(inputText.substring(0, i + 1).toUpperCase()))
            if (tempArray.length !== 0) {
                latestArray = tempArray
            } else {
                found = false
            }
        }
        let result = latestArray[0]
        if (document.getElementById(result)) {
            document.getElementById(result).parentNode.parentNode.scrollTop = document.getElementById(result).offsetTop;
            if (isFinal) {
                props.setSelectedPlayer({
                    id: document.getElementById(result).getAttribute('playerid'),
                    playerfirstname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][1],
                    playerlastname: initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][2]
                }, getSeasonsData(selectedYearRef.current, initPlayersRef.current[document.getElementById(result).textContent][0], initPlayersRef.current[document.getElementById(result).textContent][1], initPlayersRef.current[document.getElementById(result).textContent][2])
                );
            }
            let disp = initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][1] + " " + initPlayersReverseMapRef.current[document.getElementById(result).getAttribute('playerid')][2]
            let autofill = found ? inputText + disp.substring(inputText.length, disp.length) : inputText
            return autofill
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
        console.log(props.textAreaText)
    }, [props.textAreaText])

    useEffect(() => {
        console.log(`useEffect for SimpleSearchBox selectedPlayer`)
    }, [props.selectedPlayer])

    function handleKeyPress(event, id) {
        let newString = event.target.value
        if (event.keyCode === 8) {
            newString = newString.substring(0, newString.length - 1)
        } else if (event.keyCode === 222) {
            newString += "'"
        } else if (event.keyCode === 189) {
            newString += "-"
        } else if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 32) {
            newString += event.key
        } else if (event.key === 'Enter') {
            event.preventDefault()
            props.handleDDButtonClick(event, id)
        }
        if (id === "year-dd") {
            event.key === 'Enter' ? searchYear(newString, true) : searchYear(newString, false)
        } else if (id === "player-dd") {
            event.key === 'Enter' ? searchPlayer(newString, true) : searchPlayer(newString, false)
        }
        props.setTextAreaText({ id: id, text: newString })
    }

    function handleButtonClick(event, id) {
        props.setTextAreaText({ id: id, text: "" })
        props.handleDDButtonClick(event, `${id}`)
    }
    useEffect(() => {
        /*
        console.log(document.getElementById("player-button-display-invisible"))
        console.log(Number.parseInt(document.getElementById("player-button-display-invisible").clientHeight / 20) !== invisibleRows)
        console.log(invisibleRows)
        console.log(document.getElementById("player-button-display-invisible").textContent)
        console.log(document.getElementById("player-button-display-invisible").textContent.split(" "))
        console.log(document.getElementById("player-button-display-invisible").textContent.split("-"))
        */
        if (document.getElementById("player-button-display-invisible") && Number.parseInt(document.getElementById("player-button-display-invisible").clientHeight / 20) !== invisibleRows) {
            console.log(invisibleRows)
            setInvisibleRows((Number.parseInt(document.getElementById("player-button-display-invisible").clientHeight) + 4) / 30)
        }
    })

    function createButton(id, selection, displayState, scrollable, placeholder) {
        let height = 20
        let fullId = id + "-dd"
        let whatToShow = selection
        if (document.getElementById(`${fullId}`) && document.getElementById(`${fullId}`).classList.contains("show")) {
            whatToShow = props.textAreaText.text
        }
        let value = ""
        if (props.textAreaText.text.length !== 0) {
            if (id === "year") {
                value = searchYear(whatToShow, false)
            } else if (id === "player") {
                value = searchPlayer(whatToShow, false)
            }
        }
        let width = 100
        if (document.getElementById(`${fullId}-button`) && document.getElementById(`${fullId}-button`).clientWidth) {
            width = document.getElementById(`${fullId}-button`).clientWidth * 0.7
        }
        let buttonFace2 = (id === "year" || id === "player") ? <TextareaAutosize spellcheck="false" minRows={id === "player" ? invisibleRows : 1}
            className={`dropdown-button-display ${fullId} text-area-2`} id={`${fullId}-button-display-2`} maxRows="3"
            value={value}
            style={{ resize: "none", overflowWrap: "break-word", outline: "none", maxWidth: width, minWidth: width, position: "absolute", color: "rgba(255,255,255,0.5)", }} />
            : <p className={`dropdown-button-display ${fullId}`} style={{ textAlign: "left", maxWidth: width, minWidth: width, position: "absolute" }}>{selection}</p>
        let buttonFace = (id === "year" || id === "player") ? < TextareaAutosize spellcheck="false" minRows={id === "player" ? invisibleRows : 1}
            className={`dropdown-button-display ${fullId} text-area `} id={`${fullId}-button-display`} maxRows="3"
            value={whatToShow}
            style={{ resize: "none", overflowWrap: "break-word", outline: "none", maxWidth: width, minWidth: width, borderBottom: "1px solid rgba(255,255,255,0.3)", }}
            onKeyDown={e => { handleKeyPress(e, fullId) }}
            placeholder={placeholder} />
            : <p className={`dropdown-button-display ${fullId}`} style={{ textAlign: "left", maxWidth: width, minWidth: width, borderBottom: "1px solid rgba(255,255,255,0.3)" }}>{selection}</p>
        return (<button className={`dropdown-button ${fullId}`} id={`${fullId}-button`} onClick={(e) => { handleButtonClick(e, fullId) }}>
            {buttonFace2}{buttonFace}
            <Svg className={`arrow-svg ${fullId}`} height={height} width={height}>
                <Path className={`arrow-path ${fullId}`} d={`m0,${(id === "year" || id === "player") ? 0 : 8} l16 0 l-8 8 l-8 -8`} fill="white" strokeWidth="2"  >
                </Path>
            </Svg>
            <div className={`dropdown-content ${scrollable}`} id={`${fullId}`}>
                {displayState}
            </div>
        </button>)
    }

    function createInvisibleTextArea() {
        let value = ""
        if (props.textAreaText.text.length !== 0) {
            value = searchPlayer(props.textAreaText.text, false)
        }
        let width = 50
        if (document.getElementById(`player-dd-button`) && document.getElementById(`player-dd-button`).clientWidth) {
            width = document.getElementById(`player-dd-button`).clientWidth * 0.7
        }
        let buttonFace2 = <TextareaAutosize rows="1" className={`dropdown-button-display player-dd-invisible text-area-2`} id={`player-button-display-invisible`} maxRows="3"
            value={value} style={{ position: "absolute", resize: "none", overflowWrap: "break-word", position: "absolute", color: "transparent", maxWidth: width, minWidth: width }} />
        return <button className={`dropdown-button player-invisible-dd`} id={`player-invisible-button`} style={{ backgroundColor: "transparent", borderColor: "transparent", transform: "translate(-1000px,0px)", marginBottom: "0px" }} >
            {buttonFace2}
        </button>
    }

    return (
        <div className="SimpleSearchBox" id="simple-search-box">
            <div className="search-box-body">
                <div className="search-box-inner-body">
                    <h6 className="choose-parameters-label">Search Parameters</h6>
                    {createInvisibleTextArea()}
                    {createButton("year", selectedYearRef.current, yearDisplay, "scrollable", "Season")}
                    <br></br>
                    {createButton("player", `${selectedPlayerRef.current.playerfirstname} ${selectedPlayerRef.current.playerlastname}`, activePlayersDisplay, "scrollable", "Player")}
                    <br></br>
                    {createButton("season-type", selectedSeasonRef.current, activeSeasonsDisplay, "", "Season Type")}
                    <br></br>
                    {createButton("view-selection", latestSimpleViewType, [<p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Classic</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Hex</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Zone</p>,
                    <p className='dropdown-item view-display' onClick={(event) => handleViewSelectionButtonClick(event)}>Heat</p>,
                    ], "", "View Type")}
                    <br></br>
                    <button id="run-simple-search-button" onClick={e => runSimpleSearch()}>
                        Run It
                    </button>
                </div>
            </div>
        </div>
    )
}
export default SimpleSearchBox