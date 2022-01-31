import './SearchTypeButtons.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function SearchTypeButtons(props) {

    function displaySimple() {
        if (!props.isCurrentViewSimple) {
            props.setAllSearchData([])
            props.setShotPercentageData()
            props.setAllAdvancedSearchData([])
            props.setTitle("")
            setTimeout(() => {
                props.setIsCurrentViewSimple(true)
            }, 100);
        }
    }

    function displayAdvanced() {
        if (props.isCurrentViewSimple) {
            props.setAllAdvancedSearchData([])
            props.setShotPercentageData()
            props.setAllSearchData([])
            props.setTitle("")
            props.setIsCurrentViewSimple(false)
        }
    }

    //Styling to show which view type is currently shown
    const activeStyle = {
        borderBottom: "5px solid rgba(165, 80, 212, 0.8)",
        fontWeight: "bold",
    }
    //Styling to show which view type is not being shown
    const inActiveStyle = {
        fontWeight: "bold",
    }

    if (props.isMobile) {
        activeStyle.fontSize = "16px"
        inActiveStyle.fontSize = "16px"
        activeStyle.marginLeft = "15px"
        activeStyle.marginRight = "15px"
        inActiveStyle.marginLeft = "15px"
        inActiveStyle.marginRight = "15px"
    }

    /**
     * Changes button styling on mouse over if clicking the button will change the view
     * @param {Event} event mouse over event
     */
    function handleMouseHover(event) {
        if ((props.isCurrentViewSimple && event.target.id === "advanced-link") || (!props.isCurrentViewSimple && event.target.id === "simple-link")) {
            event.target.style.borderBottom = "5px solid white"
        }
    }

    /**
     * Changes button styling on mouse exit if the styling had been changed by a mouse over event
     * @param {Event} event mouse exit event
     */
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
            <div className="link" id="simple-link" data-testid="simple-link" style={props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displaySimple())} onMouseOver={((event) => { handleMouseHover(event) })} onMouseLeave={((event) => { handleMouseExit(event) })}>Simple Search</div>
            <div className="link" id="advanced-link" data-testid="advanced-link" style={!props.isCurrentViewSimple ? activeStyle : inActiveStyle} onClick={(() => displayAdvanced())} onMouseOver={((event) => { handleMouseHover(event) })} onMouseLeave={((event) => { handleMouseExit(event) })}>Advanced Search</div>
        </div>
    );
}

export default SearchTypeButtons