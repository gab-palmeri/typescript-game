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

    constructor(param?:TSMap<string,any>)
    {
        this.spdX = 0;
        this.spdY = 0;

        if(param.has('x'))
            this.x = param.get('x');
        else
            this.x = 250;

        if(param.has('y'))
            this.y = param.get('y');
        else
            this.y = 250;

        if(param.has('map'))
            this.map = param.get('map');
        else
            this.map = 'forest';

        if(param.has('id'))
            this.id = param.get('id');
        else
            this.id = "";
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
