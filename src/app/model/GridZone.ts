import { Shot } from "./Shot";

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
    labelX: number,
    labelY: number,
    maxLabelLength: number
}

const GRID_STROKE_WIDTH: number = 3;
const GRID_STROKE: string = "black";
export const FILL_DEFAULT: string = "rgba(0,0,0,0.3)";

export const FILL_FAR_BELOW_AVERAGE: string = "#092beb";
export const FILL_BELOW_AVERAGE: string = "#1f75fe";
export const FILL_SLIGHTLY_BELOW_AVERAGE: string = "#0596f7";
export const FILL_AVERAGE: string = "#919090";
export const FILL_SLIGHTLY_ABOVE_AVERAGE: string = "#fa8989";
export const FILL_ABOVE_AVERAGE: string = "#e05353";
export const FILL_FAR_ABOVE_AVERAGE: string = "#fa0202";

export const ZONE_1: GridZone = {
    id: 1,
    description: "Restricted Area",
    madeShots: 0,
    totalShots: 0,
    height: 100,
    width: 100,
    d: "m 11 97 l 77.6 0 l0 -56 a4,3.7 0 0,0 -77,0 l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 0,
    translateY: 420.8,
    labelX: 0,
    labelY: 430,
    // maxLabelLength: 7
    maxLabelLength: 100
}

export const ZONE_2: GridZone = {
    id: 2,
    description: "Near basket",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 170,
    d: "m 5 142 l 41.2 0 l0 -56 a4,3.7 0 0,1 77,0 l0 56 l40 0 l0 -56 a5,5.25 0 1,0 -157,0 l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 0,
    translateY: 398.65,
    labelX: 0,
    labelY: 355,
    maxLabelLength: 100
}

export const ZONE_3: GridZone = {
    id: 3,
    description: "Left side short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 210,
    width: 125,
    d: "m 40,202 l 81 0 l0 -56 a170,170 0 0,0 -78.6,-145 l-41 73 a85,85 0 0,1 38.7,71.2  l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 101,
    translateY: 371.4,
    labelX: 115,
    labelY: 395,
    maxLabelLength: 100
}

export const ZONE_4: GridZone = {
    id: 4,
    description: "Center short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 100,
    width: 170,
    d: "m 45 100  a85,85 0 0,1 80 0 l41 -74 a160,160 0 0,0 -162 0 l41 73",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 0,
    translateY: 291,
    labelX: 0,
    labelY: 290,
    maxLabelLength: 100
}

export const ZONE_5: GridZone = {
    id: 5,
    description: "Right side short mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 210,
    width: 125,
    d: "m 5,202  l 81 0 l0 -56 a85,85 0 0,1 38.7,-71.2 l-41 -73.5 a170,170 0 0,0 -78.6,145  l0 56",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: -102,
    translateY: 371.2,
    labelX: -115,
    labelY: 395,
    maxLabelLength: 100
}

export const ZONE_6: GridZone = {
    id: 6,
    description: "Left side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 200,
    width: 90,
    d: "m 27 197 l59.2 0 l0 -138 a200,200 0 0,0 -22.75,-48 l-60,40 a200,200 0 0,1 24,88.5 l0 58",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 177,
    translateY: 370.8,
    labelX: 184,
    labelY: 345,
    maxLabelLength: 100
}

export const ZONE_7: GridZone = {
    id: 7,
    description: "Left-center side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 140,
    width: 150,
    d: "m 85,137.5 a150,150 0 0,0 -80 -67 l22 -65 a230,230 0 0,1 119.5 93 l-62 40",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 125,
    translateY: 255,
    labelX: 125,
    labelY: 255,
    maxLabelLength: 100
}

export const ZONE_8: GridZone = {
    id: 8,
    description: "Center long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 100,
    width: 165,
    d: "m 20,84.5 a165,165 0 0,1 118 -2 l 21.5 -65 a230,230 0 0,0 -155 0 l22 65",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 0,
    translateY: 223,
    labelX: 0,
    labelY: 212,
    maxLabelLength: 100
}

export const ZONE_9: GridZone = {
    id: 9,
    description: "Right-center side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 140,
    width: 150,
    d: "m 1.3 98 l61.5 40 a150,150 0 0,1 80 -69.5 l-22 -64.3 a230,230 0 0,0 -119 93",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: -124,
    translateY: 257,
    labelX: -125,
    labelY: 255,
    maxLabelLength: 100
}

export const ZONE_10: GridZone = {
    id: 10,
    description: "Right side long mid-range",
    madeShots: 0,
    totalShots: 0,
    height: 200,
    width: 90,
    d: "m 61 198.5 l0 -56 a200,200 0 0,1 24,-88.5 l-60,-40 a200,200 0 0,0 -22.75,48  l0 135.6 l59 0  ",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: -176,
    translateY: 370,
    labelX: -184,
    labelY: 345,
    maxLabelLength: 100
}

export const ZONE_11: GridZone = {
    id: 11,
    description: "Left side corner 3",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 35,
    d: "m 3 2 l29 0 l0 137 l-29 0 l0 -137",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 233,
    translateY: 401.7,
    labelX: 210,
    labelY: 440,
    maxLabelLength: 100
}

export const ZONE_12: GridZone = {
    id: 12,
    description: "Left center 3",
    madeShots: 0,
    totalShots: 0,
    height: 340,
    width: 165,
    d: "m 134 327 l27 0 l0 -328 l-80 0 l-75 193.3 a220,220 0 0,1 127,134",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 169,
    translateY: 174,
    labelX: 175,
    labelY: 170,
    maxLabelLength: 100
}

export const ZONE_13: GridZone = {
    id: 13,
    description: "Center 3",
    madeShots: 0,
    totalShots: 0,
    height: 210,
    width: 340,
    d: "m 75 202.5 a245,245 0 0,1 187.5, 0 l73.5 -193.5 l-334 0 l73 193",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: 1,
    translateY: 99,
    labelX: 0,
    labelY: 120,
    maxLabelLength: 100
}

export const ZONE_14: GridZone = {
    id: 14,
    description: "Right center 3",
    madeShots: 0,
    totalShots: 0,
    height: 340,
    width: 165,
    d: "m 3 335 l28.4 0 a220,220 0 0,1 128,-135 l-75 -194 l-81.7 0 l0 329",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: -168.6,
    translateY: 166,
    labelX: -175,
    labelY: 170,
    maxLabelLength: 100
}

export const ZONE_15: GridZone = {
    id: 15,
    description: "Right side corner 3",
    madeShots: 0,
    totalShots: 0,
    height: 145,
    width: 35,
    d: "m 3 2 l29 0 l0 137 l-29 0 l0 -137",
    sx: {},
    fill: FILL_DEFAULT,
    stroke: GRID_STROKE,
    strokeWidth: GRID_STROKE_WIDTH,
    translateX: -233.7,
    translateY: 401.7,
    labelX: -210,
    labelY: 440,
    maxLabelLength: 100
}

export const ALL_ZONES: GridZone[] = [
    ZONE_1,
    ZONE_2,
    ZONE_3,
    ZONE_4,
    ZONE_5,
    ZONE_6,
    ZONE_7,
    ZONE_8,
    ZONE_9,
    ZONE_10,
    ZONE_11,
    ZONE_12,
    ZONE_13,
    ZONE_14,
    ZONE_15
]

export const determineShotZone = (eachShot: Shot, zones: GridZone[]): void => {
    const make: boolean = eachShot.shotMade;
    switch (eachShot.shotZoneBasic) {
        case "Backcourt":
            //No backcourt
            break;
        case "Restricted Area":
            //Add to zone 1
            addShot(zones[0], make);
            break;
        case "In The Paint (Non-RA)":
            switch (eachShot.shotZoneArea) {
                case "Left Side(L)":
                    switch (eachShot.shotZoneRange) {
                        case "8-16 ft.":
                            addShot(zones[2], make);
                            break;
                    }
                    break;
                case "Center(C)":
                    switch (eachShot.shotZoneRange) {
                        case "Less Than 8 ft.":
                            addShot(zones[1], make);
                            break;
                        case "8-16 ft.":
                            addShot(zones[3], make);
                            break;
                    }
                    break;
                case "Right Side(R)":
                    switch (eachShot.shotZoneRange) {
                        case "8-16 ft.":
                            addShot(zones[4], make);
                            break;
                    }
                    break;
            }
            break;
        case "Mid-Range":
            switch (eachShot.shotZoneArea) {
                case "Left Side(L)":
                    switch (eachShot.shotZoneRange) {
                        case "8-16 ft.":
                            addShot(zones[2], make);
                            break;
                        case "16-24 ft.":
                            addShot(zones[5], make);
                            break;
                    }
                    break;
                case "Left Side Center(LC)":
                    switch (eachShot.shotZoneRange) {
                        case "16-24 ft.":
                            addShot(zones[6], make);
                            break;
                    }
                    break;
                case "Center(C)":
                    switch (eachShot.shotZoneRange) {
                        case "8-16 ft.":
                            addShot(zones[3], make);
                            break;
                        case "16-24 ft.":
                            addShot(zones[7], make);
                            break;
                    }
                    break;
                case "Right Side Center(RC)":
                    switch (eachShot.shotZoneRange) {
                        case "16-24 ft.":
                            addShot(zones[8], make);
                            break;
                    }
                    break;
                case "Right Side(R)":
                    switch (eachShot.shotZoneRange) {
                        case "8-16 ft.":
                            addShot(zones[4], make);
                            break;
                        case "16-24 ft.":
                            addShot(zones[9], make);
                            break;
                    }
                    break;
            }
            break;
        case "Left Corner 3":
            addShot(zones[10], make);
            break;
        case "Right Corner 3":
            addShot(zones[14], make);
            break;
        case "Above the Break 3":
            switch (eachShot.shotZoneArea) {
                case "Left Side Center(LC)":
                    switch (eachShot.shotZoneRange) {
                        case "24+ ft.":
                            addShot(zones[11], make);
                            break;
                    }
                    break;
                case "Center(C)":
                    switch (eachShot.shotZoneRange) {
                        case "24+ ft.":
                            addShot(zones[12], make);
                            break;
                    }
                    break;
                case "Right Side Center(RC)":
                    switch (eachShot.shotZoneRange) {
                        case "24+ ft.":
                            addShot(zones[13], make);
                            break;
                        default:
                    }
                    break;
            }
            break;
    }
}

const addShot = (zone: GridZone, make: boolean): void => {
    if (make) {
        zone.madeShots++;
    }
    zone.totalShots++;
}