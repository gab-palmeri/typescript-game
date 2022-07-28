import { Entity } from "./Entity";
import { Player } from "./Player";
import { TSMap } from "typescript-map";
import { DataHandler } from "./DataHandler";

export class Bullet extends Entity
{
    public static list = new Array<Bullet>();

    angle:number;
    parent:string;
    timer:number;
    toRemove:boolean;

    constructor(x, y, angle, parent, map)
    {
        super("" + Math.random(), map, x, y);
        this.angle = angle;
        this.spdX = Math.cos(angle/180*Math.PI) * 10;
        this.spdY = Math.sin(angle/180*Math.PI) * 10;
        this.parent = parent
        this.timer = 0;
        this.toRemove = false;

        Bullet.list[this.id] = this;

        DataHandler.addToInitPack({
            id:this.id,
            x:this.x,
            y:this.y,
            map:this.map,
        }, 'bullets');
    }

    update():void
    {
        if(this.timer++ > 100)
            this.toRemove = true;

        super.update();

        for(var i in Player.list)
        {
            var player = Player.list[i];
            if(this.map == player.getMap() && this.getDistance(this.x, this.y, player.getX(), player.getY()) < 32 && this.parent != player.getId())
            {
                player.hp--;

                if(player.hp <=0)
                {
                    var shooter = Player.list[this.parent];
                    if(shooter)
                        shooter.score += 1;
                    player.hp = player.hpMax;
                    player.setX(Math.random() * 500);
                    player.setY(Math.random() * 500);
                }

                this.toRemove = true;
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
            map:this.map,
        });

        return initPack;
    }

    static update():void
    {

        for(let i in Bullet.list)
        {
            var bullet = Bullet.list[i];
            bullet.update();
            if(bullet.toRemove)
            {  
                delete Bullet.list[i];
                DataHandler.addToRemovePack(bullet.id, "bullets");
            }
            else 
            {   
                DataHandler.addToUpdatePack({
                    id:bullet.id,
                    x:bullet.x,
                    y:bullet.y,
                }, 'bullets');
            }
        }
    }

}
