import './SearchTypeButtons.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function SearchTypeButtons(props) {

    function displaySimple() {
        console.log("displaySimple()")
        if (!props.isCurrentViewSimple) {
            props.setIsCurrentViewSimple(true)
            props.setAllSearchData([])
            props.setAllAdvancedSearchData([])
            props.setTitle("")
        }
    }

    function displayAdvanced() {
        console.log("displayAdvanced()")
        if (props.isCurrentViewSimple) {
            props.setIsCurrentViewSimple(false)
            props.setAllSearchData([])
            props.setAllAdvancedSearchData([])
            props.setTitle("")
        }
    }

    const activeStyle = {
        borderBottom: "5px solid rgba(165, 80, 212, 0.8)",
        fontWeight: "bold",
    }
    const inActiveStyle = {
        fontWeight: "bold",
    }

    if (props.isMobile) {
        activeStyle.fontSize = "16px"
        inActiveStyle.fontSize = "16px"
        activeStyle.marginLeft = "10px"
        inActiveStyle.marginLeft = "10px"
    }

    /*
<Router>
                <div style={{ height: "100%" }}>
                    <Link className="link" id="simple-link" style={props.isCurrentViewSimple ? activeStyle : {}} to="/" onClick={(() => displaySimple())}>Simple Search</Link>
                    <Link className="link" id="advanced-link" style={!props.isCurrentViewSimple ? activeStyle : {}} to="/Advanced" onClick={(() => displayAdvanced())}>Advanced Search</Link>
                    <Switch>
                        <Route path="/">
                            {!window.location.href.includes("Advanced") ? displaySimple() : console.log("Skipping Advanced")}
                        </Route>
                        <Route path="/Advanced">
                            {window.location.href.includes("Advanced") ? displayAdvanced() : console.log("Skipping Simple")}
                        </Route>
                    </Switch>
                </div>
            </Router>
    */

    return (
        <div className="SearchTypeButtons">
            <div className="link" id="simple-link" style={props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displaySimple())}>Simple Search</div>
            <div className="link" id="advanced-link" style={!props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displayAdvanced())}>Advanced Search</div>
        </div>
    );
}

export default SearchTypeButtons