"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
var Drawer_1 = require("./Drawer");
var typescript_map_1 = require("typescript-map");
var socketIo = require("socket.io-client");
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var WIDTH = 500;
var HEIGHT = 500;
var socket = socketIo("127.0.0.1:2000");
function changeMap() {
    socket.emit('changeMap');
}
var playerModel = new Image();
playerModel.src = '../../client/img/player.png';
var maps = new typescript_map_1.TSMap();
maps.set('field', new Image());
maps.get('field').src = '../../client/img/map.png';
maps.set('forest', new Image());
maps.get('forest').src = '../../client/img/map2.png';
var canvas = document.getElementById('ctx');
var ctx = canvas.getContext("2d");
ctx.font = '30px Arial';
var canvasUi = document.getElementById('ctx-ui');
var ctxUi = canvasUi.getContext("2d");
ctxUi.font = '30px Arial';
window.addEventListener('resize', function () {
    var widthAndHeight = Drawer_1.Drawer.resizeCanvas(WIDTH, HEIGHT, canvas, canvasUi);
    WIDTH = widthAndHeight[0];
    HEIGHT = widthAndHeight[1];
});
var selfId;
socket.on('init', function (data) {
    if (data.selfId)
        selfId = data.selfId;
    for (var i = 0; i < data.players.length; i++)
        new Player_1.Player(data.players[i]);
});
socket.on('update', function (data) {
    for (var i = 0; i < data.players.length; i++) {
        var pack = data.players[i];
        var p = Player_1.Player.list[pack.id];
        if (p) {
            if (pack.x !== undefined)
                p.x = pack.x;
            if (pack.y !== undefined)
                p.y = pack.y;
            if (pack.hp !== undefined)
                p.hp = pack.hp;
            if (pack.score !== undefined)
                p.score = pack.score;
            if (pack.map != undefined)
                p.map = pack.map;
            if (pack.mouseAngle != undefined)
                p.mouseAngle = pack.mouseAngle;
        }
    }
});
socket.on('remove', function (data) {
    for (var i = 0; i < data.players.length; i++)
        delete Player_1.Player.list[data.players[i]];
});
setInterval(function () {
    if (selfId) {
        var player = Player_1.Player.list[selfId];
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        Drawer_1.Drawer.drawMap(player, ctx, WIDTH, HEIGHT, maps.get(player.map));
        Drawer_1.Drawer.drawScore(player, ctxUi);
        for (var i in Player_1.Player.list)
            Player_1.Player.list[i].draw(selfId, ctx, WIDTH, HEIGHT);
        if (!document.hasFocus())
            socket.emit("nofocus");
    }
}, 40);
document.onkeydown = function (event) {
    switch (event.keyCode) {
        case 68:
            socket.emit('keyPress', {
                inputId: 'right',
                state: true
            });
            break;
        case 83:
            socket.emit('keyPress', {
                inputId: 'down',
                state: true
            });
            break;
        case 65:
            socket.emit('keyPress', {
                inputId: 'left',
                state: true
            });
            break;
        case 87:
            socket.emit('keyPress', {
                inputId: 'up',
                state: true
            });
            break;
    }
};
document.onkeyup = function (event) {
    switch (event.keyCode) {
        case 68:
            socket.emit('keyPress', {
                inputId: 'right',
                state: false
            });
            break;
        case 83:
            socket.emit('keyPress', {
                inputId: 'down',
                state: false
            });
            break;
        case 65:
            socket.emit('keyPress', {
                inputId: 'left',
                state: false
            });
            break;
        case 87:
            socket.emit('keyPress', {
                inputId: 'up',
                state: false
            });
            break;
    }
};
document.onmousedown = function (event) {
    socket.emit('keyPress', {
        inputId: 'attack',
        state: true
    });
};
document.onmouseup = function (event) {
    socket.emit('keyPress', {
        inputId: 'attack',
        state: false
    });
};
document.onmousemove = function (event) {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    Player_1.Player.list[selfId].mouseAngle = Math.atan2(y, x) / Math.PI * 180;
    socket.emit('keyPress', {
        inputId: 'mouseAngle',
        state: Player_1.Player.list[selfId].mouseAngle,
    });
};
