import './Header.css'
import { useEffect, useState } from "react";

function Header() {
    const [initState, setInitState] = useState([])
    async function getInitData() {
        const response = await fetch("https://customnbashotcharts.com:8443/shots_request?init=true", {
            method: 'GET'
        }).then(res => res.json())
            .then(data => {
                setInitState(data.init)
            }).catch(error => console.log('error', error))
    }
    useEffect(() => { getInitData() }, [])
    return (
        <header className='Header'>
            <div class="header-grid-item" id="title">Custom NBA Shot Charts <span id='versionText'>By Sam Nishita</span></div>
            <div class="header-grid-item" id="date-accuracy">
                <div id='accuracy-title'><u>Accurate As Of</u></div>
                <div id='accuracy-date'>{initState.length !== 0 ? initState[2].value : ""}</div>
            </div>
        </header>
    );
}

export default Header;