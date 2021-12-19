import { Directions } from "../Directions";

export class Plane {
    public x: number;
    public y: number;
    public readonly width: number = 25;
    public readonly height: number = 10;
    public readonly FACTOR: number = 2;
    private readonly planeImg;
    // private moveDir: Directions;

    constructor( x: number, y: number ) {
        this.x = x;
        this.y = y;
        this.planeImg = document.querySelector('#plane');
    }
   public move( direction: Directions ){

        if ( direction == Directions.LEFT )
            this.x-= this.FACTOR;
        else
            this.x+= this.FACTOR;

        // console.log( direction , this.x );
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number){
        // ctx.fillStyle = "purple"
        // ctx.fillRect(this.x,this.y, this.width, this.height)
        if (x)
            ctx.drawImage(this.planeImg, x, y, this.width, this.height)
        else
            ctx.drawImage(this.planeImg, this.x, y, this.width, this.height)
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }
}
