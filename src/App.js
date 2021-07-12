import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';
import ShotPercentageView from './ShotPercentageView';


const App = () => {
  const [latestSimpleSearchData, setLatestSimpleSearchData] = useState({})
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  //const [shotPercentageData, setShotPercentageData] = useState({})

  const latestSimpleViewTypeRef = useRef({});
  latestSimpleViewTypeRef.current = latestSimpleViewType;
  const [whichSearchBox, setWhichSearchBox] = useState(<SimpleSearchBox updateLatestSimpleSearchData={processSimpleSearchData}
    updateLatestSimpleViewType={processLatestSimpleViewType} latestSimpleViewType={latestSimpleViewTypeRef.current} />)

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
        <div className="basegrid-grid-item" >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBox}
        </div>
        <div className="basegrid-grid-item">
          <ShotView simpleShotData={latestSimpleSearchData} viewType={latestSimpleViewTypeRef.current} />
        </div>
      </div>

    </div>
  );
}
export default App;
