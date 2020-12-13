import { Server, Socket } from 'socket.io';

export function setupSocketIO(io: Server): void {
  io.on('connection', (socket: Socket) => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      console.log(`User joined room: roomId: ${roomId}, userId: ${userId}`);
      socket.to(roomId).broadcast.emit('user-connected', userId);
    });
  });
}
