import './ShootingBezier.css'
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { useEffect, useState, useRef } from "react";


const ShootingBezier = (props) => {
    console.log("RERENDER ShootingBezier")
    const [shotTypeAnimated, setShotTypeAnimated] = useState({
        prevValues: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],],
        currentValues: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],],
        finalValues: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],],
        increment: 0,
        isDelayed: false
    })
    const shotTypeAnimatedRef = useRef({})
    shotTypeAnimatedRef.current = shotTypeAnimated

    useEffect(() => {
        // console.log("useEffect for shotTypeAnimated")
        if (shotTypeAnimatedRef.current.isDelayed) {
            let diff = 0.05
            setTimeout(() => {
                let temp = []
                for (let i = 0; i < 9; i++) {
                    temp[i] = [shotTypeAnimatedRef.current.prevValues[i][0] + (shotTypeAnimatedRef.current.finalValues[i][0] - shotTypeAnimatedRef.current.prevValues[i][0]) * shotTypeAnimatedRef.current.increment, shotTypeAnimatedRef.current.prevValues[i][1] + (shotTypeAnimatedRef.current.finalValues[i][1] - shotTypeAnimatedRef.current.prevValues[i][1]) * shotTypeAnimatedRef.current.increment]
                }
                if (shotTypeAnimatedRef.current.increment >= 1) {
                    setShotTypeAnimated({
                        ...shotTypeAnimatedRef.current, isDelayed: false, increment: 1
                    })
                } else {
                    setShotTypeAnimated({
                        ...shotTypeAnimatedRef.current, currentValues: temp, increment: shotTypeAnimatedRef.current.increment + diff
                    })
                }
            }, 30);

        }
    }, [shotTypeAnimated])

    useEffect(() => {
        //console.log("useEffect for props.allSearchData")
        setShotTypeAnimated({
            ...shotTypeAnimatedRef.current,
            prevValues: shotTypeAnimatedRef.current.currentValues,
            increment: 0,
            isDelayed: false
        })
    }, [props.allSearchData])

    useEffect(() => {
        //console.log(shotTypeAnimated)
    }, [shotTypeAnimated])

    function processShotData() {
        let shotKinds = { jump: 0, dunk: 0, layup: 0, floating: 0, hook: 0, fadeaway: 0, pullup: 0, stepback: 0, turnaround: 0 }
        let shotKindMap = { jump: "jump", dunk: "dunk", layup: "layup", floating: "floating", hook: "hook", fadeaway: "fadeaway", pullup: "pull", stepback: "step back", turnaround: "around" }
        let shots = null
        if (props.isCurrentViewSimple && props.allSearchData.shots) {
            shots = props.allSearchData.shots.simplesearch
        } else if (!props.isCurrentViewSimple && props.allSearchData.shots) {
            shots = props.allSearchData.shots.advancedsearch
        }
        let pointsOnly = "", angles = ""
        let angleDist = document.getElementById("dist-outer-circle") ? document.getElementById("dist-outer-circle").r.animVal.value : 180
        for (let i = 0; i < 9; i++) {
            let angleX = angleDist * Math.cos(((40 * i) - 90) * Math.PI / 180)
            let angleY = angleDist * Math.sin(((40 * i) - 90) * Math.PI / 180)
            angles = angles + ` l${angleX},${angleY} l${-angleX},${-angleY} `
        }
        if (shots && !shotTypeAnimatedRef.current.isDelayed && shotTypeAnimatedRef.current.increment < 1) {
            if (shots) {
                shots.forEach(eachShot => {
                    let isOnlyJump = null
                    Object.keys(shotKinds).forEach(eachKey => {
                        if (eachKey !== "jump" && eachShot.playtype.toLowerCase().includes(shotKindMap[eachKey])) {
                            shotKinds[eachKey] = shotKinds[eachKey] + 1
                            if (eachShot.playtype.toLowerCase().includes(shotKindMap.jump)) {
                                isOnlyJump = false
                            }
                        }
                    })
                    if (isOnlyJump === null && eachShot.playtype.toLowerCase().includes(shotKindMap.jump)) {
                        shotKinds.jump = shotKinds.jump + 1
                    }
                })
            }
            let max = 100
            Object.values(shotKinds).forEach((eachShot) => {
                if (eachShot > max) {
                    max = eachShot
                }
            })
            let relativeValues = {}
            let scaler = document.getElementById("dist-outer-circle") ? document.getElementById("dist-outer-circle").r.animVal.value * 0.7 : 85
            Object.keys(shotKinds).forEach(eachKey => {
                relativeValues[eachKey] = shotKinds[eachKey] / max * scaler
            })
            let startPoints = []
            for (let i = 0; i < Object.keys(relativeValues).length; i++) {
                let value = relativeValues[Object.keys(relativeValues)[i]] + 15
                let angleRadians = (-40 * i - 180) * Math.PI / 180
                startPoints[i] = [value * Math.sin(angleRadians), value * Math.cos(angleRadians)]
            }
            setShotTypeAnimated({
                ...shotTypeAnimatedRef.current,
                finalValues: startPoints,
                increment: 0,
                isDelayed: true
            })
        } else {
            for (let i = 0; i < shotTypeAnimatedRef.current.currentValues.length; i++) {
                let x2 = shotTypeAnimatedRef.current.currentValues[0][0]
                let x1 = shotTypeAnimatedRef.current.currentValues[i][0]
                let y2 = shotTypeAnimatedRef.current.currentValues[0][1]
                let y1 = shotTypeAnimatedRef.current.currentValues[i][1]
                if (i !== shotTypeAnimatedRef.current.currentValues.length - 1) {
                    x2 = shotTypeAnimatedRef.current.currentValues[i + 1][0]
                    y2 = shotTypeAnimatedRef.current.currentValues[i + 1][1]
                }
                pointsOnly = pointsOnly + `l${x2 - x1},${y2 - y1} `
            }
        }
        let height = document.getElementById("shot-bezier-inner-div") ? document.getElementById("shot-bezier-inner-div").clientHeight : 300
        let width = document.getElementById("shot-bezier-inner-div") ? document.getElementById("shot-bezier-inner-div").clientWidth : 500
        if (height > 300) height = 300
        if (width > 500) width = 500
        let smallerDim = width > height ? height * 0.9 : width * 0.9
        return <Svg style={{ maxHeight: { smallerDim }, maxWidth: { width }, height: height, width: width }} >
            <Defs>
                <RadialGradient
                    id="grad"
                    cx="50%"
                    cy="50%"
                    rx={smallerDim / 3}
                    ry={smallerDim / 3}
                    fx="50%"
                    fy="50%"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop offset="0" stopColor="#014a48" stopOpacity="0.85" />
                    <Stop offset="0.3" stopColor="#0de563" stopOpacity="0.9 " />
                </RadialGradient>
            </Defs>
            <Circle cx={width / 2} cy={height / 2} r={smallerDim / 10} stroke="gray" fill="transparent" strokeDasharray="8, 2" />
            <Circle cx={width / 2} cy={height / 2} r={2 * smallerDim / 10} stroke="gray" fill="transparent" strokeDasharray="8, 4" />
            <Circle id="dist-outer-circle" cx={width / 2} cy={height / 2} r={3 * smallerDim / 10} stroke="gray" fill="transparent" strokeDasharray="8, 6" />
            <Path d={`m${width / 2},${height / 2} ${angles}`} fill="none" strokeWidth="1px" stroke="gray" />
            <Path d={`m${width / 2},${height / 2 + shotTypeAnimatedRef.current.currentValues[0][1]} ${pointsOnly}`} fill="url(#grad)" strokeWidth="1px" stroke="white" />
        </Svg>
    }

    function createLabels() {
        let shotKindMap = ["Jump Shot", "Dunk", "Layup", "Floater", "Hook Shot", "Fade", "Pull-Up", "Turn-Around", "Step-Back"]
        let labels = []
        for (let index = 0; index < shotKindMap.length; index++) {
            let style = { position: "absolute", minWidth: "50px", maxWidth: "50px", textAlign: "center", margin: "0px" }
            let pWidth = 50
            let pHeight = 44
            let x, y
            if (document.getElementById("dist-outer-circle")) {
                let rad = document.getElementById("dist-outer-circle").r.animVal.value
                let height = document.getElementById("shot-bezier-inner-div") ? document.getElementById("shot-bezier-inner-div").clientHeight : 500
                let width = document.getElementById("shot-bezier-inner-div") ? document.getElementById("shot-bezier-inner-div").clientWidth : 500
                x = (rad * 1.4 * Math.cos(((40 * index) - 90) * Math.PI / 180) + width / 2 - pWidth / 2)
                y = rad * 1.4 * Math.sin(((40 * index) - 90) * Math.PI / 180) + height / 2 - pHeight / 2
                style.transform = `translate(${x}px,${y}px)`
                if (rad !== 0) {
                    labels.push(<p style={style} className="shot-kind-dist-label">{shotKindMap[index]}</p>)
                }
            }
        }
        return labels
    }

    return <div className="ShotBezier">
        <div id="shot-bezier-wrapper">
            <h6 id="by-type-title">Shot Distribution By Type</h6>
            <div id="shot-bezier-inner-div">
                {createLabels()}
                {processShotData()}
            </div>
        </div>

    </div>
}

export default ShootingBezier