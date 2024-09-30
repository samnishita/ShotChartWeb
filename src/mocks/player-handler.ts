import { PLAYER_ALL_ENDPOINT } from "../app/util/endpoints"
import { handleGet } from "./mock-util"

export const playerHandlers = [
    handleGet(PLAYER_ALL_ENDPOINT)
]