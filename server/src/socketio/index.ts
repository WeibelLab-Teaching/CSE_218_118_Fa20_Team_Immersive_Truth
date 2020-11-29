import { Server, Socket } from 'socket.io';
import chalk from 'chalk';
import { JoinRoomPayload, NewRoomPayload, Rooms } from './types';

// Since our game is relatively simple, I just use an object as a db instance.
const rooms: Rooms = {};
const userToRoom = new Map<string, string>();

export function setupSocketIO(io: Server): void {
  // connection handler
  io.on('connection', (socket: Socket) => {
    // create a new room
    socket.on('create room', ({ config, username, roomId }: NewRoomPayload) => {
      rooms[roomId] = {
        players: [{ username, socketId: socket.id }],
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
        // notifies all existing participants of the new player
        for (const player of rooms[roomId].players) {
          socket
            .to(player.socketId)
            .emit('new player joined', { username, socketId: socket.id });
        }

        // add the new user to the room
        userToRoom.set(socket.id, roomId);
        rooms[roomId].players.push({
          username,
          socketId: socket.id,
        });
      }
    });

    socket.on('offer', ({ id, message }) => {
      socket.to(id).emit('offer', { socketId: socket.id, message });
    });

    socket.on('answer', ({ id, message }) => {
      socket.to(id).emit('answer', { socketId: socket.id, message });
    });

    socket.on('candidate', ({ id, message }) => {
      socket.to(id).emit('candidate', { socketId: socket.id, message });
    });

    socket.on('disconnect', () => {
      const roomId = userToRoom.get(socket.id) as string;
      if (rooms[roomId]) {
        // 1. remove current player from the room
        const players = rooms[roomId].players;
        const userIndex = players.findIndex(
          (player) => player.socketId === socket.id
        );
        const disconnectedPlayer = players[userIndex];
        players.splice(userIndex, 1);

        // 2. notifies all participants
        for (const player of players) {
          socket.to(player.socketId).emit('player disconnected', {
            username: disconnectedPlayer.username,
            socketId: socket.id,
          });
        }
      }
    });
  });

  // error handler
  io.sockets.on('error', (e) => {
    console.log(`${chalk.red(`ERROR:`)} ${e}`);
  });
}
