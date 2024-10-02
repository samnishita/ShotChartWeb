import { playerHandlers } from './player-handler';
import { shotHandlers } from './shot-handler';

export const handlers = [
  ...playerHandlers,
  ...shotHandlers
]
