import './ShotPercentageView.css'
import { useState, useEffect } from "react";
import { Switch } from 'antd';
import { Progress } from 'antd';

const ShotPercentageView = (props) => {
    console.log("RERENDER ShotPercentageView")
    const [shotCalcs, setShotCalcs] = useState({ fgs: { frac: "--", perc: "--", efg: "--", pps: "--", }, twos: { frac: "--", perc: "--", efg: "--", pps: "--", }, threes: { frac: "--", perc: "--", efg: "--", pps: "--", } })
    const [isLoadDelay, setIsLoadDelay] = useState({ isDelayed: true, offset: 0.0 })

    useEffect(() => {
        console.log("useEffect for ShotPercentageView")
        console.log(shotCalcs)
        if (props.isCurrentViewSimple && props.simpleShotData && typeof (props.simpleShotData.simplesearch) !== 'undefined') {
            console.log(props.simpleShotData)
            setShotCalcs(processShotData(props.simpleShotData.simplesearch))
        } else if (!props.isCurrentViewSimple && props.advancedShotData && typeof (props.advancedShotData.advancedsearch) !== 'undefined') {
            setShotCalcs(processShotData(props.advancedShotData.advancedsearch))
        } else {
            setShotCalcs({ fgs: { frac: "--", perc: "--", efg: "--", pps: "--", }, twos: { frac: "--", perc: "--", efg: "--", pps: "--", }, threes: { frac: "--", perc: "--", efg: "--", pps: "--", } })
        }
        setIsLoadDelay({ isDelayed: true, offset: 0.0 })
    }, [props.isCurrentViewSimple, props.simpleShotData, props.advancedShotData])

    function processShotData(inputShotData) {
        let twoPMakes = 0, twoPTotal = 0, threePMakes = 0, threePTotal = 0;
        let twos = { frac: "--", perc: "--", efg: "--", pps: "--", }
        let threes = { frac: "--", perc: "--", efg: "--", pps: "--", }
        let fgs = { frac: "--", perc: "--", efg: "--", pps: "--", }
        inputShotData.forEach(each => {
            if (each.shottype === "2PT Field Goal") {
                twoPTotal++
                if (each.make == 1) {
                    twoPMakes++
                }
            } else if (each.shottype === "3PT Field Goal") {
                threePTotal++
                if (each.make == 1 && each.shottype === "3PT Field Goal") {
                    threePMakes++
                }
            }
        })
        if (twoPTotal !== 0) {
            twos = calculateShotParams(twoPMakes, 0, twoPTotal)
        }
        if (threePTotal !== 0) {
            threes = calculateShotParams(0, threePMakes, threePTotal)
        }
        if (twoPTotal + threePTotal !== 0) {
            fgs = calculateShotParams(twoPMakes, threePMakes, twoPTotal + threePTotal)
        }
        return { twos: twos, threes: threes, fgs: fgs }
    }

    function calculateShotParams(twoPMakes, threePMakes, total) {
        return {
            frac: (twoPMakes + threePMakes) + "/" + total,
            perc: Number((twoPMakes + threePMakes) / total * 100).toFixed(2),
            efg: Number((twoPMakes + 1.5 * threePMakes) / total * 100).toFixed(2) + "%",
            pps: Number((2 * twoPMakes + 3 * threePMakes) / total).toFixed(2)
        }
    }

    function generateShotPercentageView() {
        let fontSizeTitle = props.isCurrentViewSimple ? 30 : 35
        let fontSizeSubtitle = props.isCurrentViewSimple ? "15px" : "15px"
        let elements = []
        let titles = ["FG", "2P", "3P"]
        let keys = ["fgs", "twos", "threes"]
        for (let i = 0; i < 3; i++) {
            let percentDisplay
            if (isLoadDelay.isDelayed && shotCalcs[keys[i]].frac === "--") {
                percentDisplay = 0
            } else if (!isLoadDelay.isDelayed && shotCalcs[keys[i]].frac !== "--") {
                percentDisplay = Number(shotCalcs[keys[i]].perc * isLoadDelay.offset).toFixed(2)
            }
            elements.push(<div className="perc-div">
                <p className="percentage-title" style={{ fontSize: fontSizeTitle + "px" }}>{titles[i]}</p>
                <Progress className="dashboard-shot"
                    type="dashboard"
                    strokeColor={{
                        '0%': 'rgb(138, 7, 200)',
                        '100%': 'rgb(246, 134, 7)',
                    }}
                    percent={percentDisplay}
                    format={percent => `${percent}%`}
                    trailColor="#3d3e3e"
                    gapDegree="0"
                    width={fontSizeTitle * 2.5}
                />
                <p className="percentage-content" style={{ fontSize: fontSizeSubtitle }}>{shotCalcs[keys[i]].frac}</p>
                <p className="percentage-content" style={{ fontSize: fontSizeSubtitle }}>{"eFG: " + shotCalcs[keys[i]].efg}</p>
                <p className="percentage-content" style={{ fontSize: fontSizeSubtitle }}>{"PPS: " + shotCalcs[keys[i]].pps}</p>
            </div>)
        }
        if (isLoadDelay.isDelayed && shotCalcs.fgs.frac !== "--") {
            setTimeout(() => {
                setIsLoadDelay({ isDelayed: false, offset: 0.0 })
            }, 300);
        }
        if (!isLoadDelay.isDelayed && isLoadDelay.offset < 1.0) {
            setTimeout(() => {
                setIsLoadDelay({ isDelayed: false, offset: isLoadDelay.offset + 0.05 })
            }, 20);
        }
        return elements
    }
    return (
        <div className="ShotPercentageView">
            <h6>Shot Breakdown</h6>
            {generateShotPercentageView()}
        </div>
    )
}

export default ShotPercentageView