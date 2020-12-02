export interface Player {
  username: string;
  socketId: string;
}

export interface Room {
  players: Player[];
  config: RoomConfig;
}

export interface RoomConfig {
  villagerNum: number;
  mafiaNum: number;
  doctorNum: number;
  sheriffNum: number;
}

export interface Rooms {
  [index: string]: Room;
}
