import './ShotPercentageView.css'
import { useState, useEffect } from "react";

const ShotPercentageView = (props) => {
    //console.log(props.simpleShotData.simplesearch)
    const [shotCalcs, setShotCalcs] = useState({ fgFrac: "--", fgPerc: "--", twoPFrac: "--", twoPPerc: "--", threePFrac: "--", threePPerc: "--" })
    //let fgFrac = "--", fgPerc = "--", twoPFrac = "--", twoPPerc = "--", threePFrac = "--", threePPerc = "--"
    /*
      if (props.isCurrentViewSimple && props.simpleShotData.simplesearch) {
          setShotCalcs(processShotData(props.simpleShotData.simplesearch))
      } else if (!props.isCurrentViewSimple) {
  
      }
      */
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

    return (
        <div className="ShotPercentageView">
            <p className="percentage-grid-item-title">FG</p>
            <p className="percentage-grid-item-title">2P</p>
            <p className="percentage-grid-item-title">3P</p>
            <p className="percentage-grid-item-content">{shotCalcs.fgFrac}</p>
            <p className="percentage-grid-item-content">{shotCalcs.twoPFrac}</p>
            <p className="percentage-grid-item-content">{shotCalcs.threePFrac}</p>
            <p className="percentage-grid-item-content">{shotCalcs.fgPerc}</p>
            <p className="percentage-grid-item-content">{shotCalcs.twoPPerc}</p>
            <p className="percentage-grid-item-content">{shotCalcs.threePPerc}</p>
        </div>
    )
}

export default ShotPercentageView