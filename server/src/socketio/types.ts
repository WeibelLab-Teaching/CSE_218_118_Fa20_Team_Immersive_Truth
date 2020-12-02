import { RoomConfig } from '../database/types';

export interface NewRoomPayload {
  config: RoomConfig;
  roomId: string;
  username: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}
