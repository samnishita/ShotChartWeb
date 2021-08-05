import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';

const App = () => {
  console.log("RERENDER APP")
  console.log("isMobile: " + isMobile)
  const currentYear = '2020-21'
  const [size, setWindowSize] = useState([window.innerHeight, window.innerWidth])
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Classic")
  const [latestAdvancedViewType, setLatestAdvancedViewType] = useState("Classic")
  const [allSearchData, setAllSearchData] = useState({})
  const [allAdvancedSearchData, setAllAdvancedSearchData] = useState({})
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState({ state: false, newShots: true })
  const [isCurrentViewSimple, setIsCurrentViewSimple] = useState(!window.location.href.includes("Advanced"))
  const [keyPressedBuilder, setKeyPressedBuilder] = useState({ id: null, builder: "" })
  const [textAreaText, setTextAreaText] = useState({ id: null, text: "" })
  const [simpleSelectedYear, setSimpleSelectedYear] = useState(currentYear);
  const [simpleSelectedPlayer, setSimpleSelectedPlayer] = useState({
    id: 203932,
    playerfirstname: "Aaron",
    playerlastname: "Gordon"
  });
  const [simpleSelectedSeason, setSimpleSelectedSeason] = useState("Regular Season");
  const [initPlayers, setInitPlayers] = useState([])
  const [initPlayersReverseMap, setInitPlayersReverseMap] = useState([])
  const simpleSearchBoxRef = useRef({})
  simpleSearchBoxRef.current =
    <SimpleSearchBox
      updateLatestSimpleViewType={setLatestSimpleViewType}
      latestSimpleViewType={latestSimpleViewType}
      setTitle={setTitle} setIsLoading={setIsLoading}
      setAllSearchData={setAllSearchData}
      isCurrentViewSimple={isCurrentViewSimple}
      handleDDButtonClick={handleDDButtonClick}
      currentYear={currentYear}
      getSearchData={getSearchData}
      initPlayers={initPlayers}
      initPlayersReverseMap={initPlayersReverseMap}
      selectedPlayer={simpleSelectedPlayer}
      setSelectedPlayer={setSimpleSelectedPlayer}
      selectedSeason={simpleSelectedSeason}
      setSelectedSeason={setSimpleSelectedSeason}
      selectedYear={simpleSelectedYear}
      setSelectedYear={setSimpleSelectedYear}
      setTextAreaText={setTextAreaText}
      textAreaText={textAreaText}
      size={size}
      isMobile={isMobile}
    />

  const [whichSearchBox, setWhichSearchBox] = useState(simpleSearchBoxRef.current)
  const [shotTypes, setShotTypes] = useState([])
  const [allAdvancedSearchParameters, setAllAdvancedSearchParameters] = useState({
    "year-advanced-dd-begin": "",
    "year-advanced-dd-end": "",
    "player-advanced-dd": [],
    "season-advanced-dd": [],
    "distance-dd-begin": "",
    "distance-dd-end": "",
    "success-dd": "",
    "shot-value-dd": "",
    "shot-types-dd": [],
    "shooting-teams-dd": [],
    "home-teams-dd": [],
    "away-teams-dd": [],
    "court-areas-dd": [],
    "court-sides-dd": []
  })
  const advancedSearchBoxRef = useRef({})
  advancedSearchBoxRef.current = <AdvancedSearchBox
    currentYear={currentYear}
    isCurrentViewSimple={isCurrentViewSimple}
    handleDDButtonClick={handleDDButtonClick}
    initPlayers={initPlayers}
    initPlayersReverseMap={initPlayersReverseMap}
    shotTypes={shotTypes}
    allSearchParameters={allAdvancedSearchParameters}
    setAllSearchParameters={setAllAdvancedSearchParameters}
    latestAdvancedViewType={latestAdvancedViewType}
    setLatestAdvancedViewType={setLatestAdvancedViewType}
    setTitle={setTitle} setIsLoading={setIsLoading}
    updateLatestAdvancedViewType={setLatestAdvancedViewType}
    setAllSearchData={setAllAdvancedSearchData}
    setTextAreaText={setTextAreaText}
    textAreaText={textAreaText}
    size={size}
    isMobile={isMobile} />

  const sizeRef = useRef({})
  sizeRef.current = size

  function getInitPlayersData() {
    console.log("getInitPlayersData()")
    let players = {}, playersReverse = {}
    let response = getSearchData("https://customnbashotcharts.com:8443/shots_request?initallplayers=true")
      .then(res => {
        for (let i = 0; i < res.initallplayers.length; i++) {
          let nameArray = [res.initallplayers[i].id, res.initallplayers[i].firstname, res.initallplayers[i].lastname]
          players[(res.initallplayers[i].firstname + " " + res.initallplayers[i].lastname).trim()] = nameArray;
          playersReverse[res.initallplayers[i].id] = nameArray;
        }
        setInitPlayers(players)
        setInitPlayersReverseMap(playersReverse)
        return res
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

  function getShotTypesData() {
    console.log("getShotTypesData()")
    getSearchData("https://customnbashotcharts.com:8443/shots_request?shottypes=true")
      .then(res => {
        setShotTypes(res.shottypes.map(value => value.playtype))
      })
  }

  function handleSimpleClick() {
    console.log("handleSimpleClick()")
    setIsCurrentViewSimple(true)
  }

  function handleAdvancedClick() {
    console.log("handleAdvancedClick()")
    setIsCurrentViewSimple(false)
  }

  const acceptedTargets = ["year-dd", "player-dd", "season-type-dd", "view-selection-dd",
    "year-advanced-dd-begin", "year-advanced-dd-end", "player-advanced-dd", "season-advanced-dd",
    "distance-dd-begin", "distance-dd-end", "success-dd", "shot-value-dd", "shot-types-dd", "shooting-teams-dd",
    "home-teams-dd", "away-teams-dd", "court-areas-dd", "court-sides-dd", "view-selection-adv-dd"]

  function hideDD(event) {
    console.log(`hideDD(${event})`)
    console.log(event.target.classList)
    let willPass = true
    acceptedTargets.forEach(eachTarget => {
      if (willPass && event.target.classList.contains(eachTarget)) {
        willPass = false
      }
    });
    // if (!event.target.classList.contains("year-dd") && !event.target.classList.contains("player-dd") && !event.target.classList.contains("season-type-dd") && !event.target.classList.contains("view-selection-dd") && !event.target.classList.contains("year-advanced-dd-begin")) {
    if (willPass) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          console.log("reseting textarea")
          setTextAreaText({ id: null, text: "" })
        }
      }
    }
  }
  window.onclick = hideDD;

  function handleDDButtonClick(event, type) {
    console.log(`handleDDButtonClick(${event},${type})`)
    hideDD(event);
    var dropdowns = document.getElementsByClassName("dropdown-content");
    console.log(type)
    console.log(acceptedTargets.includes(type))
    for (let i = 0; i < dropdowns.length; i++) {
      var dropdown = dropdowns[i];
      if (dropdown.id !== type) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      } else {
        if (dropdown.classList.contains('show') && !event.target.classList.contains("text-area")) {
          dropdown.classList.remove('show');
        } else if (dropdown.classList.contains('show') && event.target.classList.contains("text-area") && event.key === "Enter") {
          dropdown.classList.remove('show');
        } else if (!dropdown.classList.contains('show') && acceptedTargets.includes(type)) {
          console.log("showing")
          document.getElementById(type).classList.toggle("show")
        }
      }
    }
  };

  function determineWhichView() {
    console.log("determineWhichView()")
    /*
    console.log(isCurrentViewSimple)
    if (isCurrentViewSimple) {
      if (document.getElementById("simple-search-box") && !document.getElementById("simple-search-box").classList.contains("show")) {
        console.log("Showing simple")
        document.getElementById("simple-search-box").classList.toggle("show")
        document.getElementById("advanced-search-box").classList.remove("show")
      }
    } else {
      console.log(document.getElementById("advanced-search-box"))
      if (document.getElementById("advanced-search-box")) {
        console.log(document.getElementById("advanced-search-box").classList.contains("show"))
      }
      if (document.getElementById("advanced-search-box") && !document.getElementById("advanced-search-box").classList.contains("show")) {
        console.log("Showing advanced")
        document.getElementById("simple-search-box").classList.remove("show")
        document.getElementById("advanced-search-box").classList.toggle("show")
      }
    }
    */
  }

  function handleResize() {
    if (sizeRef.current[0] !== window.innerHeight || sizeRef.current[1] !== window.innerWidth) {
      console.log("handleResize()")
      console.log("Size Not Okay")
      console.log(`${window.innerHeight}!=${sizeRef.current[0]} OR ${window.innerWidth}!=${sizeRef.current[1]}`)
      setWindowSize([window.innerHeight, window.innerWidth])
    }
  }

  useEffect(() => {
    console.log("useEffect for App []")
    getInitPlayersData().then(res => {
      determineWhichView()
    })
    getShotTypesData()
    setInterval(() => handleResize(), 100)
  }, [])

  useEffect(() => {
    console.log(`useEffect for App keyPressedBuilder`)
    determineWhichView()
  }, [keyPressedBuilder])

  useEffect(() => {
    console.log("useEffect for App isCurrentViewSimple, simpleSelectedYear, simpleSelectedSeason, simpleSelectedPlayer")
    determineWhichView()
  }, [simpleSelectedYear, simpleSelectedSeason, simpleSelectedPlayer])

  useEffect(() => {
    console.log(`useEffect for App isCurrentViewSimple`)
    determineWhichView()
    setAllSearchData({})
    setAllAdvancedSearchData({})
  }, [isCurrentViewSimple])

  useEffect(() => {
    console.log("useEffect for App allAdvancedSearchParameters")
    determineWhichView()
  }, [allAdvancedSearchParameters])

  useEffect(() => {
    console.log(`useEffect for App latestAdvancedViewType = ${latestAdvancedViewType}`)
  }, [latestAdvancedViewType])

  useEffect(() => {
    console.log(`useEffect for App latestSimpleViewType = ${latestSimpleViewType}`)
  }, [latestSimpleViewType])

  useEffect(() => {
    console.log("useEffect for App allSearchData")
    console.log(allSearchData)
    if (allSearchData.shots === null) {
      setIsLoading({ state: true, newShots: true })
    }
  }, [allSearchData])

  useEffect(() => {
    console.log("useEffect for App allAdvancedSearchData")
    console.log(allAdvancedSearchData)
    if (allAdvancedSearchData.shots === null) {
      setIsLoading({ state: true, newShots: true })
    }
  }, [allAdvancedSearchData])

  useEffect(() => {
    console.log(`useEffect for App isLoading = ${isLoading}`)
  }, [isLoading])

  return (
    <div className="App" style={isMobile ? { minWidth: "500px" } : {}}>
      <Header isMobile={isMobile} setTitle={setTitle} whichSearchBox={whichSearchBox} title={title} isLoading={isLoading} setIsLoading={setIsLoading}
        allSearchData={allSearchData} allAdvancedSearchData={allAdvancedSearchData} isCurrentViewSimple={isCurrentViewSimple}
        latestAdvancedViewType={latestAdvancedViewType} simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick}
        setAllSearchData={setAllSearchData} setAllAdvancedSearchData={setAllAdvancedSearchData} setIsCurrentViewSimple={setIsCurrentViewSimple}
        latestSimpleViewType={latestSimpleViewType}
      />
      {isCurrentViewSimple ? <div className="BaseGrid" style={(isMobile || !isCurrentViewSimple) ? { display: "block" } : {}}>
        <div height="100%" id="simple-search-box-wrapper-div">
          {simpleSearchBoxRef.current}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item" >
          <ShotView size={size} title={title} isLoading={isLoading} setIsLoading={setIsLoading}
            allSearchData={allSearchData} isCurrentViewSimple={true} latestSimpleViewType={latestSimpleViewType} />
        </div>
      </div> : <div className="BaseGrid" style={(isMobile || !isCurrentViewSimple) ? { display: "block" } : {}}>
        <div height="100%">
          {advancedSearchBoxRef.current}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item" >
          <ShotView size={size} title={""} isLoading={isLoading} setIsLoading={setIsLoading}
            allSearchData={allAdvancedSearchData} isCurrentViewSimple={false} latestAdvancedViewType={latestAdvancedViewType} />
        </div>
      </div>}


    </div >
  );
}
export default App;
