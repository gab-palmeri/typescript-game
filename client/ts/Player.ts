import { TSMap } from "typescript-map";
import * as socketIo from "socket.io-client";

export class Player
{
    static list = new Array<Player>();

    id:number;
    x:number;
    y:number;
    hp:number;
    hpMax:number;
    score:number;
    map:string;
    mouseAngle:number;
    width:number;

    constructor(initPack:any)
    {
        var params:TSMap<string,any> = new TSMap<string,any>();
        params.fromJSON(initPack);

        this.id = params.get('id');
        this.x = params.get('x');
        this.y = params.get('y');
        this.hp = params.get('hp');
        this.hpMax = params.get('hpMax');
        this.score = params.get('score');
        this.map = params.get('map');
        this.mouseAngle = params.get('mouseAngle');
        this.width = params.get('width');

        Player.list[this.id] = this;
    }

    draw(selfId:number, ctx:CanvasRenderingContext2D, WIDTH:number, HEIGHT:number):void
    {
        if(Player.list[selfId].map == this.map)
        {
            var x = this.x - Player.list[selfId].x + WIDTH/2;
            var y = this.y - Player.list[selfId].y + HEIGHT/2;

            var hpWidth = 30 * this.hp / this.hpMax;
            ctx.fillStyle = 'red';
            ctx.fillRect(x - hpWidth/2, y - 40, hpWidth, 4);
            var width = 50;
            var height = 55;

            ctx.save();
            ctx.translate(x,y);
            ctx.rotate(this.mouseAngle * Math.PI/180);
            ctx.translate(-x,-y);
            ctx.beginPath();
            ctx.arc(x,y,this.width / 2, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffcd94";
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
}
