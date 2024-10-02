import { SelectMenuItem } from "./SelectMenuItem";

export interface SeasonType extends SelectMenuItem {
    urlValue: string;
}

export const PRESEASON: SeasonType = {
    value: "Preseason",
    id: "preseason-season-type",
    label: "Preseason",
    urlValue: "Preseason"
}

export const REGULAR_SEASON: SeasonType = {
    value: "RegularSeason",
    id: "regular-season-season-type",
    label: "Regular Season",
    urlValue: "Regular%20Season"
}

export const PLAYOFFS: SeasonType = {
    value: "Playoffs",
    id: "playoffs-season-type",
    label: "Playoffs",
    urlValue: "Playoffs"
}

export const PLAY_IN: SeasonType = {
    value: "PlayIn",
    id: "play-in-season-type",
    label: "Play In",
    urlValue: "Play%20In"
}

export const ALL_SEASON_TYPES: SeasonType[] = [
    PRESEASON,
    REGULAR_SEASON,
    PLAY_IN,
    PLAYOFFS
]