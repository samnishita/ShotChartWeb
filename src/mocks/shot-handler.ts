import { SHOT_BASIC_ENDPOINT } from "../app/util/endpoints"
import { handlePost } from "./mock-util"

export const shotHandlers = [
    handlePost(SHOT_BASIC_ENDPOINT)
]