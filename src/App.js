import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const currentYear = '2020-21'

  const [latestSimpleSearchData, setLatestSimpleSearchData] = useState()
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  const [latestAdvancedViewType, setLatestAdvancedViewType] = useState("Traditional")
  const [allSearchData, setAllSearchData] = useState({})
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAnimation, setLoadingAnimation] = useState("")
  const [isCurrentViewSimple, setIsCurrentViewSimple] = useState(true)
  const [keyPressedState, setKeyPressedState] = useState(() => (event) => {
    handleKeyPressed(event)
  })
  const [keyPressedBuilder, setKeyPressedBuilder] = useState({ id: null, builder: "" })
  const [simpleSelectedYear, setSimpleSelectedYear] = useState(currentYear);
  const [simpleSelectedPlayer, setSimpleSelectedPlayer] = useState({
    id: 203932,
    playerfirstname: "Aaron",
    playerlastname: "Gordon"
  });
  const [simpleSelectedSeason, setSimpleSelectedSeason] = useState("Regular Season");
  const latestSimpleViewTypeRef = useRef({});
  latestSimpleViewTypeRef.current = latestSimpleViewType;
  const isLoadingRef = useRef({});
  isLoadingRef.current = isLoading;
  const loadingAnimationRef = useRef({})
  loadingAnimationRef.current = loadingAnimation
  const keyPressedStateRef = useRef({});
  keyPressedStateRef.current = keyPressedState;
  const keyPressedBuilderRef = useRef({});
  keyPressedBuilderRef.current = keyPressedBuilder;
  const [initPlayers, setInitPlayers] = useState([])
  const [initPlayersReverseMap, setInitPlayersReverseMap] = useState([])
  const initPlayersRef = useRef({})
  initPlayersRef.current = initPlayers
  const initPlayersReverseMapRef = useRef({})
  initPlayersReverseMapRef.current = initPlayersReverseMap
  const simpleSelectedYearRef = useRef({});
  simpleSelectedYearRef.current = simpleSelectedYear;
  const simpleSelectedPlayerRef = useRef({});
  simpleSelectedPlayerRef.current = simpleSelectedPlayer;
  const simpleSelectedSeasonRef = useRef({});
  simpleSelectedSeasonRef.current = simpleSelectedSeason;
  const [whichSearchBox, setWhichSearchBox] = useState(
    <SimpleSearchBox
      updateLatestSimpleSearchData={processSimpleSearchData}
      updateLatestSimpleViewType={(inputViewType) => {
        setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))
      }}
      latestSimpleViewType={latestSimpleViewTypeRef.current}
      setTitle={setTitle} setIsLoading={setIsLoading}
      setAllSearchData={setAllSearchData}
      isCurrentViewSimple={isCurrentViewSimple}
      keyPressedBuilder={keyPressedBuilderRef.current}
      handleDDButtonClick={handleDDButtonClick}
      currentYear={currentYear}
      getSearchData={getSearchData}
      initPlayers={initPlayersRef.current}
      initPlayersReverseMap={initPlayersReverseMapRef.current}
      selectedPlayer={simpleSelectedPlayerRef.current}
      setSelectedPlayer={setSimpleSelectedPlayer}
      selectedSeason={simpleSelectedSeasonRef.current}
      setSelectedSeason={setSimpleSelectedSeason}
      selectedYear={simpleSelectedYearRef.current}
      setSelectedYear={setSimpleSelectedYear}
    />)
  const whichSearchBoxRef = useRef({});
  whichSearchBoxRef.current = whichSearchBox;
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
    let players = {}
    let playersReverse = {}
    console.log("getInitPlayersData()")
    let response = getSearchData("https://customnbashotcharts.com:8443/shots_request?initallplayers=true")
      .then(res => {
        for (let i = 0; i < res.initallplayers.length; i++) {
          let nameArray = [res.initallplayers[i].id, res.initallplayers[i].firstname, res.initallplayers[i].lastname]
          players[(res.initallplayers[i].firstname + " " + res.initallplayers[i].lastname).trim()] = nameArray;
          playersReverse[res.initallplayers[i].id] = nameArray;
        }
        setInitPlayers(players)
        setInitPlayersReverseMap(playersReverse)
        //console.log(players)
        //console.log(playersReverse)
        return res
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

  function getShotTypesData() {
    getSearchData("https://customnbashotcharts.com:8443/shots_request?shottypes=true")
      .then(res => {
        setShotTypes(res.shottypes.map(value => value.playtype))
      })
  }

  function handleKeyPressed(event) {
    //console.log("KEYDOWN")
    //console.log(`${event.keyCode}: ${String.fromCharCode(event.keyCode)}`)
    //console.log(event.target.className)
    //console.log(activePlayersRef.current)
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
    if (string !== null) {
      //console.log(string)
      setKeyPressedBuilder({
        id: event.target.className,
        builder: string
      })
    }
  }

  function processSimpleSearchData(inputData) {
    setLatestSimpleSearchData(inputData, console.log("Updated latest search with" + inputData))
  }

  function handleSimpleClick() {
    setIsCurrentViewSimple(true)
  }

  function handleAdvancedClick() {
    setIsCurrentViewSimple(false)
  }
  function removeEventListener() {
    window.removeEventListener('keydown', keyPressedStateRef.current)
    setKeyPressedBuilder({ id: null, builder: "" })
    console.log("Removing event listener")
  }

  function addEventListener() {
    window.addEventListener('keydown', keyPressedStateRef.current)
    console.log("Adding event listener")
  }

  function hideDD(event) {
    console.log("hideDD()")
    //console.log(event.target)
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
    console.log("handleDDButtonClick()")
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
        console.log(dropdown)
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
    if (isCurrentViewSimple) {
      setWhichSearchBox(<SimpleSearchBox
        updateLatestSimpleSearchData={processSimpleSearchData}
        updateLatestSimpleViewType={(inputViewType) => {
          setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))
        }}
        latestSimpleViewType={latestSimpleViewTypeRef.current}
        setTitle={setTitle} setIsLoading={setIsLoading}
        setAllSearchData={setAllSearchData}
        isCurrentViewSimple={isCurrentViewSimple}
        keyPressedBuilder={keyPressedBuilderRef.current}
        handleDDButtonClick={handleDDButtonClick}
        currentYear={currentYear}
        getSearchData={getSearchData}
        initPlayers={initPlayersRef.current}
        initPlayersReverseMap={initPlayersReverseMapRef.current}
        selectedPlayer={simpleSelectedPlayerRef.current}
        setSelectedPlayer={setSimpleSelectedPlayer}
        selectedSeason={simpleSelectedSeasonRef.current}
        setSelectedSeason={setSimpleSelectedSeason}
        selectedYear={simpleSelectedYearRef.current}
        setSelectedYear={setSimpleSelectedYear}
      />)
    } else {
      setWhichSearchBox(<AdvancedSearchBox
        currentYear={currentYear}
        isCurrentViewSimple={isCurrentViewSimple}
        keyPressedBuilder={keyPressedBuilderRef.current}
        handleDDButtonClick={handleDDButtonClick}
        initPlayers={initPlayersRef.current}
        initPlayersReverseMap={initPlayersReverseMapRef.current}
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
    getInitPlayersData().then(res => {
      determineWhichView()
    })
    getShotTypesData()
  }, [])
  useEffect(() => {
    console.log(`useEffect for keyPressedBuilder`)
    console.log(isCurrentViewSimple)
    determineWhichView()
  }, [keyPressedBuilder])
  useEffect(() => {
    determineWhichView()
  }, [isCurrentViewSimple, simpleSelectedYear, simpleSelectedSeason, simpleSelectedPlayer])

  useEffect(() => {
    console.log(allAdvancedSearchParameters)
    determineWhichView()
  }, [allAdvancedSearchParameters])

  useEffect(() => {
    console.log("useEffect for latestAdvancedViewType")
    console.log(latestAdvancedViewType)
  }, [latestAdvancedViewType])

  useEffect(() => {
    console.log("useEffect for allSearchData")
    console.log(allSearchData)
    if (allSearchData.shots === null) {
      setIsLoading(true)
      console.log("Setting isLoading to true")
    }
  }, [allSearchData])

  useEffect(() => {
    console.log("useEffect for isLoading: ")
    console.log(isLoading)
  }, [isLoading])

  return (
    <div className="App">
      <Header />
      <div className="BaseGrid">
        <div >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBoxRef.current}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item">
          <ShotView title={title} isLoading={isLoadingRef.current} setIsLoading={setIsLoading}
            allSearchData={allSearchData} isCurrentViewSimple={isCurrentViewSimple} latestAdvancedViewType={latestAdvancedViewType} />
        </div>
      </div>
    </div >
  );
}
export default App;
