import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const [latestSimpleSearchData, setLatestSimpleSearchData] = useState()
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  const [latestAdvancedSearchData, setLatestAdvancedSearchData] = useState()
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
      removeEventListener={() => {
        window.removeEventListener('keydown', keyPressedStateRef.current)
        setKeyPressedBuilder({ id: null, builder: "" })
        console.log("Removing event listener")
      }}
      addEventListener={() => {
        window.addEventListener('keydown', keyPressedStateRef.current)
        console.log("Adding event listener")
      }}
    />)
  const whichSearchBoxRef = useRef({});
  whichSearchBoxRef.current = whichSearchBox;

  function handleKeyPressed(event) {
    console.log("KEYDOWN")
    //console.log(`${event.keyCode}: ${String.fromCharCode(event.keyCode)}`)
    //console.log(event.target.className)
    //console.log(activePlayersRef.current)
    let string
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
    if (string) {
      console.log(string)
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
    if (whichSearchBox !== <SimpleSearchBox />) {
      setWhichSearchBox(<SimpleSearchBox updateLatestSimpleSearchData={processSimpleSearchData}
        updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))}
        latestSimpleViewType={latestSimpleViewTypeRef.current} setTitle={setTitle} setIsLoading={setIsLoading} setAllSearchData={setAllSearchData} isCurrentViewSimple={isCurrentViewSimple} />)
      setIsCurrentViewSimple(true)
    }
  }

  function handleAdvancedClick() {
    if (whichSearchBox !== <AdvancedSearchBox />) {
      setWhichSearchBox(<AdvancedSearchBox />)
      setIsCurrentViewSimple(false)
    }
  }

  useEffect(() => {
    // console.log(whichSearchBox)
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
      removeEventListener={() => {
        window.removeEventListener('keydown', keyPressedStateRef.current)
        setKeyPressedBuilder({ id: null, builder: "" })
        console.log("Removing event listener")
      }}
      addEventListener={() => {
        window.addEventListener('keydown', keyPressedStateRef.current)
        console.log("Adding event listener")
      }}
    />)
  }, [keyPressedBuilder])

  return (
    <div className="App">
      <Header />
      <div className="BaseGrid">
        <div >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBoxRef.current}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item">
          <ShotView title={title} isLoading={isLoadingRef.current} setIsLoading={setIsLoading} allSearchData={allSearchData} />
        </div>
      </div>
    </div >
  );
}
export default App;
