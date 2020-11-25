import { Server, Socket } from 'socket.io';
import chalk from 'chalk';
import { JoinRoomPayload, NewRoomPayload, Rooms } from './types';

// Since our game is relatively simple, I just use an object as a db instance.
const rooms: Rooms = {};

export function setupSocketIO(io: Server): void {
  // connection handler
  io.on('connection', (socket: Socket) => {
    // create a new room
    socket.on('create room', ({ config, hostname, roomId }: NewRoomPayload) => {
      rooms[roomId] = {
        host: { name: hostname, socketId: socket.id },
        players: [],
        config,
      };
    });

    // player join a room
    socket.on('join room', ({ username, roomId }: JoinRoomPayload) => {
      if (!rooms[roomId]) {
        // room does not exist, log an error message
        console.log(
          `${chalk.magenta(`Warning:`)} client with socket id ${chalk.yellow(
            `${socket.id}`
          )} tries to join a non existing room: ${roomId}.`
        );
      } else {
        // room exists, join the user to the room
        rooms[roomId].players.push({
          name: username,
          socketId: socket.id,
        });

        // TODO: notifies all existing participants
      }
    });

    // TODO: implement WebRTC protocol socket event listeners
    socket.on('offer', () => {});

    socket.on('answer', () => {});
  });

  // error handler
  io.sockets.on('error', (e) => {
    console.log(`${chalk.red(`ERROR:`)} ${e}`);
  });
}
