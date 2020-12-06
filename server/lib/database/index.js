"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
// Since our game is relatively simple, I just use an object as a db instance.
exports.rooms = {
    '1': {
        players: [],
        config: { villagerNum: 1, sheriffNum: 1, doctorNum: 1, mafiaNum: 1 },
    },
};
