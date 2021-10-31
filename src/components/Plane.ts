import {Directions} from "../Directions";

export class Plane {
    public x: number;
    public y: number;
    public readonly FACTOR: number = 2;
    private readonly planeImg;

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

        console.log( direction , this.x );
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number){
        if (x)
            ctx.drawImage(this.planeImg, x, y, 25, 10)
        else
            ctx.drawImage(this.planeImg, this.x, y, 25, 10)
    }
}
