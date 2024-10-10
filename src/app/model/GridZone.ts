export interface GridZone {
    id: number;
    description: string;
    madeShots: number;
    totalShots: number;
    height: number;
    width: number;
    d: string;
    stroke: string;
    strokeWidth: number;
    fill: string;
    sx: {},
    translateX: number,
    translateY: number,
}

const STROKE_WIDTH: number = 3;
const STROKE: string = "white";
const FILL_DEFAULT: string = "rgba(0,0,0,0.3)";

export const GRID_1: GridZone = {
    id: 1,
    description: "Restricted Area",
    madeShots: 0,
    totalShots: 0,
    height: 100,
    width: 100,
    d: "m 11 97  l 78 0 l0 -56 a4,3.7 0 0,0 -77,0 l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 0,
    translateY: 370
}

export const GRID_2: GridZone = {
    id: 2,
    description: "Near basket",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 170,
    d: "m 6 142 l 41 0 l0 -56 a4,3.7 0 0,1 77,0 l0 56 l40 0 l0 -56 a5,5.25 0 1,0 -157,0 l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 0,
    translateY: 325
}

export const GRID_3: GridZone = {
    id: 3,
    description: "Left side short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 205,
    width: 125,
    d: "m 40,200 l 81 0 l0 -56 a170,170 0 0,0 -78.6,-145 l-41 73 a85,85 0 0,1 38.7,71.2  l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 101,
    translateY: 267
}


export const GRID_4: GridZone = {
    id: 4,
    description: "Center short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 100,
    width: 170,
    //d = ` l${scaleNumber(41)} ${scaleNumber(-73)}`
    d: "m 45 100  a85,85 0 0,1 80 0 l41 -71.8 a160,160 0 0,0 -162 0 l41 73",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 0,
    translateY: 239
}


export const GRID_5: GridZone = {
    id: 5,
    description: "Right side short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 205,
    width: 125,
    d: "m 5,200  l 81 0 l0 -56 a85,85 0 0,1 38.7,-71.2 l-41 -73 a170,170 0 0,0 -78.6,145  l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: -102,
    translateY: 267
}

export const GRID_6: GridZone = {
    id: 6,
    description: "Left side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 200,
    width: 90,
    d: "m 27 197 l59 0 l0 -135 a200,200 0 0,0 -22.75,-48 l-60,40 a200,200 0 0,1 24,88.5 l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 177,
    translateY: 270
}

export const GRID_7: GridZone = {
    id: 7,
    description: "Left-center side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 140,
    width: 150,
    d: "m 85,140 a150,150 0 0,0 -80 -68 l22 -65 a230,230 0 0,1 118 92.5 l-60 40",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 125,
    translateY: 184
}

export const GRID_8: GridZone = {
    id: 8,
    description: "Center long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 90,
    width: 165,
    d: "m 25,80 a150,150 0 0,1 113 0 l 21.5 -65 a230,230 0 0,0 -155.5 0 l22 65",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 0,
    translateY: 175
}

export const GRID_9: GridZone = {
    id: 9,
    description: "Right-center side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 140,
    width: 150,
    d: "m 3 99 l60 40 a150,150 0 0,1 80 -68 l-22 -65 a230,230 0 0,0 -118 92.5",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: -125,
    translateY: 184
}

export const GRID_10: GridZone = {
    id: 10,
    description: "Right side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 200,
    width: 90,
    d: "m 61 198.5 l0 -56 a200,200 0 0,1 24,-88.5 l-60,-40 a200,200 0 0,0 -22.75,48  l0 135 l59 0  ",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: -177,
    translateY: 270
}

export const GRID_11: GridZone = {
    id: 11,
    description: "Left side corner 3",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 35,
    d: "m 3 2 l27 0 l0 137 l-27 0 l0 -137",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 233,
    translateY: 328
}

export const GRID_12: GridZone = {
    id: 12,
    description: "Left center 3",
    madeShots: 0,
    totalShots: 0,
    height: 340,
    width: 165,
    d: "m 132 327 l27 0 l0 -325 l-80 0 l-75 193 a220,220 0 0,1 128,134",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 170,
    translateY: 2
}

export const GRID_13: GridZone = {
    id: 13,
    description: "Center 3",
    madeShots: 0,
    totalShots: 0,
    height: 200,
    width: 340,
    d: "m 80 200 a245,245 0 0,1 179,0 l77 -192 l-333 0 l77 192",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: 1,
    translateY: -5
}

export const GRID_14: GridZone = {
    id: 14,
    description: "Right center 3",
    madeShots: 0,
    totalShots: 0,
    height: 340,
    width: 165,
    d: "m 3 335 l27 0 a220,220 0 0,1 128,-134 l-75 -191  l-80 0 l0 325  ",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: -166,
    translateY: -7
}

export const GRID_15: GridZone = {
    id: 15,
    description: "Right side corner 3",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 35,
    d: "m 3 2 l27 0 l0 137 l-27 0 l0 -137",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: STROKE,
    strokeWidth: STROKE_WIDTH,
    translateX: -232,
    translateY: 327.5
}

export const ALL_GRIDS: GridZone[] = [
    GRID_1,
    GRID_2,
    GRID_3,
    GRID_4,
    GRID_5,
    GRID_6,
    GRID_7,
    GRID_8,
    GRID_9,
    GRID_10,
    GRID_11,
    GRID_12,
    GRID_13,
    GRID_14,
    GRID_15
]