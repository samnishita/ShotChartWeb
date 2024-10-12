import { ZONE_AVERAGE_ALL_TIME_ALL_SEASON } from "../app/util/endpoints";
import { handleGet } from "./mock-util";

export const averageHandlers = [
    handleGet(ZONE_AVERAGE_ALL_TIME_ALL_SEASON)
]