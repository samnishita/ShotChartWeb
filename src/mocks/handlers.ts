import { averageHandlers } from './average-handler';
import { playerHandlers } from './player-handler';
import { shotHandlers } from './shot-handler';

export const handlers = [
  ...playerHandlers,
  ...shotHandlers,
  ...averageHandlers,
]
