import { TSMap } from "typescript-map";

export class Entity
{
    public static initPack = new TSMap<string, Array<TSMap<string,any>>>();
    public static updatePack = new TSMap<string, Array<TSMap<string,any>>>();
    public static removePack = new TSMap<string, Array<string>>();

    protected x:number;
    protected y:number;
    protected spdX:number;
    protected spdY:number;
    protected id:string;
    protected map:string;

    constructor(id = "", map = 'forest', x = null, y = null)
    {
        this.spdX = 0;
        this.spdY = 0;


        if(x == undefined)
            this.x = ((min, max) => Math.floor(Math.random() * (max - min)) + min)(0,500);
        else
            this.x = x;

        if(y == undefined)
            this.y = ((min, max) => Math.floor(Math.random() * (max - min)) + min)(0,500);
        else
            this.y = y;

        this.map = map;
        this.id = id;

    }

    update():void
    {
        //this.updateSpd();
        this.x += this.spdX;
        this.y += this.spdY;
    }

    updateSpd():void
    {
        this.x += this.spdX;
        this.y += this.spdY;
    }

    getDistance(x1:number, y1:number, x2:number, y2:number):number
    {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    getX():number
    {
        return this.x;
    }

    getY():number
    {
        return this.y;
    }

    getId():string
    {
        return this.id;
    }

    getMap():string
    {
        return this.map;
    }

    setX(x:number)
    {
        this.x = x;
    }

    setY(y:number)
    {
        this.y = y;
    }
}
