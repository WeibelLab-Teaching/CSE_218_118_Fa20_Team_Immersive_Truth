import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import chalk from 'chalk';

import { setupSocketIO } from './socketio';

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

setupSocketIO(io);

server.listen(PORT, () => {
  console.log(
    `Server successfully started on ${chalk.yellow(`http://localhost:${PORT}`)}`
  );
});
