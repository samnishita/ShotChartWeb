import './ShotPercentageView.css'

const ShotPercentageView = (props) => {
    console.log("updating shots")
    console.log(props.simpleShotData.simplesearch)
    let twoPMakes = 0;
    let twoPTotal = 0;
    let threePMakes = 0;
    let threePTotal = 0;
    let fgFrac = "--", fgPerc = "--", twoPFrac = "--", twoPPerc = "--", threePFrac = "--", threePPerc = "--"
    if (props.simpleShotData.simplesearch) {

        props.simpleShotData.simplesearch.forEach(each => {
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
    }
    return (
        <div className="ShotPercentageView">
            <p className="percentage-grid-item-title">FG</p>
            <p className="percentage-grid-item-title">2P</p>
            <p className="percentage-grid-item-title">3P</p>
            <p className="percentage-grid-item-content">{fgFrac}</p>
            <p className="percentage-grid-item-content">{twoPFrac}</p>
            <p className="percentage-grid-item-content">{threePFrac}</p>
            <p className="percentage-grid-item-content">{fgPerc}</p>
            <p className="percentage-grid-item-content">{twoPPerc}</p>
            <p className="percentage-grid-item-content">{threePPerc}</p>
        </div>
    )
}

export default ShotPercentageView