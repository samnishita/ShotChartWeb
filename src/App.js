import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  console.log("RERENDER APP")
  const currentYear = '2020-21'
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  const [latestAdvancedViewType, setLatestAdvancedViewType] = useState("Traditional")
  const [allSearchData, setAllSearchData] = useState({})
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrentViewSimple, setIsCurrentViewSimple] = useState(true)
  const [keyPressedState, setKeyPressedState] = useState(() => event => handleKeyPressed(event))
  const [keyPressedBuilder, setKeyPressedBuilder] = useState({ id: null, builder: "" })
  const [simpleSelectedYear, setSimpleSelectedYear] = useState(currentYear);
  const [simpleSelectedPlayer, setSimpleSelectedPlayer] = useState({
    id: 203932,
    playerfirstname: "Aaron",
    playerlastname: "Gordon"
  });
  const [simpleSelectedSeason, setSimpleSelectedSeason] = useState("Regular Season");
  const keyPressedStateRef = useRef({});
  keyPressedStateRef.current = keyPressedState;
  const keyPressedBuilderRef = useRef({});
  keyPressedBuilderRef.current = keyPressedBuilder;
  const [initPlayers, setInitPlayers] = useState([])
  const [initPlayersReverseMap, setInitPlayersReverseMap] = useState([])
  const simpleSearchBoxRef = useRef({})
  simpleSearchBoxRef.current =
    <SimpleSearchBox
      updateLatestSimpleViewType={setLatestSimpleViewType}
      //latestSimpleViewType={latestSimpleViewTypeRef.current}
      latestSimpleViewType={latestSimpleViewType}
      setTitle={setTitle} setIsLoading={setIsLoading}
      setAllSearchData={setAllSearchData}
      isCurrentViewSimple={isCurrentViewSimple}
      keyPressedBuilder={keyPressedBuilderRef.current}
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
    />
  const [whichSearchBox, setWhichSearchBox] = useState(simpleSearchBoxRef.current)
  const [shotTypes, setShotTypes] = useState([])
  const [allAdvancedSearchParameters, setAllAdvancedSearchParameters] = useState({
    "year-advanced-dd-begin": "",
    "year-advanced-dd-end": "",
    "player-advanced-dd": [],
    "season-advanced-dd": [],
    "distance-begin": "",
    "distance-end": "",
    "success": "",
    "shot-value": "",
    "shot-types": [],
    "shooting-teams": [],
    "home-teams": [],
    "away-teams": [],
    "court-areas": [],
    "court-sides": []
  })

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

  function handleKeyPressed(event) {
    console.log(`handleKeyPressed(${event})`)
    let string = null
    if (event.keyCode === 8 && keyPressedBuilderRef.current.builder.length > 0) {
      string = keyPressedBuilderRef.current.builder.substring(0, keyPressedBuilderRef.current.builder.length - 1)
      console.log(string)
    } else if (event.keyCode === 222) {
      string = keyPressedBuilderRef.current.builder + "'"
    } else if (event.keyCode === 189) {
      string = keyPressedBuilderRef.current.builder + "-"
    } else if ((event.keyCode >= 48 && event.keyCode <= 90) || event.keyCode === 32) {
      string = keyPressedBuilderRef.current.builder + String.fromCharCode(event.keyCode)
    }
    console.log(event.target)
    //Safari does not recognize correct event target
    if (string !== null) {
      setKeyPressedBuilder({
        id: event.target.className,
        builder: string
      })
    }
  }

  function handleSimpleClick() {
    console.log("handleSimpleClick()")
    setIsCurrentViewSimple(true)
  }

  function handleAdvancedClick() {
    console.log("handleAdvancedClick()")
    setIsCurrentViewSimple(false)
  }

  function removeEventListener() {
    console.log("Removing event listener")
    window.removeEventListener('keydown', keyPressedStateRef.current)
    setKeyPressedBuilder({ id: null, builder: "" })
  }

  function addEventListener() {
    console.log("Adding event listener")
    window.addEventListener('keydown', keyPressedStateRef.current)
  }

  function hideDD(event) {
    console.log(`hideDD(${event})`)
    if (!event.target.matches('.dropdown-button') && !event.target.matches('.dropdown-button-display') && !event.target.matches('.arrow-path') && !event.target.matches('.arrow-svg') && !event.target.matches('.arrow')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
          removeEventListener()
        }
      }
    }
  }
  window.onclick = hideDD;

  function handleDDButtonClick(event, type) {
    console.log(`handleDDButtonClick(${event},${type})`)
    hideDD(event);
    var dropdowns = document.getElementsByClassName("dropdown-content");
    let shouldAddEventListener = false
    for (let i = 0; i < dropdowns.length; i++) {
      var dropdown = dropdowns[i];
      if (dropdown.id !== type) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
          removeEventListener()
        }
      } else {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
          removeEventListener()
        } else {
          shouldAddEventListener = true
          document.getElementById(type).classList.toggle("show")
        }
      }
    }
    if (shouldAddEventListener) {
      addEventListener()
    }
  };

  function determineWhichView() {
    console.log("determineWhichView()")
    if (isCurrentViewSimple) {
      setWhichSearchBox(simpleSearchBoxRef.current)
    } else {
      setWhichSearchBox(<AdvancedSearchBox
        currentYear={currentYear}
        isCurrentViewSimple={isCurrentViewSimple}
        keyPressedBuilder={keyPressedBuilderRef.current}
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
        setAllSearchData={setAllSearchData}
      />)
    }
  }
  useEffect(() => {
    console.log("useEffect for App []")
    getInitPlayersData().then(res => {
      determineWhichView()
    })
    getShotTypesData()
  }, [])

  useEffect(() => {
    console.log(`useEffect for App keyPressedBuilder`)
    determineWhichView()
  }, [keyPressedBuilder])

  useEffect(() => {
    console.log("useEffect for App isCurrentViewSimple, simpleSelectedYear, simpleSelectedSeason, simpleSelectedPlayer")
    determineWhichView()
  }, [isCurrentViewSimple, simpleSelectedYear, simpleSelectedSeason, simpleSelectedPlayer])

  useEffect(() => {
    console.log("useEffect for App allAdvancedSearchParameters")
    determineWhichView()
  }, [allAdvancedSearchParameters])

  useEffect(() => {
    console.log(`useEffect for App latestAdvancedViewType = ${latestAdvancedViewType}`)
  }, [latestAdvancedViewType])

  useEffect(() => {
    console.log("useEffect for App allSearchData")
    if (allSearchData.shots === null) {
      setIsLoading(true)
    }
  }, [allSearchData])

  useEffect(() => {
    console.log(`useEffect for App isLoading = ${isLoading}`)
  }, [isLoading])

  return (
    <div className="App">
      <Header />
      <div className="BaseGrid">
        <div >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBox}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item">
          <ShotView title={title} isLoading={isLoading} setIsLoading={setIsLoading}
            allSearchData={allSearchData} isCurrentViewSimple={isCurrentViewSimple} latestAdvancedViewType={latestAdvancedViewType} />
        </div>
      </div>
    </div >
  );
}
export default App;
