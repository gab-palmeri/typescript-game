"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Entity_1 = require("./Entity");
var typescript_map_1 = require("typescript-map");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(param) {
        var _this = _super.call(this, param) || this;
        _this.pressingRight = false;
        _this.pressingLeft = false;
        _this.pressingUp = false;
        _this.pressingDown = false;
        _this.pressingAttack = false;
        _this.mouseAngle = 0;
        _this.maxSpd = 10;
        _this.hp = 10;
        _this.hpMax = 10;
        _this.score = 0;
        _this.downed = false;
        if (!Entity_1.Entity.initPack.has('players'))
            Entity_1.Entity.initPack.set('players', new Array());
        if (!Entity_1.Entity.updatePack.has('players'))
            Entity_1.Entity.updatePack.set('players', new Array());
        if (!Entity_1.Entity.removePack.has('players'))
            Entity_1.Entity.removePack.set('players', new Array());
        Entity_1.Entity.initPack.get('players').push(_this.getInitPack());
        Player.list[_this.id] = _this;
        return _this;
    }
    Player.prototype.update = function () {
        this.updateSpd();
        _super.prototype.update.call(this);
        if (this.pressingAttack) {
            this.attack();
        }
    };
    Player.prototype.updateSpd = function () {
        if (this.pressingRight && !this.checkCollision(this.x + this.maxSpd, this.y)) {
            this.spdX = this.maxSpd;
        }
        else if (this.pressingLeft && !this.checkCollision(this.x - this.maxSpd, this.y)) {
            this.spdX = -this.maxSpd;
        }
        else
            this.spdX = 0;
        if (this.pressingUp && !this.checkCollision(this.x, this.y - this.maxSpd)) {
            this.spdY = -this.maxSpd;
        }
        else if (this.pressingDown && !this.checkCollision(this.x, this.y + this.maxSpd)) {
            this.spdY = this.maxSpd;
        }
        else
            this.spdY = 0;
    };
    Player.prototype.checkCollision = function (x, y) {
        for (var i in Player.list) {
            var p = Player.list[i];
            if (p != this && p.map == this.map) {
                if (this.x + Player.width / 2 >= p.x - Player.width / 2 && this.x - Player.width / 2 <= p.x + Player.width / 2)
                    if (this.y + Player.width / 2 >= p.y - Player.width / 2 && this.y - Player.width / 2 <= p.y + Player.width / 2)
                        if (this.getDistance(x, y, p.x, p.y) < Player.width)
                            return true;
            }
        }
        return false;
    };
    Player.prototype.attack = function () {
        for (var i in Player.list) {
            if (Player.list[i] != this && Player.list[i].map == this.map) {
                var player = Player.list[i];
                var angleOfPoints = Math.atan2(player.y - this.y, player.x - this.x) * 180 / Math.PI;
                if (Math.abs(this.mouseAngle) >= Math.abs(angleOfPoints) - Player.width / 2 && Math.abs(this.mouseAngle) <= Math.abs(angleOfPoints) + Player.width / 2) {
                    if (this.getDistance(this.x, this.y, player.x, player.y) <= Player.width) {
                        console.log("test");
                        player.hp--;
                        if (player.hp <= 0) {
                            if (this)
                                this.score += 1;
                            player.hp = player.hpMax;
                            player.x = Math.random() * 500;
                            player.y = Math.random() * 500;
                        }
                        this.pressingAttack = false;
                    }
                }
            }
        }
    };
    Player.prototype.getInitPack = function () {
        var initPack = new typescript_map_1.TSMap();
        initPack.fromJSON({
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp,
            hpMax: this.hpMax,
            score: this.score,
            map: this.map,
            mouseAngle: this.mouseAngle,
            width: Player.width,
        });
        return initPack;
    };
    Player.prototype.getUpdatePack = function () {
        var updatePack = new typescript_map_1.TSMap();
        updatePack.fromJSON({
            id: this.id,
            x: this.x,
            y: this.y,
            hp: this.hp,
            score: this.score,
            map: this.map,
            mouseAngle: this.mouseAngle,
        });
        return updatePack;
    };
    Player.prototype.clearInputs = function () {
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingLeft = false;
        this.pressingRight = false;
        this.pressingAttack = false;
    };
    Player.onConnect = function (socket) {
        var map = 'forest';
        if (Math.random() < 0.5)
            map = 'field';
        var player = new Player(new typescript_map_1.TSMap().fromJSON({
            id: socket.id,
            map: map,
        }));
        socket.on('keyPress', function (data) {
            if (data.inputId == 'left')
                player.pressingLeft = data.state;
            else if (data.inputId == 'right')
                player.pressingRight = data.state;
            else if (data.inputId == 'up')
                player.pressingUp = data.state;
            else if (data.inputId == 'down')
                player.pressingDown = data.state;
            else if (data.inputId == 'attack')
                player.pressingAttack = data.state;
            else if (data.inputId == 'mouseAngle')
                player.mouseAngle = data.state;
        });
        socket.emit('init', {
            selfId: socket.id,
            players: Player.getAllInitPack(),
        });
        socket.on('changeMap', function (data) {
            if (player.map === 'field')
                player.map = 'forest';
            else
                player.map = 'field';
        });
    };
    Player.onDisconnect = function (socket) {
        delete Player.list[socket.id];
        Entity_1.Entity.removePack.get('players').push(socket.id);
    };
    Player.getAllInitPack = function () {
        var players = new Array();
        for (var i in Player.list) {
            var player = Player.list[i];
            players.push(new typescript_map_1.TSMap().fromJSON({
                id: player.id,
                x: player.x,
                y: player.y,
                hp: player.hp,
                hpMax: player.hpMax,
                score: player.score,
                map: player.map,
                mouseAngle: player.mouseAngle,
                width: Player.width,
            }));
        }
        return players;
    };
    Player.clearPacks = function () {
        Entity_1.Entity.initPack.set('players', new Array());
        Entity_1.Entity.updatePack.set('players', new Array());
        Entity_1.Entity.removePack.set('players', new Array());
    };
    Player.update = function () {
        for (var i in Player.list) {
            var player = Player.list[i];
            player.update();
            this.updatePack.get('players').push(player.getUpdatePack());
        }
    };
    Player.list = new Array();
    Player.width = 50;
    return Player;
}(Entity_1.Entity));
exports.Player = Player;
