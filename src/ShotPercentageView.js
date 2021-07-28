import './ShotPercentageView.css'
import { useState, useEffect } from "react";

const ShotPercentageView = (props) => {
    const [shotCalcs, setShotCalcs] = useState({ fgFrac: "--", fgPerc: "--", twoPFrac: "--", twoPPerc: "--", threePFrac: "--", threePPerc: "--" })

    useEffect(() => {
        console.log("useEffect for ShotPercentageView")
        if (props.isCurrentViewSimple && typeof (props.simpleShotData.simplesearch) !== 'undefined') {
            setShotCalcs(processShotData(props.simpleShotData.simplesearch))
        } else if (!props.isCurrentViewSimple && typeof (props.advancedShotData.advancedsearch) !== 'undefined' && props.advancedShotData) {
            setShotCalcs(processShotData(props.advancedShotData.advancedsearch))
        }
    }, [props.isCurrentViewSimple, props.simpleShotData, props.advancedShotData])

    function processShotData(inputShotData) {
        let twoPMakes = 0, twoPTotal = 0, threePMakes = 0, threePTotal = 0;
        let fgFrac = "--", fgPerc = "--", twoPFrac = "--", twoPPerc = "--", threePFrac = "--", threePPerc = "--"
        inputShotData.forEach(each => {
            if (each.make == 1 && each.shottype === "2PT Field Goal") {
                twoPMakes++
                twoPTotal++
            } else if (each.make == 0 && each.shottype === "2PT Field Goal") {
                twoPTotal++
            } else if (each.make == 1 && each.shottype === "3PT Field Goal") {
                threePMakes++
                threePTotal++
            } else {
                threePTotal++
            }
        })
        if (twoPTotal !== 0) {
            twoPFrac = twoPMakes + "/" + twoPTotal
            twoPPerc = Number(twoPMakes / twoPTotal * 100).toFixed(2) + "%"
        }
        if (threePTotal !== 0) {
            threePFrac = threePMakes + "/" + threePTotal
            threePPerc = Number(threePMakes / threePTotal * 100).toFixed(2) + "%"
        }
        if (twoPTotal + threePTotal !== 0) {
            fgFrac = (twoPMakes + threePMakes) + "/" + (twoPTotal + threePTotal)
            fgPerc = Number((twoPMakes + threePMakes) / (twoPTotal + threePTotal) * 100).toFixed(2) + "%"
        }
        return { fgFrac: fgFrac, fgPerc: fgPerc, twoPFrac: twoPFrac, twoPPerc: twoPPerc, threePFrac: threePFrac, threePPerc: threePPerc }
    }

    function generateShotPercentageView() {
        let fontSizeTitle = props.isCurrentViewSimple ? "50px" : "35px"
        let fontSizeSubtitle = props.isCurrentViewSimple ? "20px" : "20px"
        let elements = []
        for (let i = 0; i < 3; i++) {
            let eachElementArray
            switch (i) {
                case 0:
                    eachElementArray = ["FG", shotCalcs.fgFrac, shotCalcs.fgPerc]
                    break;
                case 1:
                    eachElementArray = ["2P", shotCalcs.twoPFrac, shotCalcs.twoPPerc]
                    break;
                case 2:
                    eachElementArray = ["3P", shotCalcs.threePFrac, shotCalcs.threePPerc]
                    break
            }
            elements.push(<div className="perc-div">
                <p className="percentage-title" style={{ fontSize: fontSizeTitle }}>{eachElementArray[0]}</p>
                <p className="percentage-content" style={{ fontSize: fontSizeSubtitle }}>{eachElementArray[1]}</p>
                <p className="percentage-content" style={{ fontSize: fontSizeSubtitle }}>{eachElementArray[2]}</p>
            </div>)
        }
        return (<div className="ShotPercentageView">{elements}</div>
        )
        /*
            return (
                <div className="ShotPercentageView">
                    <div className="perc-div">
                        <p className="percentage-grid-item-title">FG</p>
                        <p className="percentage-grid-item-content">{shotCalcs.fgFrac}</p>
                        <p className="percentage-grid-item-content">{shotCalcs.fgPerc}</p>
                    </div>
                    <div className="perc-div">
                        <p className="percentage-grid-item-title">2P</p>
                        <p className="percentage-grid-item-content">{shotCalcs.twoPFrac}</p>
                        <p className="percentage-grid-item-content">{shotCalcs.twoPPerc}</p>
                    </div>
                    <div className="perc-div">
                        <p className="percentage-grid-item-title">3P</p>
                        <p className="percentage-grid-item-content">{shotCalcs.threePFrac}</p>
                        <p className="percentage-grid-item-content">{shotCalcs.threePPerc}</p>
    
                    </div>
                </div>)
                */
    }

    return (
        generateShotPercentageView()
    )
}

export default ShotPercentageView