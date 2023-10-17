"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const __1 = require("..");
const config_1 = require("../config");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const port = config_1.PORT || 3000;
app.use('/', (0, __1.downloadPageRouter)());
httpServer.listen(port, () => {
    console.log('listening on *:' + port);
});
