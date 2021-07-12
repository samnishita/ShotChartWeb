import './AdvancedSearchBox.css'
import SelectionViewer from './SelectionViewer'
import ShotPercentageView from './ShotPercentageView'

function AdvancedSearchBox() {
    function makeButton(name) {
        return <button class="dropdown-button">
            {name}
        </button>
    }
    return (
        <div className="AdvancedSearchBox">
            <div className="search-box-body">
                <div className='search-box-inner-body'>
                    <h6>Choose your search parameters</h6>
                    <div id='selection-scrollable'>
                        <p>Seasons: <button>Begin</button> - <button>End</button></p>
                        <p>Players: {makeButton("Choose Players")}</p>
                        <p>Season Types: {makeButton("Choose Season Types")}</p>
                        <p>Shot Distance (ft.): <button>Begin</button> - <button>End</button></p>
                        <p>Shot Success: {makeButton("Choose Makes or Misses")}</p>
                        <p>Shot Value: {makeButton("Choose 2PT or 3PT")}</p>
                        <p>Shot Types: {makeButton("Choose Shot Types")}</p>
                        <p>Shooting Teams: {makeButton("Choose Teams")}</p>
                        <p>Home Teams: {makeButton("Choose Home Teams")}</p>
                        <p>Away Teams: {makeButton("Choose Away Teams")}</p>
                        <p>Court Areas: {makeButton("Choose Court Areas")}</p>
                        <p>Sides of Court: {makeButton("Choose Sides of Court")}</p>
                    </div>
                    <button className="static-button">Run It</button>
                    <button className="static-button">View Selection</button>
                    <br></br>
                    <p>Current Selections: </p>
                    <SelectionViewer />
                </div>
            </div>
            <ShotPercentageView />
        </div>
    )
}

export default AdvancedSearchBox