import { Entity } from "./Entity";
import { TSMap } from "typescript-map";
import * as socketIo from "socket.io";

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

    constructor(param?:TSMap<string,any>)
    {
        super(param);
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

        if(!Entity.initPack.has('players'))
            Entity.initPack.set('players', new Array<TSMap<string,any>>());
        if(!Entity.updatePack.has('players'))
            Entity.updatePack.set('players', new Array<TSMap<string,any>>());
        if(!Entity.removePack.has('players'))
            Entity.removePack.set('players', new Array<string>());

        Entity.initPack.get('players').push(this.getInitPack());

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
        for(let i in Player.list)
        {
            if(Player.list[i] != this && Player.list[i].map == this.map)
            {
                var player = Player.list[i];
                var angleOfPoints = Math.atan2(player.y - this.y, player.x - this.x) * 180 / Math.PI;

                /*console.log("angle of points");
                console.log(angleOfPoints);
                console.log("mouse angle");
                console.log(this.mouseAngle);*/

                if(Math.abs(this.mouseAngle) >= Math.abs(angleOfPoints) - Player.width / 2 && Math.abs(this.mouseAngle) <= Math.abs(angleOfPoints) + Player.width / 2)
                {
                    if(this.getDistance(this.x, this.y, player.x, player.y) <= Player.width)
                    {
                        console.log("test");
                        player.hp--;

                        if(player.hp <=0)
                        {
                            if(this)
                                this.score += 1;
                            player.hp = player.hpMax;
                            player.x = Math.random() * 500;
                            player.y = Math.random() * 500;
                        }
                        this.pressingAttack = false;
                        //player.downed = true;
                    }
                }

            }
        }
    }

    getInitPack():TSMap<string,any>
    {

        var initPack = new TSMap<string,any>()
        initPack.fromJSON({
            id:this.id,
            x:this.x,
            y:this.y,
            hp: this.hp,
            hpMax: this.hpMax,
            score:this.score,
            map:this.map,
            mouseAngle:this.mouseAngle,
            width:Player.width,
        });



        return initPack;
    }

    getUpdatePack():TSMap<string,any>
    {

        var updatePack = new TSMap<string,any>();
        updatePack.fromJSON({
            id:this.id,
            x:this.x,
            y:this.y,
            hp: this.hp,
            score:this.score,
            map:this.map,
            mouseAngle:this.mouseAngle,
        });

        return updatePack;
    }

    clearInputs():void
    {
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingLeft = false;
        this.pressingRight = false;
        this.pressingAttack = false;
    }

    static onConnect(socket:socketIo.Socket):void
    {
        var map = 'forest';

        if(Math.random() < 0.5)
            map = 'field';

        var player = new Player(new TSMap<string, any>().fromJSON({
            id:socket.id,
            map:map,
        }));

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
            players:Player.getAllInitPack(),
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
        Entity.removePack.get('players').push(socket.id);
    }

    static getAllInitPack():Array<TSMap<string,any>>
    {
        var players = new Array<TSMap<string,any>>();

        /*for(var i in Player.list)
            players.push(Player.list[i]);*/

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

    static clearPacks()
    {
        Entity.initPack.set('players', new Array<TSMap<string,any>>());
        Entity.updatePack.set('players', new Array<TSMap<string,any>>());
        Entity.removePack.set('players', new Array<string>());
    }

    static update():void
    {
        for(let i in Player.list)
        {
            var player = Player.list[i];
            player.update();
            this.updatePack.get('players').push(player.getUpdatePack());
        }
    }

}
