"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_map_1 = require("typescript-map");
var Entity = (function () {
    function Entity(param) {
        this.spdX = 0;
        this.spdY = 0;
        if (param.has('x'))
            this.x = param.get('x');
        else
            this.x = 250;
        if (param.has('y'))
            this.y = param.get('y');
        else
            this.y = 250;
        if (param.has('map'))
            this.map = param.get('map');
        else
            this.map = 'forest';
        if (param.has('id'))
            this.id = param.get('id');
        else
            this.id = "";
    }
    Entity.prototype.update = function () {
        this.x += this.spdX;
        this.y += this.spdY;
    };
    Entity.prototype.updateSpd = function () {
        this.x += this.spdX;
        this.y += this.spdY;
    };
    Entity.prototype.getDistance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };
    Entity.prototype.getX = function () {
        return this.x;
    };
    Entity.prototype.getY = function () {
        return this.y;
    };
    Entity.prototype.getId = function () {
        return this.id;
    };
    Entity.prototype.getMap = function () {
        return this.map;
    };
    Entity.prototype.setX = function (x) {
        this.x = x;
    };
    Entity.prototype.setY = function (y) {
        this.y = y;
    };
    Entity.initPack = new typescript_map_1.TSMap();
    Entity.updatePack = new typescript_map_1.TSMap();
    Entity.removePack = new typescript_map_1.TSMap();
    return Entity;
}());
exports.Entity = Entity;
