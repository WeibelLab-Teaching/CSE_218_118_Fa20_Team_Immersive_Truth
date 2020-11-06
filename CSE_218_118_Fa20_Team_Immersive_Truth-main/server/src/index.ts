import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import cors from 'cors';

import setupSocket from './socketio';

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
