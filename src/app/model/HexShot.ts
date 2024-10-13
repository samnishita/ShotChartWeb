import { generateMapKey } from "../CourtDisplay/CourtDisplay";

export interface HexShot {
    x: number;
    y: number;
    q: number;
    r: number;
    s: number;
    aOverall: number;
    aMadeShots: number;
    aTotalShots: number;
    bOverall: number;
    bMadeShots: number;
    bTotalShots: number;
    wOverall: number;
    wMadeShots: number;
    wTotalShots: number;
    madeShots: number;
    totalShots: number;
}

export const P_VALUE = 2;

export interface Hex {
    q: number;
    r: number;
}

interface Cube {
    q: number;
    r: number;
    s: number;
}

const AXIAL_DIRECTION_VECTORS: Hex[] = [
    {
        q: 1,
        r: 0
    },
    {
        q: 1,
        r: -1
    },
    {
        q: 0,
        r: -1
    },
    {
        q: -1,
        r: 0
    },
    {
        q: -1,
        r: 1
    },
    {
        q: 0,
        r: 1
    },
]

const AXIAL_DIAGONAL_VECTORS: Hex[] = [
    {
        q: 2,
        r: -1
    },
    {
        q: 1,
        r: -2
    },
    {
        q: -1,
        r: -1
    },
    {
        q: -2,
        r: 1
    },
    {
        q: -1,
        r: 2
    },
    {
        q: 1,
        r: 1
    },
]

export const HEX_STROKE_WIDTH: number = 2;
export const HEX_SIZE_POINTY: number = 9.0;
export const HEX_WIDTH_POINTY: number = HEX_SIZE_POINTY * Math.sqrt(3);
export const HEX_HEIGHT_POINTY: number = 2 * HEX_SIZE_POINTY;
export const HEX_POINTY_ALTERNATE_ROW_HORIZONTAL_OFFSET: number = Math.sqrt(3) * HEX_SIZE_POINTY / 2;
export const HEX_POINTY_ROW_SPACING: number = 1.5 * HEX_SIZE_POINTY;

export const convertPixelToPointyHex = (xPixel: number, yPixel: number): Hex => {
    let q: number = (Math.sqrt(3) / 3 * xPixel - (1 / 3 * yPixel)) / HEX_SIZE_POINTY;
    let r: number = 2 / 3 * yPixel / HEX_SIZE_POINTY;
    return axialRound({ q, r });
}

const axialRound = (hex: Hex): Hex => {
    return cubeToAxial(cubeRound(axialToCube(hex)));
}

const axialToCube = (hex: Hex): Cube => {
    let q: number = hex.q;
    let r: number = hex.r;
    let s: number = -q - r;
    return { q, r, s };
}

const cubeRound = (cube: Cube): Cube => {
    let q: number = Math.round(cube.q);
    let r: number = Math.round(cube.r);
    let s: number = Math.round(cube.s);

    let qDiff: number = Math.abs(q - cube.q);
    let rDiff: number = Math.abs(r - cube.r);
    let sDiff: number = Math.abs(s - cube.s);

    if (qDiff > rDiff && qDiff > sDiff) {
        q = -r - s;
    } else if (rDiff > sDiff) {
        r = -q - s;
    } else {
        s = -q - r;
    }
    return { q, r, s };
}

const cubeToAxial = (cube: Cube): Hex => {
    let q: number = cube.q;
    let r: number = cube.r;
    return { q, r };
}

const axialDirection = (direction: number): Hex => {
    return AXIAL_DIRECTION_VECTORS[direction];
}

const axialAdd = (hex: Hex, vector: Hex): Hex => {
    return {
        q: hex.q + vector.q,
        r: hex.r + vector.r
    }
}

export const axialNeighbor = (hex: Hex, direction: number): Hex => {
    return axialAdd(hex, axialDirection(direction));
}

const axialDiagonalNeighbor = (hex: Hex, direction: number): Hex => {
    return axialAdd(hex, AXIAL_DIAGONAL_VECTORS[direction]);
}

const axialSubtract = (hex: Hex, vector: Hex): Hex => {
    return {
        q: hex.q - vector.q,
        r: hex.r - vector.r
    }
}

export const axialDistance = (a: Hex, b: Hex): number => {
    let vector: Hex = axialSubtract(a, b);
    return (Math.abs(vector.q) + Math.abs(vector.q + vector.r) + Math.abs(vector.r)) / 2;
}

export const analyzeNeighbors = (originalHex: HexShot, hexMap: Map<string, HexShot>): void => {
    for (let i = 0; i < 6; i++) {
        let directNeighbor: Hex = axialNeighbor(originalHex, i);
        let hexFromMap: HexShot | undefined = hexMap.get(generateMapKey(directNeighbor.q, directNeighbor.r));
        if (hexFromMap) {
            doIdw(originalHex, hexFromMap);
        }
        let doubleDirectNeighbor: Hex = axialNeighbor(directNeighbor, i);
        hexFromMap = hexMap.get(generateMapKey(doubleDirectNeighbor.q, doubleDirectNeighbor.r));
        if (hexFromMap) {
            doIdw(originalHex, hexFromMap);
        }
        let diagonalNeighbor: Hex = axialDiagonalNeighbor(originalHex, i);
        hexFromMap = hexMap.get(generateMapKey(diagonalNeighbor.q, diagonalNeighbor.r));
        if (hexFromMap) {
            doIdw(originalHex, hexFromMap);
        }
    }
}

const doIdw = (originalHex: HexShot, neighborHex: HexShot): void => {
    let distance: number = axialDistance(originalHex, neighborHex);
    let denominator: number = Math.pow(distance, P_VALUE);
    originalHex.aMadeShots += neighborHex.madeShots / denominator;
    originalHex.aTotalShots += neighborHex.totalShots / denominator;
    originalHex.bMadeShots += 1 / denominator;
    originalHex.bTotalShots += 1 / denominator;
}