import { AutocompleteMenuItem } from "./AutocompleteMenuItem";

export interface Player extends AutocompleteMenuItem {
    playerId: string,
    playerLastName: string,
    playerFirstName: string,
}