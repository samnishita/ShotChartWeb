import './App.css';
import Header from './Header'
import SimpleSearchBox from './SimpleSearchBox'
import ShotView from './ShotView'
import AdvancedSearchBox from './AdvancedSearchBox';
import SearchTypeButtons from './SearchTypeButtons';
import React, { useEffect, useState, useRef } from 'react';
import ShotPercentageView from './ShotPercentageView';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
import { Arc } from 'react-svg-path'

const App = () => {
  const [latestSimpleSearchData, setLatestSimpleSearchData] = useState({})
  const [latestSimpleViewType, setLatestSimpleViewType] = useState("Traditional")
  //const [shotPercentageData, setShotPercentageData] = useState({})

  const latestSimpleViewTypeRef = useRef({});
  latestSimpleViewTypeRef.current = latestSimpleViewType;
  const [whichSearchBox, setWhichSearchBox] = useState(<SimpleSearchBox updateLatestSimpleSearchData={processSimpleSearchData}
    updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))} latestSimpleViewType={latestSimpleViewTypeRef.current} />)

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
  //6:            d="M578.5 76 l-210 137"
  //4:

  return (
    <div className="App">
      <Header />
      <div className="BaseGrid">
        <div className="basegrid-grid-item" >
          <SearchTypeButtons simpleClickHandler={handleSimpleClick} advancedClickHandler={handleAdvancedClick} />
          {whichSearchBox}
        </div>
        <div className="basegrid-grid-item">
          <ShotView simpleShotData={latestSimpleSearchData} updateLatestSimpleViewType={(inputViewType) => setLatestSimpleViewType(inputViewType, console.log("Updated view type with " + inputViewType))} latestSimpleViewType={latestSimpleViewTypeRef.current} />
        </div>

      </div>

    </div>
  );
}
/*
<Arc
            sx={10}
            sy={40}
            rx={50}
            ry={85}
            rotation={0}
            arc={0}
            sweep={1}
            ex={70}
            ey={40}
            stroke="#0e98dd"
            strokeWidth={1}
            fill="#ffffff"
          />
*/
export default App;
