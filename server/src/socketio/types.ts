export interface Player {
  name: string;
  socketId: string;
}

export interface Room {
  host: Player;
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
  hostname: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface Rooms {
  [index: string]: Room;
}
