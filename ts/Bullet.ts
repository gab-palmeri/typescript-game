import { Entity } from "./Entity";
import { Player } from "./Player";
import { TSMap } from "typescript-map";

export class Bullet extends Entity
{
    static list:Bullet[];

    angle:number;
    parent:string;
    timer:number;
    toRemove:boolean;

    constructor(param?:TSMap<string,any>)
    {
        super(param);
        this.id = "" + Math.random();
        this.angle = param.get('angle');
        this.spdX = Math.cos(param.get('angle')/180*Math.PI) * 10;
        this.spdY = Math.sin(param.get('angle')/180*Math.PI) * 10;
        this.parent = param.get('parent');
        this.timer = 0;
        this.toRemove = false;

        Bullet.list[this.id] = this;
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

    getUpdatePack():TSMap<string,any>
    {
        var updatePack:TSMap<string,any>;
        updatePack.fromJSON({
            id:this.id,
            x:this.x,
            y:this.y,
        });

        return updatePack;
    }

    static update():Array<TSMap<string,any>>
    {
        var pack:Array<TSMap<string,any>>;
        for(var i in Bullet.list)
        {
            var bullet = Bullet.list[i];
            if(bullet.toRemove)
            {
                delete Bullet.list[i];
                //removePack.bullet.push(bullet.id);
            }
            else
            {
                bullet.update();
                pack.push(bullet.getUpdatePack());
            }
        }

        return pack;
    }

    static getAllInitPack():Array<Bullet>
    {
        var bullets:Array<Bullet>;

        for(var i in Bullet.list)
            bullets.push(Bullet.list[i]);
        return bullets;
    }

}
