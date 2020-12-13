import chalk from 'chalk';
import { Server, Socket } from 'socket.io';
import { shuffle } from 'lodash';

import { rooms, userToRoom } from '../database';
import { Role, Room, RoomConfig } from '../database/types';
import { handleKill, handleStart, handleVote } from './game';

export function setupSocketIO(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`new player connected: ${socket.id}`);

    socket.on(
      'create room',
      (roomConfig: RoomConfig, roomId: string, username: string) => {
        console.log(`create room request received!`);

        if (!roomConfig || !roomId || !username) {
          socket.emit(
            'error',
            `Make sure you passed in 'roomConfig', 'roomId' and 'username' correctly!`
          );
          return;
        }

        rooms[roomId] = {
          roomConfig,
          players: {},
          votes: [],
          isDay: true,
          roomId,
          killedPlayers: [],
        };

        const player = {
          username,
          socketId: socket.id,
          isOut: false,
          role: pickRole(roomId),
        };

        (rooms[roomId] as Room).players[socket.id] = player;

        console.log(rooms[roomId]);
        userToRoom.set(socket.id, roomId);

        // tell the host his character
        socket.emit('joined room', Role[player.role], socket.id);

        console.log(
          chalk.blue(
            `New room ${`(${chalk.yellow(
              roomId
            )})`} with the following config has been created: `
          )
        );
        console.log(rooms[roomId]);
      }
    );

    socket.on('join room', (roomId: string, username: string) => {
      if (!roomId || !username) {
        socket.emit(
          'error',
          `Please make sure 'roomId' and 'username' arguments are passed!`
        );
      }

      if (!rooms[roomId]) {
        // room does not exist, log an error message
        console.log(
          `${chalk.magenta(`Warning:`)} client with socket id ${chalk.yellow(
            `${socket.id}`
          )} tries to join a non existing room: ${roomId}.`
        );
      } else {
        const room = rooms[roomId] as Room;
        const newPlayer = {
          username,
          socketId: socket.id,
          isOut: false,
          role: pickRole(roomId),
        };
        room.players[socket.id] = newPlayer;

        // tell everyone a new player has joined
        socket.emit('joined room', Role[newPlayer.role], socket.id);
        const existingPlayers = [];

        // notify all other players
        for (const player of Object.values(room.players)) {
          if (player.socketId === socket.id) {
            continue;
          }
          socket
            .to(player.socketId)
            .emit(
              'new player joined',
              newPlayer.socketId,
              newPlayer.username,
              newPlayer.role
            );
          existingPlayers.push(player);
        }

        // tell the newly joined player all already existing players
        socket.emit('existing players', existingPlayers);
      }
    });

    handleStart(socket);
    handleVote(socket);
    handleKill(socket);

    socket.on('disconnect', () => {
      console.log(`player ${socket.id} has disconnected.`);
      const roomId = userToRoom.get(socket.id) as string;
      if (rooms[roomId]) {
        // 1. remove current player from the room
        const players = (rooms[roomId] as Room).players;
        const disconnectedPlayer = players[socket.id];
        delete players[socket.id];

        // 2. notifies all participants
        for (const player of Object.values(players)) {
          socket
            .to(player.socketId)
            .emit(
              'player disconnected',
              socket.id,
              disconnectedPlayer.username
            );
        }
      }
    });
  });

  // error handler
  io.sockets.on('error', (e) => {
    console.log(`${chalk.red(`ERROR:`)} ${e}`);
  });
}

/**
 * Given a roomId, randomly picks and return  an available role.
 * @param roomId
 */
function pickRole(roomId: string): Role {
  const { roomConfig, players } = rooms[roomId] as Room;
  let mafiaNum = roomConfig.mafiaNum;
  let sheriffNum = roomConfig.sheriffNum;
  let doctorNum = roomConfig.doctorNum;
  let villagerNum = roomConfig.villagerNum;

  for (const player of Object.values(players)) {
    switch (player.role) {
      case Role.doctor:
        doctorNum--;
        break;
      case Role.mafia:
        mafiaNum--;
        break;
      case Role.sheriff:
        sheriffNum--;
        break;
      case Role.villager:
        villagerNum--;
        break;
    }
  }

  const roleCandidates = [];
  for (let i = 0; i < mafiaNum; i++) roleCandidates.push(Role.mafia);
  for (let i = 0; i < sheriffNum; i++) roleCandidates.push(Role.sheriff);
  for (let i = 0; i < doctorNum; i++) roleCandidates.push(Role.doctor);
  for (let i = 0; i < villagerNum; i++) roleCandidates.push(Role.villager);

  const role = shuffle(roleCandidates)[0];
  return role;
}
