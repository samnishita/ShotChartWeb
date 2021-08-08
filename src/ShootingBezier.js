import './ShootingBezier.css'
import Svg, { Circle, Path, Line, Rect, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { useEffect, useState, useRef } from "react";


const ShootingBezier = (props) => {
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
            let diff = 0.1
            setTimeout(() => {
                let temp = []
                for (let i = 0; i < 9; i++) {
                    temp[i] = [shotTypeAnimatedRef.current.prevValues[i][0] + (shotTypeAnimatedRef.current.finalValues[i][0] - shotTypeAnimatedRef.current.prevValues[i][0]) * shotTypeAnimatedRef.current.increment, shotTypeAnimatedRef.current.prevValues[i][1] + (shotTypeAnimatedRef.current.finalValues[i][1] - shotTypeAnimatedRef.current.prevValues[i][1]) * shotTypeAnimatedRef.current.increment]
                }
                setShotTypeAnimated({
                    ...shotTypeAnimatedRef.current, currentValues: temp, increment: shotTypeAnimatedRef.current.increment + diff
                })
            }, 50);
            if (shotTypeAnimatedRef.current.increment >= 1) {
                setShotTypeAnimated({
                    ...shotTypeAnimatedRef.current, isDelayed: false, increment: 1
                })
            }
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
        let shotKinds = { dunk: 0, layup: 0, floating: 0, jump: 0, hook: 0, fadeaway: 0, pullup: 0, stepback: 0, turnaround: 0 }
        let shotKindMap = { dunk: "dunk", layup: "layup", floating: "floating", jump: "jump", hook: "hook", fadeaway: "fadeaway", pullup: "pull", stepback: "step back", turnaround: "around" }
        let shots = null
        if (props.isCurrentViewSimple && props.allSearchData.shots) {
            shots = props.allSearchData.shots.simplesearch
        } else if (!props.isCurrentViewSimple && props.allSearchData.shots) {
            shots = props.allSearchData.shots.advancedsearch
        }
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
        //let controlPoints = []

        for (let i = 0; i < Object.keys(relativeValues).length; i++) {
            let value = relativeValues[Object.keys(relativeValues)[i]] + 15
            let angleRadians = (-40 * i - 180) * Math.PI / 180
            startPoints[i] = [value * Math.sin(angleRadians), value * Math.cos(angleRadians)]
        }
        if (shots && !shotTypeAnimatedRef.current.isDelayed && shotTypeAnimatedRef.current.increment < 1) {
            setShotTypeAnimated({
                ...shotTypeAnimatedRef.current,
                finalValues: startPoints,
                increment: 0,
                isDelayed: true
            })
        }

        let midpoints = []
        let paths = "", pointsOnly = "", csOnly = ""
        let angles = ""

        let angleDist = document.getElementById("dist-outer-circle") ? document.getElementById("dist-outer-circle").r.animVal.value : 180
        for (let i = 0; i < 9; i++) {
            let angleX = angleDist * Math.cos(((40 * i) - 90) * Math.PI / 180)
            let angleY = angleDist * Math.sin(((40 * i) - 90) * Math.PI / 180)
            angles = angles + ` l${angleX},${angleY} l${-angleX},${-angleY} `
        }
        if (shots) {
            for (let i = 0; i < startPoints.length; i++) {
                /*
                let x2 = startPoints[0][0]
                let x1 = startPoints[i][0]
                let y2 = startPoints[0][1]
                let y1 = startPoints[i][1]
                if (i !== startPoints.length - 1) {
                    x2 = startPoints[i + 1][0]
                    y2 = startPoints[i + 1][1]
                }
                */
                let x2 = shotTypeAnimatedRef.current.currentValues[0][0]
                let x1 = shotTypeAnimatedRef.current.currentValues[i][0]
                let y2 = shotTypeAnimatedRef.current.currentValues[0][1]
                let y1 = shotTypeAnimatedRef.current.currentValues[i][1]
                if (i !== startPoints.length - 1) {
                    x2 = shotTypeAnimatedRef.current.currentValues[i + 1][0]
                    y2 = shotTypeAnimatedRef.current.currentValues[i + 1][1]
                }
                //let distance = getDistance(x1, y1, x2, y2)
                /*
                let c1x = 0, c1y = 0, c2x = 0, c2y = 0
                let slope = (y2 - y1) / (x2 - x1)
                let controlSlope = -1 * slope
                let cDistance = distance / 5
                console.log(distance)
                console.log(slope)
                c1y = Math.sqrt(Math.pow(cDistance, 2) * Math.pow(controlSlope, 2) / Math.pow(1 + controlSlope, 2)) + y1
                c1x = c1y / controlSlope
                console.log(`c ${c1x},${c1y}`)
    
                //paths = paths + `c ${c1x},${c1y} -20,20 ${x2 - x1},${y2 - y1} `
                //paths = paths + `c 0,0 0,0 ${x2 - x1},${y2 - y1} `
                let cOffsetX = 20, cOffsetY = 20
                if (y2 < y1 && x2 < x1) {
                    cOffsetX = -cDistance
                } else if (x2 > x1 && y2 > y1) {
    
                }
                paths = paths + `c ${cOffsetX},${cOffsetY} ${(x2 - x1) - cOffsetX},${(y2 - y1) - cOffsetY} ${x2 - x1},${y2 - y1} `
                pointsOnly = pointsOnly + `l${x2 - x1},${(y2 - y1)} `
                csOnly = csOnly + `l${cOffsetX},${cOffsetY} l${(x2 - x1) - cOffsetX},${(y2 - y1) - cOffsetY}`
            
                
    
                let x1a = (x2 - x1) / 2
                let y1a = (y2 - y1) / 2
                let dist = getDistance(0, 0, x2 - x1, y2 - y1)
                let r = dist/3
                paths = paths + `q${dist * Math.cos((40 * i +20)* Math.PI / 180)},${dist * Math.cos((40 * i +20) * Math.PI / 180)} ${x2 - x1},${y2 - y1}`
            */
                //pointsOnly = pointsOnly + `l${(x2 - x1) / 3},${(y2 - y1) / 3}  l200,200 l-200,-200l${(x2 - x1) / 3},${(y2 - y1) / 3}  l200,200 l-200,-200 l${(x2 - x1) / 3},${(y2 - y1) / 3} `
                pointsOnly = pointsOnly + `l${x2 - x1},${y2 - y1} `
                /*
                midpoints.push([(x2 - x1) / 3, (y2 - y1) / 3])
                midpoints.push([2 * (x2 - x1) / 3, 2 * (y2 - y1) / 3])
                midpoints.push([x2 - x1, y2 - y1])*/
            }

        }//console.log(midpoints)

        /*
        let index = 0
let curvedPaths = ""
                let angles = ""
let controlPoints = ""
        let angleDist = 200

        for (let i = 0; i < 18; i++) {
            let angleX = angleDist * Math.cos(((20 * i) - 90) * Math.PI / 180)
            let angleY = angleDist * Math.sin(((20 * i) - 90) * Math.PI / 180)
            angles = angles + ` l${angleX},${angleY} l${-angleX},${-angleY} `
        }
        
        let currentPoint = [150 - (startPoints[0][0] - startPoints[8][0]) / 3, 150 + startPoints[0][1] - (startPoints[0][1] - startPoints[8][1]) / 3]
        let distance0 = getDistance(0, 0, startPoints[0][0], startPoints[0][1])
        let cpDistance0 = distance0 * 0.2
        let cx0 = cpDistance0 * Math.cos((0 - 90) * Math.PI / 180) + (startPoints[0][0] - startPoints[8][0]) / 3
        let cy0 = cpDistance0 * Math.sin((0 - 90) * Math.PI / 180)
        paths = paths + `q ${cx0},${cy0}  ${(startPoints[0][0] - startPoints[8][0]) / 3 + (startPoints[1][0] - startPoints[0][0]) / 3},${(startPoints[0][1] - startPoints[8][1]) / 3 + (startPoints[1][1] - startPoints[0][1]) / 3} `
        controlPoints = controlPoints + `l ${cx0},${cy0} l${-cx0},${-cy0} l${(startPoints[0][0] - startPoints[8][0]) / 3 + (startPoints[1][0] - startPoints[0][0]) / 3},${(startPoints[0][1] - startPoints[8][1]) / 3 + (startPoints[1][1] - startPoints[0][1]) / 3}`
        currentPoint[0] = currentPoint[0] + (startPoints[0][0] - startPoints[8][0]) / 3 + (startPoints[1][0] - startPoints[0][0]) / 3
        currentPoint[1] = currentPoint[1] + (startPoints[0][1] - startPoints[8][1]) / 3 + (startPoints[1][1] - startPoints[0][1]) / 3

        let cx0int1 = (startPoints[1][0] - startPoints[0][0]) / 3 / 4
        let cy0int1 = -(startPoints[1][1] - startPoints[0][1]) / 3 / 4
        paths = paths + `q ${cx0int1},${cy0int1}  ${(startPoints[1][0] - startPoints[0][0]) / 3},${(startPoints[1][1] - startPoints[0][1]) / 3} `
        controlPoints = controlPoints + ` l${(startPoints[1][0] - startPoints[0][0]) / 3},${(startPoints[1][1] - startPoints[0][1]) / 3} `
        currentPoint[0] = currentPoint[0] + (startPoints[1][0] - startPoints[0][0]) / 3
        currentPoint[1] = currentPoint[1] + (startPoints[1][1] - startPoints[0][1]) / 3

        let distance1 = getDistance(0, 0, startPoints[1][0], startPoints[1][1])
        let cpDistance1 = distance1 * 0.2
        let cx1 = cpDistance1 * Math.cos((40 - 90) * Math.PI / 180) + (startPoints[1][0] - startPoints[0][0]) / 3
        let cy1 = cpDistance1 * Math.sin((40 - 90) * Math.PI / 180)
        paths = paths + `q ${cx1},${cy1}  ${(startPoints[1][0] - startPoints[0][0]) / 3 + (startPoints[2][0] - startPoints[1][0]) / 3},${(startPoints[1][1] - startPoints[0][1]) / 3 + (startPoints[2][1] - startPoints[1][1]) / 3} `
        controlPoints = controlPoints + `l ${cx1},${cy1} l${-cx1},${-cy1} l${(startPoints[1][0] - startPoints[0][0]) / 3 + (startPoints[2][0] - startPoints[1][0]) / 3},${(startPoints[1][1] - startPoints[0][1]) / 3 + (startPoints[2][1] - startPoints[1][1]) / 3}`

        let cx1int2 = (startPoints[2][0] - startPoints[1][0]) / 3 / 4
        let cy1int2 = -(startPoints[2][1] - startPoints[1][1]) / 3 / 4
        paths = paths + `q ${cx1int2},${cy1int2}  ${(startPoints[2][0] - startPoints[1][0]) / 3},${(startPoints[2][1] - startPoints[1][1]) / 3} `
        controlPoints = controlPoints + ` l${(startPoints[1][0] - startPoints[0][0]) / 3},${(startPoints[1][1] - startPoints[0][1]) / 3} `
        currentPoint[0] = currentPoint[0] + (startPoints[1][0] - startPoints[0][0]) / 3
        currentPoint[1] = currentPoint[1] + (startPoints[1][1] - startPoints[0][1]) / 3
*/
        /*
                let dist0 = getDistance(0, 0, startPoints[0][0], startPoints[0][1])
                let dist1 = getDistance(0, 0, startPoints[1][0], startPoints[1][1])
                let distDiff10 = (dist1 + dist0) / 3
                let x0 = startPoints[0][0]
                let y0 = startPoints[0][1]
                let x1 = dist1 * Math.cos((40 - 90) * Math.PI / 180)
                let y1 = dist1 * Math.sin((40 - 90) * Math.PI / 180)
                let x0to1 = distDiff10 * Math.cos((20 - 90) * Math.PI / 180)
                let y0to1 = distDiff10 * Math.sin((20 - 90) * Math.PI / 180)
                let x0to1c = dist0 * Math.cos((10 - 90) * Math.PI / 180) - x0
                let y0to1c = dist0 * Math.sin((10 - 90) * Math.PI / 180) - y0
                paths = paths + makeNormalPath(x0, y0, x0to1, y0to1)
                controlPoints = controlPoints + makeControlPath(x0, y0, x0to1, y0to1, x0to1c, -y0to1c, -x0to1c, -y0to1c)
                curvedPaths = curvedPaths + makeCurvedPath(x0, y0, x0to1, y0to1, x0to1c, -y0to1c, x0to1c, y0to1c)
                let x1c = dist1 * Math.cos((30 - 90) * Math.PI / 180) - x1
                let y1c = dist1 * Math.sin((30 - 90) * Math.PI / 180) - y1
                paths = paths + makeNormalPath(x0to1, y0to1, x1, y1)
                controlPoints = controlPoints + makeControlPath(x0to1, y0to1, x1, y1, x0to1c, -y0to1c, x1c, y1c)
                curvedPaths = curvedPaths + makeCurvedPath(x0to1, y0to1, x1, y1, x0to1c, -y0to1c, -x1c, -y1c)
                let dist2 = getDistance(0, 0, startPoints[2][0], startPoints[2][1])
                let distDiff21 = (dist2 + dist1) / 4
                let x2 = dist2 * Math.cos((80 - 90) * Math.PI / 180)
                let y2 = dist2 * Math.sin((80 - 90) * Math.PI / 180)
                let x1to2 = distDiff21 * Math.cos((60 - 90) * Math.PI / 180)
                let y1to2 = distDiff21 * Math.sin((60 - 90) * Math.PI / 180)
                let x1to2c = dist1 * Math.cos((50 - 90) * Math.PI / 180) - x1
                let y1to2c = dist1 * Math.sin((50 - 90) * Math.PI / 180) - y1
                paths = paths + makeNormalPath(x1, y1, x1to2, y1to2)
                controlPoints = controlPoints + makeControlPath(x1, y1, x1to2, y1to2, -x1c, -y1c, -x1to2c, -y1to2c)
                curvedPaths = curvedPaths + makeCurvedPath(x1, y1, x1to2, y1to2, -x1c, -y1c, x1to2c, y1to2c)
                let x2c = dist2 * Math.cos((70 - 90) * Math.PI / 180) - x2
                let y2c = dist2 * Math.sin((70 - 90) * Math.PI / 180) - y2
                paths = paths + makeNormalPath(x1to2, y1to2, x2, y2)
                controlPoints = controlPoints + makeControlPath(x1to2, y1to2, x2, y2, x1to2c, y1to2c, x2c, y2c)
                curvedPaths = curvedPaths + makeCurvedPath(x1to2, y1to2, x2, y2, x1to2c, y1to2c, -x2c, -y2c)
                //<Path d={`m150,${150 + startPoints[0][1]} ${paths}`} fill="blue" strokeWidth="3px" stroke="white" />
        
        let prevX, prevY

        for (let k = 0; k < 6; k++) {
            let dist0 = getDistance(0, 0, startPoints[k][0], startPoints[k][1])
            let dist1 = k === 8 ? getDistance(0, 0, startPoints[0][0], startPoints[0][1]) : getDistance(0, 0, startPoints[k + 1][0], startPoints[k + 1][1])
            let distDiff21 = (dist1 + dist0) / 3
            let x0 = startPoints[k][0]
            let y0 = startPoints[k][1]
            let x0to1 = distDiff21 * Math.cos((20 + 40 * k - 90) * Math.PI / 180)
            let y0to1 = distDiff21 * Math.sin((20 + 40 * k - 90) * Math.PI / 180)
            let x0to1c = prevX ? prevX : dist0 * Math.cos((10 + 40 * k - 90) * Math.PI / 180) - x0
            let y0to1c = prevY ? prevY : dist0 * Math.sin((10 + 40 * k - 90) * Math.PI / 180) - y0
            paths = paths + `l${x0to1 - x0},${y0to1 - y0}`
            controlPoints = controlPoints + `l${x0to1c},${-y0to1c} l${-x0to1c},${y0to1c} l${x0to1 - x0},${y0to1 - y0} l${-x0to1c},${-y0to1c} l${x0to1c},${y0to1c}`
            curvedPaths = curvedPaths + `c ${x0to1c},${-y0to1c} ${x0to1 - x0 - x0to1c},${y0to1 - y0 - y0to1c} ${x0to1 - x0},${y0to1 - y0}`
            let x1 = dist1 * Math.cos((40 * (k + 1) - 90) * Math.PI / 180)
            let y1 = dist1 * Math.sin((40 * (k + 1) - 90) * Math.PI / 180)
            let x1c = dist1 * Math.cos((30 + 40 * k - 90) * Math.PI / 180) - x1
            let y1c = dist1 * Math.sin((30 + 40 * k - 90) * Math.PI / 180) - y1
            paths = paths + `l${x1 - x0to1},${y1 - y0to1}`
            controlPoints = controlPoints + `l${x0to1c},${-y0to1c} l${-x0to1c},${y0to1c} l${x1 - x0to1},${y1 - y0to1} l${x1c},${y1c} l${-x1c},${-y1c}`
            curvedPaths = curvedPaths + `c ${x0to1c},${-y0to1c} ${x1 - x0to1 + x1c},${y1 - y0to1 + y1c} ${x1 - x0to1},${y1 - y0to1}`
            prevX = -x1c
            prevY = y1c
        }
        /* }
         
             <Path d={`m150,${150 + startPoints[0][1]} ${pointsOnly}`} fill="blue" strokeWidth="1px" stroke="white" />
                 <Path d={`m150,${150 + startPoints[0][1]} ${paths}`} fill="none" strokeWidth="3px" stroke="orange" />
                 <Path d={`m150,${150 + startPoints[0][1]} ${curvedPaths}`} fill="none" strokeWidth="2px" stroke="limegreen" />
                 <Path d={`m150,${150 + startPoints[0][1]} ${controlPoints}`} fill="none" strokeWidth="1px" stroke="purple" />
                 <Path d={`m150,150 ${angles}`} fill="none" strokeWidth="1px" stroke="yellow" />
             
              <Circle cx={`${150 - (startPoints[0][0] - startPoints[8][0]) / 3}`} cy={`${150 + startPoints[0][1] - (startPoints[0][1] - startPoints[8][1]) / 3}`} r="5" stroke="gray" fill="transparent" strokeDasharray="8, 8" />
         <Path d={`m${150 - (startPoints[0][0] - startPoints[8][0]) / 3},${150 + startPoints[0][1] - (startPoints[0][1] - startPoints[8][1]) / 3} ${paths}`} fill="none" strokeWidth="3px" stroke="orange" />
            */
        //            <Circle cx={150 + x0to1 - x0} cy={150 + startPoints[0][1] + y0to1 - y0} r="5" stroke="red" fill="transparent" />


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
                    <Stop offset="0" stopColor="#029ea3" stopOpacity="0.85" />
                    <Stop offset="0.5" stopColor="#8aefc4" stopOpacity="0.85" />
                </RadialGradient>
            </Defs>
            <Circle cx={width / 2} cy={height / 2} r={smallerDim / 9} stroke="gray" fill="transparent" strokeDasharray="8, 2" />
            <Circle cx={width / 2} cy={height / 2} r={2 * smallerDim / 9} stroke="gray" fill="transparent" strokeDasharray="8, 4" />
            <Circle id="dist-outer-circle" cx={width / 2} cy={height / 2} r={smallerDim / 3} stroke="gray" fill="transparent" strokeDasharray="8, 6" />
            <Path d={`m${width / 2},${height / 2} ${angles}`} fill="none" strokeWidth="1px" stroke="gray" />
            <Path d={`m${width / 2},${height / 2 + shotTypeAnimatedRef.current.currentValues[0][1]} ${pointsOnly}`} fill="url(#grad)" strokeWidth="1px" stroke="white" />
        </Svg>



    }

    function makeNormalPath(x1, y1, x2, y2) {
        return `l${x2 - x1},${y2 - y1}`
    }

    function makeControlPath(x1, y1, x2, y2, xCFirst, yCFirst, xCSecond, yCSecond) {
        return `l${xCFirst},${yCFirst} l${-xCFirst},${-yCFirst} l${x2 - x1},${y2 - y1} l${xCSecond},${yCSecond} l${-xCSecond},${-yCSecond}`
    }

    function makeCurvedPath(x1, y1, x2, y2, xCFirst, yCFirst, xCSecond, yCSecond) {
        return `c ${xCFirst},${yCFirst} ${x2 - x1 - xCSecond},${y2 - y1 - yCSecond} ${x2 - x1},${y2 - y1}`

    }

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2))
    }

    function createLabels() {
        let shotKindMap = ["Dunk", "Layup", "Floater", "Basic Jump Shot", "Hook Shot", "Fadeaway", "Pull-Up", "Step-Back", "Turn-Around"]
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
        <h6>Shot Type Distribution</h6>
        <div id="shot-bezier-inner-div">
            {createLabels()}
            {processShotData()}
        </div>
    </div>
}

export default ShootingBezier