export enum Role {
  mafia,
  villager,
}

export interface Player {
  username: string;
  socketId: string;
  isOut: boolean;
  role: Role;
}

export interface Room {
  players: {
    [playerSocketId: string]: Player;
  };
  roomConfig: RoomConfig;
  votes: string[];
  interval?: NodeJS.Timeout;
  roomId: string;
  killedPlayers: string[];
}

export interface RoomConfig {
  villagerNum: number;
  mafiaNum: number;
}

export interface Rooms {
  [index: string]: Room | null;
}
