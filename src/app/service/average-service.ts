import { HexAverage } from "../model/HexAverage";
import { ZoneAverage } from "../model/ZoneAverage";
import { HEX_AVERAGE_ALL_TIME_ALL_SEASON, ZONE_AVERAGE_ALL_TIME_ALL_SEASON } from "../util/endpoints";

export const getGridAveragesAllTimeAllSeason = async (): Promise<ZoneAverage[]> => {
    return fetch(ZONE_AVERAGE_ALL_TIME_ALL_SEASON, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            return data.data;
        })
}

export const getHexAveragesAllTimeAllSeason = async (): Promise<HexAverage[]> => {
    return fetch(HEX_AVERAGE_ALL_TIME_ALL_SEASON, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            return data.data;
        })
}