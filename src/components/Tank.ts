import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class Tank extends BoardElement{
    public x: number;
    public y: number;
    protected readonly width: number;
    protected readonly height: number;
    private readonly image;
    // private direction: string = 'left';
    constructor(x: number,y: number) {
        super();
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#tank');
        this.width = 40;
        this.height = 8;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number): void{
        if ( x < 500 ) {
            ctx.translate(x + this.width/2, y + this.width/2);
            ctx.scale(-1, 1);
            ctx.translate(-(x + this.width/2), -(y + this.width/2));
        }
        if (x)
            ctx.drawImage(this.image, x, y, this.width, this.height)
        else
            ctx.drawImage(this.image, this.x, y, this.width, this.height)

        if ( x < 500 ) {
            ctx.translate(x + this.width/2, y + this.width/2);
            ctx.scale(-1, 1);
            ctx.translate(-(x + this.width/2), -(y + this.width/2));
        }
    }

    update(): void {
        this.y += Board.riverSpeed
        // this.x = this.x - 2
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }
}
