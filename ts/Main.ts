import { Entity } from "./Entity";
import { Player } from "./Player";
import { TSMap } from "typescript-map";
import * as socket from "socket.io";
import server from "./ExpressInit";

//packs that store game's infos
var initPack:TSMap<string,any> = new TSMap<string,any>();
var updatePack:TSMap<string,any> = new TSMap<string,any>();
var removePack:TSMap<string,any> = new TSMap<string,any>();

//server socket

var io = socket(server,{});

//sockets list
var SOCKET_LIST:Array<any> = new Array<any>();

io.on('connection', function(socket)
{
    socket.id = "" + Math.random();
    SOCKET_LIST[socket.id] = socket;

    console.log(socket.id + " connected");

    Player.onConnect(socket);

    socket.on('nofocus', function(){
        Player.list[socket.id].clearInputs();
    });

    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
        console.log(socket.id + ' disconnected');
    });

});


setInterval(function()
{
    Player.update();
    for(var i in SOCKET_LIST)
    {
        var socket = SOCKET_LIST[i];
        socket.emit('init', Entity.initPack);
        socket.emit('update', Entity.updatePack);
        socket.emit('remove', Entity.removePack);
    }

    Player.clearPacks();

}, 1000/25);
