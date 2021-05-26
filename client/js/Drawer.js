"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Drawer = (function () {
    function Drawer() {
    }
    Drawer.drawMap = function (player, ctx, WIDTH, HEIGHT, map) {
        var x = WIDTH / 2 - player.x;
        var y = HEIGHT / 2 - player.y;
        ctx.drawImage(map, x, y);
    };
    Drawer.drawScore = function (player, ctxUi) {
        if (Drawer.lastScore != player.score) {
            Drawer.lastScore = player.score;
            ctxUi.clearRect(0, 0, 500, 500);
            ctxUi.fillStyle = 'white';
            ctxUi.fillText(player.score.toString(), 0, 30);
        }
    };
    Drawer.resizeCanvas = function (WIDTH, HEIGHT, canvas, canvasUi) {
        WIDTH = window.innerWidth - 4;
        HEIGHT = window.innerHeight - 4;
        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        canvasUi.height = HEIGHT;
        canvasUi.width = WIDTH;
        var widthAndHeight = new Array();
        widthAndHeight.push(WIDTH, HEIGHT);
        return widthAndHeight;
    };
    return Drawer;
}());
exports.Drawer = Drawer;
