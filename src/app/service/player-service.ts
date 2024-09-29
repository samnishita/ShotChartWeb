import { Player } from "../model/Player";
import { PLAYER_ALL_ENDPOINT } from "../util/endpoints";

export const getAllPlayers = (): Player[] => {
    let allPlayers: Player[] = [];
    fetch(PLAYER_ALL_ENDPOINT, {
        method: 'GET'
    }).then(response => console.log(response));
    return allPlayers;
}