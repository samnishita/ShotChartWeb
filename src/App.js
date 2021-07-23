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
  const [allSearchData, setAllSearchData] = useState({})
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAnimation, setLoadingAnimation] = useState("")
  useEffect(() => {
    console.log(`isLoading changed to ${isLoading}`)
  }, [isLoading])
  useEffect(() => {
    console.log(`latestSimpleSearchData changed to ${latestSimpleSearchData}`)
  }, [latestSimpleSearchData])
  useEffect(() => {
    console.log(`allSearchData changed to `)
    console.log(allSearchData)
  }, [allSearchData])

  const latestSimpleViewTypeRef = useRef({});
  latestSimpleViewTypeRef.current = latestSimpleViewType;
  const [whichSearchBox, setWhichSearchBox] = useState(<SimpleSearchBox updateLatestSimpleSearchData={processSimpleSearchData}
    updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))}
    latestSimpleViewType={latestSimpleViewTypeRef.current} setTitle={setTitle} setIsLoading={setIsLoading} setAllSearchData={setAllSearchData} />)
  const isLoadingRef = useRef({});
  isLoadingRef.current = isLoading;
  const loadingAnimationRef = useRef({})
  loadingAnimationRef.current = loadingAnimation
  function processSimpleSearchData(inputData) {
    setLatestSimpleSearchData(inputData, console.log("Updated latest search with" + inputData))
  }
  function processLatestSimpleViewType(inputViewType) {
    setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))
  }

  function handleSimpleClick() {
    if (whichSearchBox !== <SimpleSearchBox />) {
      setWhichSearchBox(<SimpleSearchBox />)
    }
  }

  function handleAdvancedClick() {
    if (whichSearchBox !== <AdvancedSearchBox />) {
      setWhichSearchBox(<AdvancedSearchBox />)
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="BaseGrid">
        <div >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBox}
        </div>
        <div className="basegrid-grid-item" id="shotview-grid-item">
          <ShotView title={title} isLoading={isLoadingRef.current} setIsLoading={setIsLoading} allSearchData={allSearchData} />
        </div>
      </div>
    </div >
  );
}
export default App;
