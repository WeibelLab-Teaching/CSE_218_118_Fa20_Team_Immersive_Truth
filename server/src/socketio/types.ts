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

export interface NewRoomPayload {
  config: RoomConfig;
  roomId: string;
  username: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface Rooms {
  [index: string]: Room;
}
