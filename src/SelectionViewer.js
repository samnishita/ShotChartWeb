import './SelectionViewer.css'
import { useEffect, useState, useRef } from "react";
import Svg, { Line } from 'react-native-svg';

function SelectionViewer(props) {
    console.log("RERENDER SelectionViewer")
    const allSearchParametersRef = useRef({});
    allSearchParametersRef.current = props.allSearchParameters;
    const mapIdToDisplayName = {
        "year-advanced-dd-begin": "Seasons >= ",
        "year-advanced-dd-end": "Seasons <= ",
        "player-advanced-dd": "Player: ",
        "season-advanced-dd": "Season Type: ",
        "distance-dd-begin": "Distance >= ",
        "distance-dd-end": "Distance <= ",
        "success-dd": "Shot Success: ",
        "shot-value-dd": "Shot Value: ",
        "shot-types-dd": "Shot Type: ",
        "shooting-teams-dd": "Team: ",
        "home-teams-dd": "Home Team: ",
        "away-teams-dd": "Away Team: ",
        "court-areas-dd": "Court Area: ",
        "court-sides-dd": "Court Side: "
    }
    function generateSelections() {
        let displayParams = []
        if (allSearchParametersRef.current) {
            Object.keys(allSearchParametersRef.current).forEach(eachParam => {
                if (Array.isArray(allSearchParametersRef.current[eachParam])) {
                    allSearchParametersRef.current[eachParam].forEach(eachSelection => {
                        if (eachSelection !== "") {
                            displayParams.push(<div className="selection-div">
                                {makeDeleteButton(eachParam, eachSelection)}
                                <p className={`selection-span ${eachParam}-selection-view`}>{mapIdToDisplayName[eachParam]}{eachSelection}</p>
                            </div>)
                        }
                    })
                } else if (allSearchParametersRef.current[eachParam] !== "") {
                    displayParams.push(<div className="selection-div" >
                        {makeDeleteButton(eachParam, allSearchParametersRef.current[eachParam])}
                        <p className={`selection-span ${eachParam}-selection-view`}>{mapIdToDisplayName[eachParam]}{allSearchParametersRef.current[eachParam]}</p></div>)
                }
            })
        }
        return displayParams.length === 0 ? <p className="selection-placeholder">No Filters Selected</p> : displayParams
    }

    function makeDeleteButton(param, value) {
        let height = document.getElementById("current-selections") ? document.getElementById("current-selections").clientHeight : 25
        let center = height * 0.9 / 2, lineLength = height / 5
        return (
            <Svg className="delete-button" height={height * 0.9} width={height * 0.9} onClick={(event => handleDeleteButtonClick(param, value))}        >
                <Line style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} className="delete-button" x1={center + lineLength} y1={center + lineLength} x2={center - lineLength} y2={center - lineLength} stroke="white" strokeWidth="2" />
                <Line style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} className="delete-button" x1={center + lineLength} y1={center - lineLength} x2={center - lineLength} y2={center + lineLength} stroke="white" strokeWidth="2" />
            </Svg>)
    }

    function handleDeleteButtonClick(param, value) {
        let stateCopy = { ...allSearchParametersRef.current };
        console.log(stateCopy)
        if (Array.isArray(stateCopy[param])) {
            let paramArray = stateCopy[param]
            console.log(paramArray)
            let index = paramArray.indexOf(value)
            if (index !== -1) {
                paramArray.splice(index, 1);
            }
        } else {
            stateCopy[param] = ""
        }
        props.setAllSearchParameters(stateCopy)
    }

    useEffect(() => {
        console.log(allSearchParametersRef.current)
    }, [allSearchParametersRef.current])

    return (
        <div className="SelectionViewer scrollable" id="selections">
            {generateSelections()}
        </div>
    )
}

export default SelectionViewer