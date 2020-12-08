import express from 'express';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';
import { Server as SocketIO } from 'socket.io';

import { setupSocketIO } from './socketio';
import { rooms } from './database';

const PORT = process.env.PORT;

const app = express();
// express cors settings
app.use(cors());

const server = http.createServer(app);
// socket.io cors settings
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
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
