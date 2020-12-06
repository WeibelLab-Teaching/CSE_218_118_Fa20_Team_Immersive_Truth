"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
var chalk_1 = __importDefault(require("chalk"));
var database_1 = require("../database");
var userToRoom = new Map();
function setupSocketIO(io) {
    // connection handler
    io.on('connection', function (socket) {
        // create a new room
        socket.on('create room', function (_a) {
            var config = _a.config, username = _a.username, roomId = _a.roomId;
            database_1.rooms[roomId] = {
                players: [{ username: username, socketId: socket.id }],
                config: config,
            };
            console.log(chalk_1.default.blue("New room " + ("(" + chalk_1.default.yellow(roomId) + ")") + " with the following config has been created: "));
            console.log(database_1.rooms[roomId]);
        });
        // player join a room
        socket.on('join room', function (_a) {
            var username = _a.username, roomId = _a.roomId;
            if (!database_1.rooms[roomId]) {
                // room does not exist, log an error message
                console.log(chalk_1.default.magenta("Warning:") + " client with socket id " + chalk_1.default.yellow("" + socket.id) + " tries to join a non existing room: " + roomId + ".");
            }
            else {
                // notifies all existing participants of the new player
                for (var _i = 0, _b = database_1.rooms[roomId].players; _i < _b.length; _i++) {
                    var player = _b[_i];
                    socket
                        .to(player.socketId)
                        .emit('new player joined', { username: username, socketId: socket.id });
                }
                // add the new user to the room
                userToRoom.set(socket.id, roomId);
                database_1.rooms[roomId].players.push({
                    username: username,
                    socketId: socket.id,
                });
            }
        });
        socket.on('offer', function (id, message) {
            socket.to(id).emit('offer', { socketId: socket.id, message: message });
        });
        socket.on('answer', function (id, message) {
            socket.to(id).emit('answer', { socketId: socket.id, message: message });
        });
        socket.on('candidate', function (id, message) {
            socket.to(id).emit('candidate', { socketId: socket.id, message: message });
        });
        socket.on('disconnect', function () {
            var roomId = userToRoom.get(socket.id);
            if (database_1.rooms[roomId]) {
                // 1. remove current player from the room
                var players = database_1.rooms[roomId].players;
                var userIndex = players.findIndex(function (player) { return player.socketId === socket.id; });
                var disconnectedPlayer = players[userIndex];
                players.splice(userIndex, 1);
                // 2. notifies all participants
                console.log(chalk_1.default.red("player " + socket.id + " has disconnected."));
                for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
                    var player = players_1[_i];
                    socket.to(player.socketId).emit('player disconnected', {
                        username: disconnectedPlayer.username,
                        socketId: socket.id,
                    });
                }
            }
        });
    });
    // error handler
    io.sockets.on('error', function (e) {
        console.log(chalk_1.default.red("ERROR:") + " " + e);
    });
}
exports.setupSocketIO = setupSocketIO;
