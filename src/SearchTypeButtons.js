import './SearchTypeButtons.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function SearchTypeButtons(props) {

    function displaySimple() {
        console.log("displaySimple()")
        if (!props.isCurrentViewSimple) {
            props.setIsCurrentViewSimple(true)
            if (props.allSearchData.length !== 0 && !props.isLoading) {
                props.setAllSearchData([])
            }
            if (props.allAdvancedSearchData.length !== 0 && !props.isLoading) {
                props.setAllAdvancedSearchData([])
            }
        }
    }

    function displayAdvanced() {
        console.log("displayAdvanced()")
        if (props.isCurrentViewSimple) {
            props.setIsCurrentViewSimple(false)
            if (props.allSearchData.length !== 0 && !props.isLoading) {
                props.setAllSearchData([])
            }
            if (props.allAdvancedSearchData.length !== 0 && !props.isLoading) {
                props.setAllAdvancedSearchData([])
            }
        }
    }

    const activeStyle = {
        borderBottom: "5px solid rgba(165, 80, 212, 0.8)",
        fontWeight: "bold"
    }

    return (
        <div className="SearchTypeButtons">
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
        </div>
    );
}

export default SearchTypeButtons