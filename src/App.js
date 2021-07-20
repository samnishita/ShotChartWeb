import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const [latestSimpleSearchData, setLatestSimpleSearchData] = useState({})
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  const [title, setTitle] = useState("")
  useEffect(() => {
    //console.log("Simple Search Data Changed")
    //console.log(latestSimpleSearchData)
  }, [latestSimpleSearchData])

  const latestSimpleViewTypeRef = useRef({});
  latestSimpleViewTypeRef.current = latestSimpleViewType;
  const [whichSearchBox, setWhichSearchBox] = useState(<SimpleSearchBox updateLatestSimpleSearchData={processSimpleSearchData}
    updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))}
    latestSimpleViewType={latestSimpleViewTypeRef.current} setTitle={setTitle} />)

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
          <ShotView simpleShotData={latestSimpleSearchData} updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))}
            latestSimpleViewType={latestSimpleViewTypeRef.current} title={title} />
        </div>
      </div>
    </div >
  );
}
export default App;
