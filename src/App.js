import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import ShotPercentageView from './ShotPercentageView';
import React, { useEffect, useState, useRef } from 'react';
import { BrowserView, isMobile, MobileView } from 'react-device-detect';
import ShootingBezier from './ShootingBezier';
import githubLogo from './images/GitHub-Mark-Light-64px.png'

const App = () => {
  const currentYear = '2020-21'
  const [size, setWindowSize] = useState([window.innerHeight, window.innerWidth])
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Classic")
  const [latestAdvancedViewType, setLatestAdvancedViewType] = useState("Classic")
  const [allSearchData, setAllSearchData] = useState({})
  const [allAdvancedSearchData, setAllAdvancedSearchData] = useState({})
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState({ state: false, newShots: true })
  const [isCurrentViewSimple, setIsCurrentViewSimple] = useState(!window.location.href.includes("Advanced"))
  const [textAreaText, setTextAreaText] = useState({ id: null, text: "" })
  const [simpleSelectedYear, setSimpleSelectedYear] = useState(currentYear);
  const [simpleSelectedPlayer, setSimpleSelectedPlayer] = useState({
    id: 203932,
    playerfirstname: "Aaron",
    playerlastname: "Gordon"
  });
  const [shotPercentageData, setShotPercentageData] = useState({})
  const [hexAverages, setHexAverages] = useState({})
  const [zoneAverages, setZoneAverages] = useState({})
  const [simpleSelectedSeason, setSimpleSelectedSeason] = useState("Regular Season");
  const [initPlayers, setInitPlayers] = useState([])
  const [initPlayersReverseMap, setInitPlayersReverseMap] = useState([])
  const simpleSearchBoxRef = useRef({})
  simpleSearchBoxRef.current =
    <SimpleSearchBox testid="SimpleSearchBox-test"
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
      setShotPercentageData={setShotPercentageData}
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
  advancedSearchBoxRef.current = <AdvancedSearchBox testid="AdvancedSearchBox-test"
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
    isMobile={isMobile}
    setShotPercentageData={setShotPercentageData} />

  const shootingBezierSimpleRef = useRef({})
  shootingBezierSimpleRef.current = <ShootingBezier testid="ShootingBezier-simple-test" size={size} isLoading={isLoading}
    allSearchData={allSearchData} isCurrentViewSimple={true} />
  const shootingBezierAdvancedRef = useRef({})
  shootingBezierAdvancedRef.current = <ShootingBezier testid="ShootingBezier-advanced-test" size={size} isLoading={isLoading}
    allSearchData={allAdvancedSearchData} isCurrentViewSimple={false} />

  const shotViewSimpleRef = useRef({})
  shotViewSimpleRef.current = <ShotView testid="ShotView-simple-test" size={size} title={title} isLoading={isLoading} setIsLoading={setIsLoading} isMobile={isMobile}
    allSearchData={allSearchData} isCurrentViewSimple={true} latestSimpleViewType={latestSimpleViewType} hexAverages={hexAverages} zoneAverages={zoneAverages} />
  const shotViewAdvancedRef = useRef({})
  shotViewAdvancedRef.current = <ShotView testid="ShotView-advanced-test" size={size} title={title} isLoading={isLoading} setIsLoading={setIsLoading} isMobile={isMobile}
    allSearchData={allAdvancedSearchData} isCurrentViewSimple={false} latestAdvancedViewType={latestAdvancedViewType} hexAverages={hexAverages} zoneAverages={zoneAverages} />

  const shotPercentageViewSimpleRef = useRef({})
  shotPercentageViewSimpleRef.current = <ShotPercentageView testid="ShotPercentageView-simple-test" simpleShotData={shotPercentageData} isCurrentViewSimple={isCurrentViewSimple} isLoading={isLoading} />
  const shotPercentageViewAdvancedRef = useRef({})
  shotPercentageViewAdvancedRef.current = <ShotPercentageView testid="ShotPercentageView-advanced-test" style={{ marginLeft: "0px", marginRight: "0px" }} advancedShotData={shotPercentageData} isCurrentViewSimple={false} isLoading={isLoading} />

  const headerRef = useRef({})
  headerRef.current = <Header testid="Header-test" isMobile={isMobile} setTitle={setTitle} whichSearchBox={whichSearchBox} title={title} isLoading={isLoading} setIsLoading={setIsLoading}
    allSearchData={allSearchData} allAdvancedSearchData={allAdvancedSearchData} isCurrentViewSimple={isCurrentViewSimple}
    latestAdvancedViewType={latestAdvancedViewType} simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick}
    setAllSearchData={setAllSearchData} setAllAdvancedSearchData={setAllAdvancedSearchData} setIsCurrentViewSimple={setIsCurrentViewSimple}
    latestSimpleViewType={latestSimpleViewType} setShotPercentageData={setShotPercentageData}
  />
  const sizeRef = useRef({})
  sizeRef.current = size

  const maxTries = 3

  function getInitPlayersData(tries) {
    let players = {}, playersReverse = {}
    let response = getSearchData("https://customnbashotcharts.com/shots_request?initallplayers=true")
      .then(res => {
        for (let i = 0; i < res.initallplayers.length; i++) {
          let nameArray = [res.initallplayers[i].id, res.initallplayers[i].firstname, res.initallplayers[i].lastname]
          players[(res.initallplayers[i].firstname + " " + res.initallplayers[i].lastname).trim()] = nameArray;
          playersReverse[res.initallplayers[i].id] = nameArray;
        }
        setInitPlayers(players)
        setInitPlayersReverseMap(playersReverse)
        return res
      }).catch(error => {
        if (tries < maxTries) {
          getInitPlayersData(tries + 1)
        }
      })
    return response
  }
  async function getSearchData(url) {
    const response = await fetch(url, {
      method: 'GET'
    }).then(res => res.json())
      .then(data => {
        return data
      }).catch(error => "")
    return response
  }

  function getShotTypesData(tries) {
    getSearchData("https://customnbashotcharts.com/shots_request?shottypes=true")
      .then(res => {
        setShotTypes(res.shottypes.map(value => value.playtype))
      }).catch(error => {
        if (tries < maxTries) {
          getShotTypesData(tries + 1)
        }
      })
  }

  function handleSimpleClick() {
    setIsCurrentViewSimple(true)
  }

  function handleAdvancedClick() {
    setIsCurrentViewSimple(false)
  }

  const acceptedTargets = ["year-dd", "player-dd", "season-type-dd", "view-selection-dd",
    "year-advanced-dd-begin", "year-advanced-dd-end", "player-advanced-dd", "season-advanced-dd",
    "distance-dd-begin", "distance-dd-end", "success-dd", "shot-value-dd", "shot-types-dd", "shooting-teams-dd",
    "home-teams-dd", "away-teams-dd", "court-areas-dd", "court-sides-dd", "view-selection-adv-dd"]

  function hideDD(event) {
    let willPass = true
    acceptedTargets.forEach(eachTarget => {
      if (willPass && event.target.classList.contains(eachTarget)) {
        willPass = false
      }
    });
    if (willPass) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          setTextAreaText({ id: null, text: "" })
        }
      }
    }
  }
  window.onclick = hideDD;

  function handleDDButtonClick(event, type) {
    hideDD(event);
    var dropdowns = document.getElementsByClassName("dropdown-content");
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
          event.target.blur()
        } else if (!dropdown.classList.contains('show') && acceptedTargets.includes(type)) {
          document.getElementById(type).classList.toggle("show")
        }
      }
    }
  };

  function handleResize() {
    if (sizeRef.current[0] !== window.innerHeight || sizeRef.current[1] !== window.innerWidth) {
      setWindowSize([window.innerHeight, window.innerWidth])
    }
  }

  async function getHexAverages(tries) {
    return await getSearchData("https://customnbashotcharts.com/shots_request?gridaverages=true")
      .then(res => {
        let averageJson = {}
        res.gridaverages.forEach(each => averageJson[each.uniqueid] = each.average)
        setHexAverages(averageJson)
      }).catch(error => {
        if (tries < maxTries) {
          getHexAverages(tries + 1)
        }
      })
  }

  async function getZoneAverages(tries) {
    return await getSearchData("https://customnbashotcharts.com/shots_request?zoneaverages=true")
      .then(res => {
        let averageJson = {}
        res.zoneaverages.forEach(each => averageJson[each.uniqueid] = each.average)
        setZoneAverages(averageJson)
      }).catch(error => {
        if (tries < maxTries) {
          getShotTypesData(tries + 1)
        }
      })
  }

  useEffect(() => {
    getInitPlayersData(0)
    getHexAverages(0)
    getZoneAverages(0)
    getShotTypesData(0)
    setInterval(() => handleResize(), 100)
  }, [])

  useEffect(() => {
    setAllSearchData({})
    setAllAdvancedSearchData({})
  }, [isCurrentViewSimple])

  useEffect(() => {
    if (allSearchData.shots === null) {
      setIsLoading({ state: true, newShots: true })
    }
  }, [allSearchData])

  useEffect(() => {
    if (allAdvancedSearchData.shots === null) {
      setIsLoading({ state: true, newShots: true })
    }
  }, [allAdvancedSearchData])

  let gridDisplay
  if (isCurrentViewSimple) {
    gridDisplay = <div className="BaseGrid" style={(isMobile || !isCurrentViewSimple) ? { display: "block", maxWidth: "95vw", } : {}}>
      <div className="basegrid-grid-item">
        {simpleSearchBoxRef.current}
        {shootingBezierSimpleRef.current}
      </div>
      <div className="basegrid-grid-item" id="shotview-grid-item">
        {shotViewSimpleRef.current}
      </div>
      <div className="basegrid-grid-item"  >
        {shotPercentageViewSimpleRef.current}
      </div>
    </div>
  } else {
    gridDisplay = <div className="BaseGridAdvanced" style={(isMobile) ? { display: "block" } : {}}>
      <div id="advanced-grid-item" height="100%">
        {advancedSearchBoxRef.current}
      </div>
      <div className="basegrid-grid-item-advanced" id="shotview-grid-item" >
        {shotViewAdvancedRef.current}
      </div>
      <div className="basegrid-grid-item-advanced" id="shooting-bezier-grid-item">
        {shotPercentageViewAdvancedRef.current}
        {shootingBezierAdvancedRef.current}
      </div>
    </div>
  }

  return (
    <div className="App" data-testid="App-test" style={isMobile ? { maxWidth: "100vw", width: "100vw", minWidth: "100vw" } : {}}>
      {headerRef.current}
      {gridDisplay}
      <footer>
        <a data-testid="footer-test" href="https://github.com/samnishita/ShotChartWeb"><img src={githubLogo} alt="link to github repository"></img></a>
      </footer>
    </div >
  );
}
export default App;
