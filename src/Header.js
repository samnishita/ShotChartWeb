import './Header.css'
import { useEffect, useState } from "react";
import SearchTypeButtons from './SearchTypeButtons';

function Header(props) {
    const [initState, setInitState] = useState([])
    async function getInitData() {
        await fetch("https://customnbashotcharts.com:8443/shots_request?init=true", {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                setInitState(data.init)
            }).catch(error => console.log('error', error))
    }
    useEffect(() => { getInitData() }, [])
    return (
        <header className='Header'>
            <div class="header-grid-item" id="title">Custom NBA Shot Charts
                {props.isMobile ? <br style={{ fontFamily: "MontserratSemiBold" }}></br> : ""}
                {<SearchTypeButtons isMobile={props.isMobile} setTitle={props.setTitle} whichSearchBox={props.whichSearchBox} title={props.title} isLoading={props.isLoading} setIsLoading={props.setIsLoading}
                    allSearchData={props.allSearchData} allAdvancedSearchData={props.allAdvancedSearchData} isCurrentViewSimple={props.isCurrentViewSimple}
                    latestAdvancedViewType={props.latestAdvancedViewType} simpleClickHandler={props.handleSimpleClick} advancedClickHandler={props.handleAdvancedClick}
                    setAllSearchData={props.setAllSearchData} setAllAdvancedSearchData={props.setAllAdvancedSearchData} setIsCurrentViewSimple={props.setIsCurrentViewSimple}
                    latestSimpleViewType={props.latestSimpleViewType} setShotPercentageData={props.setShotPercentageData} />}
            </div>
            <div class="header-grid-item" id="date-accuracy">
                <div id='accuracy-title'>Accurate Through</div>
                <div id='accuracy-date'>{initState.length !== 0 ? initState[2].value : ""}</div>
            </div>
        </header>
    );
}

export default Header;