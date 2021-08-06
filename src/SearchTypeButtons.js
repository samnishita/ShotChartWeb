import './SearchTypeButtons.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function SearchTypeButtons(props) {

    function displaySimple() {
        console.log("displaySimple()")
        if (!props.isCurrentViewSimple) {
            props.setAllAdvancedSearchData([])
            props.setAllSearchData([])
            props.setTitle("")
            setTimeout(() => {
                props.setIsCurrentViewSimple(true)
            }, 100);
        }
    }

    function displayAdvanced() {
        console.log("displayAdvanced()")
        if (props.isCurrentViewSimple) {
            props.setAllAdvancedSearchData([])
            props.setAllSearchData([])
            props.setTitle("")
            props.setIsCurrentViewSimple(false)
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

    function handleMouseHover(event) {
        if ((props.isCurrentViewSimple && event.target.id === "advanced-link") || (!props.isCurrentViewSimple && event.target.id === "simple-link")) {
            event.target.style.borderBottom = "5px solid white"
        }
    }

    function handleMouseExit(event) {
        if ((props.isCurrentViewSimple && event.target.id === "advanced-link") || (!props.isCurrentViewSimple && event.target.id === "simple-link")) {
            event.target.style.borderBottom = ""
        }
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
            <div className="link" id="simple-link" style={props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displaySimple())} onMouseOver={((event) => { handleMouseHover(event) })} onMouseLeave={((event) => { handleMouseExit(event) })}>Simple Search</div>
            <div className="link" id="advanced-link" style={!props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displayAdvanced())} onMouseOver={((event) => { handleMouseHover(event) })} onMouseLeave={((event) => { handleMouseExit(event) })}>Advanced Search</div>
        </div>
    );
}

export default SearchTypeButtons