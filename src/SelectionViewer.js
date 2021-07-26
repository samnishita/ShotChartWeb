import './SelectionViewer.css'
import { useEffect, useState, useRef } from "react";
import Svg, { Line } from 'react-native-svg';

function SelectionViewer(props) {
    console.log("RERENDER SelectionViewer")
    const allSearchParametersRef = useRef({});
    allSearchParametersRef.current = props.allSearchParameters;
    const mapIdToDisplayName = {
        "year-advanced-dd-begin": "Seasons after and including: ",
        "year-advanced-dd-end": "Seasons before and including: ",
        "player-advanced-dd": "Player: ",
        "season-advanced-dd": "Season Type: ",
        "distance-begin": "Minimum Distance: ",
        "distance-end": "Maxinymum Distance: ",
        "success": "Shot Success: ",
        "shot-value": "Shot Value: ",
        "shot-types": "Shot Type: ",
        "shooting-teams": "Team: ",
        "home-teams": "Home Team: ",
        "away-teams": "Away Team: ",
        "court-areas": "Court Area: ",
        "court-sides": "Court Side: "
    }
    function generateSelections() {
        let displayParams = []
        if (allSearchParametersRef.current) {
            Object.keys(allSearchParametersRef.current).forEach(eachParam => {
                if (Array.isArray(allSearchParametersRef.current[eachParam])) {
                    allSearchParametersRef.current[eachParam].forEach(eachSelection => {
                        if (eachSelection !== "") {
                            displayParams.push(<div className="selection-div">
                                {makeDeleteButton(eachParam, eachSelection)}<span className={`selection-span ${eachParam}-selection-view`}>{mapIdToDisplayName[eachParam]}{eachSelection}</span>
                            </div>)
                        }
                    })
                } else if (allSearchParametersRef.current[eachParam] !== "") {
                    displayParams.push(<div className="selection-div">
                        {makeDeleteButton(eachParam, allSearchParametersRef.current[eachParam])}<span className={`selection-span ${eachParam}-selection-view`}>{mapIdToDisplayName[eachParam]}{allSearchParametersRef.current[eachParam]}</span></div>)
                }
            })
        }
        return displayParams.length === 0 ? "No Filters Selected" : displayParams
    }

    function makeDeleteButton(param, value) {
        let height = document.getElementById("current-selections") ? document.getElementById("current-selections").clientHeight : 19
        let center = height / 2, lineLength = height / 5
        return (
            <Svg className="delete-button" height={height} width={height} onClick={(event => handleDeleteButtonClick(param, value))}>
                <Line className="delete-button" x1={center + lineLength} y1={center + lineLength} x2={center - lineLength} y2={center - lineLength} stroke="white" strokeWidth="2" />
                <Line className="delete-button" x1={center + lineLength} y1={center - lineLength} x2={center - lineLength} y2={center + lineLength} stroke="white" strokeWidth="2" />
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