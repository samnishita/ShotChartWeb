import './Header.css'
import { useEffect, useState } from "react";
import SearchTypeButtons from './SearchTypeButtons';

function Header(props) {
    const [initState, setInitState] = useState([])

    /**
     * Fetches initialization data and sets the initial state
     */
    async function getInitData() {
        await fetch("https://customnbashotcharts.com/shots_request?init=true", {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                setInitState(data.init)
            }).catch(error => console.log('error', error))
    }

    useEffect(() => {
        getInitData()
    }, [])

    if (props.isMobile) {
        return <header className='Header' style={{ gridTemplateRows: "70% 30%" }}>
            <div className="header-grid-item" id="title" style={{ fontSize: "30px" }}>Custom NBA Shot Charts
                <br style={{ fontFamily: "MontserratSemiBold" }}></br>
            </div>
            <div className="header-grid-item" id="date-accuracy" style={{ paddingTop: "10px" }}>
                <div id='accuracy-title' style={{ fontSize: "15px" }}>Accurate Through</div>
                <div id='accuracy-date' style={{ fontSize: "12px" }}>{initState.length !== 0 ? initState[2].value : ""}</div>
            </div>
            <div className="header-grid-item" style={{ gridColumn: " 1/ span 2", paddingTop: "5px" }}  >
                <SearchTypeButtons isMobile={props.isMobile} setTitle={props.setTitle} whichSearchBox={props.whichSearchBox} title={props.title} isLoading={props.isLoading} setIsLoading={props.setIsLoading}
                    allSearchData={props.allSearchData} allAdvancedSearchData={props.allAdvancedSearchData} isCurrentViewSimple={props.isCurrentViewSimple}
                    latestAdvancedViewType={props.latestAdvancedViewType} simpleClickHandler={props.handleSimpleClick} advancedClickHandler={props.handleAdvancedClick}
                    setAllSearchData={props.setAllSearchData} setAllAdvancedSearchData={props.setAllAdvancedSearchData} setIsCurrentViewSimple={props.setIsCurrentViewSimple}
                    latestSimpleViewType={props.latestSimpleViewType} setShotPercentageData={props.setShotPercentageData} />
            </div>
        </header>
    }

    return (
        <header className='Header' data-testid={props.testid}>
            <div className="header-grid-item" id="title">Custom NBA Shot Charts
                {props.isMobile ? <br style={{ fontFamily: "MontserratSemiBold" }}></br> : ""}
                {<SearchTypeButtons isMobile={props.isMobile} setTitle={props.setTitle} whichSearchBox={props.whichSearchBox} title={props.title} isLoading={props.isLoading} setIsLoading={props.setIsLoading}
                    allSearchData={props.allSearchData} allAdvancedSearchData={props.allAdvancedSearchData} isCurrentViewSimple={props.isCurrentViewSimple}
                    latestAdvancedViewType={props.latestAdvancedViewType} simpleClickHandler={props.handleSimpleClick} advancedClickHandler={props.handleAdvancedClick}
                    setAllSearchData={props.setAllSearchData} setAllAdvancedSearchData={props.setAllAdvancedSearchData} setIsCurrentViewSimple={props.setIsCurrentViewSimple}
                    latestSimpleViewType={props.latestSimpleViewType} setShotPercentageData={props.setShotPercentageData} />}
            </div>
            <div className="header-grid-item" id="date-accuracy">
                <div id='accuracy-title'>Accurate Through</div>
                <div id='accuracy-date'>{initState.length !== 0 ? initState[2].value : ""}</div>
            </div>
        </header>
    );
}

export default Header;