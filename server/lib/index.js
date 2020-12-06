"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var cors_1 = __importDefault(require("cors"));
var chalk_1 = __importDefault(require("chalk"));
var socket_io_1 = require("socket.io");
var socketio_1 = require("./socketio");
var database_1 = require("./database");
var PORT = 9999;
var app = express_1.default();
// express cors settings
app.use(cors_1.default());
var server = http_1.default.createServer(app);
// socket.io cors settings
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
    },
});
// check if room exists
app.get('/room/:id', function (req, res) {
    var roomId = req.params.id;
    if (roomId in database_1.rooms) {
        res.send();
    }
    else {
        res.status(404).send({
            error: 'room does not exist',
        });
    }
});
socketio_1.setupSocketIO(io);
server.listen(PORT, function () {
    console.log("Server successfully started on " + chalk_1.default.yellow("http://localhost:" + PORT));
});
