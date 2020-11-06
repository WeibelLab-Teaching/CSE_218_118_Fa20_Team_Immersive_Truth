import socketio = require('socket.io');

const rooms = {};

export default function setupSocket(io: socketio.Server): void {
  io.on('connection', (socket) => {
    socket.on('join-room', (roomId, name, userId) => {
      socket.join(roomId);
      socket.to(roomId).broadcast.emit('user-connected', userId);
    });

    // TODO: handle disconnect
    socket.on('disconnect', () => {});
  });
}
