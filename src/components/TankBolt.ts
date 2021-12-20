import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export class TankBolt extends BoardElement{
    protected readonly height: number = 3;
    protected readonly width: number = 7;
    x: number;
    y: number;
    private readonly speed: number;
    private readonly direction: 'left'|'right';
    xSpeed: number;
    ySpeed: number;
    acceleration :number

    constructor(x:number, y: number, direction: 'left'|'right') {
        super();
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 2;

    }
    draw(ctx: CanvasRenderingContext2D, x: number=this.x, y: number=this.y): void {
        // ctx.ellipse(x,y, this.width, this.height, )
        ctx.fillStyle = 'orange';
        ctx.fillRect(x,y,this.width,this.height);
    }

    getSize(): { w: number; h: number } {
        return {h: this.height, w: this.width};
    }

    update(): void {
        this.x += (( this.direction == 'left' )? -1 : 1 ) * this.speed;
        this.y += Board.riverSpeed;
    }

}
