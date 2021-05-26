"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = require("./Entity");
var Player_1 = require("./Player");
var typescript_map_1 = require("typescript-map");
var socket = require("socket.io");
var ExpressInit_1 = require("./ExpressInit");
var initPack = new typescript_map_1.TSMap();
var updatePack = new typescript_map_1.TSMap();
var removePack = new typescript_map_1.TSMap();
var io = socket(ExpressInit_1.default, {});
var SOCKET_LIST = new Array();
io.on('connection', function (socket) {
    socket.id = "" + Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id + " connected");
    Player_1.Player.onConnect(socket);
    socket.on('nofocus', function () {
        Player_1.Player.list[socket.id].clearInputs();
    });
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        Player_1.Player.onDisconnect(socket);
        console.log(socket.id + ' disconnected');
    });
});
setInterval(function () {
    Player_1.Player.update();
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('init', Entity_1.Entity.initPack);
        socket.emit('update', Entity_1.Entity.updatePack);
        socket.emit('remove', Entity_1.Entity.removePack);
    }
    Player_1.Player.clearPacks();
}, 1000 / 25);
