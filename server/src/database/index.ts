import { Rooms } from './types';

// Since our game is relatively simple, I just use an object as a db instance.
export const rooms: Rooms = {
  '1': {
    players: [],
    config: { villagerNum: 1, sheriffNum: 1, doctorNum: 1, mafiaNum: 1 },
  },
};
