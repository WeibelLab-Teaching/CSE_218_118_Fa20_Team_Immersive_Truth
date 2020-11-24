import express from 'express';
import http from 'http';
import cors from 'cors';
import chalk from 'chalk';
import { Server as SocketIO } from 'socket.io';

import { setupSocketIO } from './socketio';

const PORT = 9999;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true,
  },
});

setupSocketIO(io);

server.listen(PORT, () => {
  console.log(
    `Server successfully started on ${chalk.yellow(`http://localhost:${PORT}`)}`
  );
});
