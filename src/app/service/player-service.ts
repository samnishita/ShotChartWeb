import { Player } from "../model/Player";
import { PLAYER_ALL_ENDPOINT } from "../util/endpoints";

export const getAllPlayers = (): Promise<Player[]> => {
    return fetch(PLAYER_ALL_ENDPOINT, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            return data.data;
        })
}
