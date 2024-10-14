import { Player } from "../model/Player";
import { SeasonType } from "../model/SeasonType";
import { Shot } from "../model/Shot";
import { Year } from "../model/Year";
import { SHOT_BASIC_ENDPOINT } from "../util/endpoints";
import { sleep } from "../util/shared-util";

export const getBasicShots = async (year: Year, player: Player, seasonType: SeasonType): Promise<Shot[]> => {
    await sleep(1000);
    const response = await fetch(SHOT_BASIC_ENDPOINT, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            year: year.yearDisplay,
            playerId: player.playerId,
            seasonType: seasonType.urlValue
        })
    });
    const data = await response.json();
    return data.data;
}