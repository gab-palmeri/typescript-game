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
var Player_1 = require("./Player");
var typescript_map_1 = require("typescript-map");
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(param) {
        var _this = _super.call(this, param) || this;
        _this.id = "" + Math.random();
        _this.angle = param.get('angle');
        _this.spdX = Math.cos(param.get('angle') / 180 * Math.PI) * 10;
        _this.spdY = Math.sin(param.get('angle') / 180 * Math.PI) * 10;
        _this.parent = param.get('parent');
        _this.timer = 0;
        _this.toRemove = false;
        Bullet.list[_this.id] = _this;
        return _this;
    }
    Bullet.prototype.update = function () {
        if (this.timer++ > 100)
            this.toRemove = true;
        _super.prototype.update.call(this);
        for (var i in Player_1.Player.list) {
            var player = Player_1.Player.list[i];
            if (this.map == player.getMap() && this.getDistance(this.x, this.y, player.getX(), player.getY()) < 32 && this.parent != player.getId()) {
                player.hp--;
                if (player.hp <= 0) {
                    var shooter = Player_1.Player.list[this.parent];
                    if (shooter)
                        shooter.score += 1;
                    player.hp = player.hpMax;
                    player.setX(Math.random() * 500);
                    player.setY(Math.random() * 500);
                }
                this.toRemove = true;
            }
        }
    };
    Bullet.prototype.getInitPack = function () {
        var initPack = new typescript_map_1.TSMap();
        initPack.fromJSON({
            id: this.id,
            x: this.x,
            y: this.y,
            map: this.map,
        });
        return initPack;
    };
    Bullet.prototype.getUpdatePack = function () {
        var updatePack;
        updatePack.fromJSON({
            id: this.id,
            x: this.x,
            y: this.y,
        });
        return updatePack;
    };
    Bullet.update = function () {
        var pack;
        for (var i in Bullet.list) {
            var bullet = Bullet.list[i];
            if (bullet.toRemove) {
                delete Bullet.list[i];
            }
            else {
                bullet.update();
                pack.push(bullet.getUpdatePack());
            }
        }
        return pack;
    };
    Bullet.getAllInitPack = function () {
        var bullets;
        for (var i in Bullet.list)
            bullets.push(Bullet.list[i]);
        return bullets;
    };
    return Bullet;
}(Entity_1.Entity));
exports.Bullet = Bullet;
