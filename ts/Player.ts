import { Entity } from "./Entity";
import { TSMap } from "typescript-map";
import * as socketIo from "socket.io";
import { DataHandler } from "./DataHandler";
import { Bullet } from "./Bullet";

export class Player extends Entity
{
    public static list = new Array<Player>();
    public static width:number = 50;

    pressingRight:boolean;
    pressingLeft:boolean;
    pressingUp:boolean;
    pressingDown:boolean;
    pressingAttack:boolean;
    mouseAngle:number;
    maxSpd:number;
    hp:number;
    hpMax:number;
    score:number;
    downed:boolean;

    constructor(id, map)
    {
        super(id, map);
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;
        this.maxSpd = 10;
        this.hp = 10;
        this.hpMax = 10;
        this.score = 0;
        this.downed = false;

        DataHandler.addToInitPack({
            id:this.id,
            x:this.x,
            y:this.y,
            hp: this.hp,
            hpMax: this.hpMax,
            score:this.score,
            map:this.map,
            mouseAngle:this.mouseAngle,
            width:Player.width,
        }, 'players');

        Player.list[this.id] = this;

    }

    update():void
    {
        this.updateSpd();
        super.update();
        if(this.pressingAttack)
        {
            this.attack();
        }
    }

    updateSpd():void
    {
        if(this.pressingRight && !this.checkCollision(this.x + this.maxSpd, this.y))
        {
            this.spdX = this.maxSpd;
        }
        else if(this.pressingLeft && !this.checkCollision(this.x - this.maxSpd, this.y))
        {
            this.spdX = - this.maxSpd;
        }
        else
            this.spdX = 0;

        if(this.pressingUp && !this.checkCollision(this.x, this.y - this.maxSpd))
        {
            this.spdY = - this.maxSpd;
        }
        else if(this.pressingDown && !this.checkCollision(this.x, this.y + this.maxSpd))
        {
            this.spdY = this.maxSpd;
        }
        else
            this.spdY = 0;
    }

    checkCollision(x:number, y:number):boolean
    {
        for(let i in Player.list)
        {
            var p = Player.list[i];
            if(p != this && p.map == this.map)
            {
                if(this.x + Player.width / 2 >= p.x - Player.width / 2 && this.x - Player.width / 2 <= p.x + Player.width / 2)
                    if(this.y + Player.width / 2 >= p.y - Player.width / 2 && this.y - Player.width / 2 <= p.y + Player.width / 2)
                        if(this.getDistance(x, y, p.x, p.y) < Player.width)
                            return true;
            }
        }

        return false;
    }

    attack():void
    {
        new Bullet(this.x, this.y, this.mouseAngle, this.id, this.map);
    }

    clearInputs():void
    {
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingLeft = false;
        this.pressingRight = false;
        this.pressingAttack = false;
    }

    //STATIC METHODS

    static onConnect(socket:socketIo.Socket):void
    {
        var map = 'forest';

        if(Math.random() < 0.5)
            map = 'field';

        var player = new Player(socket.id, map);

        socket.on('keyPress', function(data){
            if(data.inputId == 'left')
                player.pressingLeft = data.state;
            else if(data.inputId == 'right')
                player.pressingRight = data.state;
            else if(data.inputId == 'up')
                player.pressingUp = data.state;
            else if(data.inputId == 'down')
                player.pressingDown = data.state;
            else if(data.inputId == 'attack')
                player.pressingAttack = data.state;
            else if(data.inputId == 'mouseAngle')
                player.mouseAngle = data.state;

        });

        socket.emit('init', {
            selfId:socket.id,
            players:Player.getOnlinePlayers(),
        });

        socket.on('changeMap', function(data){
            if(player.map === 'field')
                player.map = 'forest';
            else
                player.map = 'field';
        })
    }

    static onDisconnect(socket:socketIo.Socket):void
    {
        delete Player.list[socket.id];
        DataHandler.addToRemovePack(socket.id, "players");
    }
    

    static update():void
    {
        for(let i in Player.list)
        {
            var player = Player.list[i];
            player.update();

            DataHandler.addToUpdatePack({
                id:player.id,
                x:player.x,
                y:player.y,
                hp: player.hp,
                score:player.score,
                map:player.map,
                mouseAngle:player.mouseAngle,
            }, 'players');
        }
    }

    static getOnlinePlayers() {
        var players = new Array<TSMap<string,any>>();

        for(var i in Player.list)
        {
            var player = Player.list[i];

            players.push(new TSMap<string,any>().fromJSON({
                id:player.id,
                x:player.x,
                y:player.y,
                hp:player.hp,
                hpMax:player.hpMax,
                score:player.score,
                map:player.map,
                mouseAngle:player.mouseAngle,
                width:Player.width,
            }));
        }

        return players;
    }

}
