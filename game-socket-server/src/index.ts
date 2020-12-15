import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import chalk from 'chalk';
import { customAlphabet } from 'nanoid';

import { setupSocketIO } from './socketio';
import { rooms } from './database';

const PORT = process.env.PORT;

const app = express();
// express cors
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['*'],
    credentials: true,
  },
});

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 4);

// get a new roomId
app.get('/room', (_, res) => {
  let valid = false;
  let roomId = '';
  while (!valid) {
    roomId = nanoid();
    if (!rooms[roomId]) {
      valid = true;
    }
  }
  rooms[roomId] = null;
  // clean room after 30 mins if the room is still not initialized
  setTimeout(() => {
    if (rooms[roomId] === null) {
      delete rooms[roomId];
    }
  }, 1000 * 60 * 30);
  res.send({ roomId });
});

// check if room exists
app.get('/room/:id', (req, res) => {
  const roomId = req.params.id;
  if (roomId in rooms) {
    res.send();
  } else {
    res.status(404).send({
      error: 'room does not exist',
    });
  }
});

setupSocketIO(io);

server.listen(PORT, () => {
  console.log(
    `Server successfully started on ${chalk.yellow(`http://localhost:${PORT}`)}`
  );
});
