import { Player } from "./Player";

export class Drawer
{
    static lastScore:number;

    static drawMap(player:Player, ctx:CanvasRenderingContext2D, WIDTH:number, HEIGHT:number, map:HTMLImageElement):void
    {
        var x:number = WIDTH/2 - player.x;
        var y:number = HEIGHT/2 - player.y;
        ctx.drawImage(map,x,y);
    }

    static drawScore(player:Player, ctxUi:CanvasRenderingContext2D):void
    {
        if(Drawer.lastScore != player.score)
        {
            Drawer.lastScore = player.score;
            ctxUi.clearRect(0,0,500,500);
            ctxUi.fillStyle = 'white';
            ctxUi.fillText(player.score.toString(),0,30);
        }
    }

    static resizeCanvas(WIDTH:number, HEIGHT:number, canvas:HTMLCanvasElement, canvasUi:HTMLCanvasElement):Array<number>
    {
        WIDTH = window.innerWidth - 4;
        HEIGHT = window.innerHeight - 4;
        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        canvasUi.height = HEIGHT;
        canvasUi.width = WIDTH;

        var widthAndHeight = new Array<number>();
        widthAndHeight.push(WIDTH,HEIGHT);
        return widthAndHeight;
    }
}
