"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var path = require("path");
var ExpressInit = (function () {
    function ExpressInit() {
        this.exp = express();
        this.server = new http.Server(this.exp);
        this.mountRoutes();
    }
    ExpressInit.prototype.mountRoutes = function () {
        this.exp.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, '../client', 'index.html'));
        });
        this.exp.use('/client', express.static(path.join(__dirname, '../client')));
        this.server.listen(process.env.PORT || 2000);
    };
    return ExpressInit;
}());
exports.default = new ExpressInit().server;
