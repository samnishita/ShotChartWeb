import { ZoneAverage } from "../model/ZoneAverage";
import { ZONE_AVERAGE_ALL_TIME_ALL_SEASON } from "../util/endpoints";

export const getGridAveragesAllTimeAllSeason = async (): Promise<ZoneAverage[]> => {
    return fetch(ZONE_AVERAGE_ALL_TIME_ALL_SEASON, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            return data.data;
        })
}