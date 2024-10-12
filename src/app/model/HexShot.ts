export interface HexShot {
    x: number;
    y: number;
    q: number;
    r: number;
    s: number;
    a: number;
    b: number;
    idwScore: number;
    madeShots: number;
    totalShots: number;

}

export interface Hex {
    q: number;
    r: number;
}

interface Cube {
    q: number;
    r: number;
    s: number;
}

export const HEX_STROKE_WIDTH: number = 2;
export const HEX_SIZE_POINTY: number = 10;
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
