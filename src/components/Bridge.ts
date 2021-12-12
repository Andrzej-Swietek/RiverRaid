import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class Bridge extends BoardElement{
    protected readonly height: number;
    protected readonly width: number;
    x: number;
    y: number;
    open: boolean = false;

    constructor(x: number, y: number, width: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 15;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.drawOneSide(ctx, x, y);
        if ( !this.open ) this.drawBarricade(ctx, x, y)
        this.drawOneSide(ctx, x+600, y);
    }
    drawBarricade(ctx: CanvasRenderingContext2D, x: number, y: number){
        ctx.fillStyle = "brown"
        ctx.fillRect(x+this.width, y+17/2  ,x+600 - (x+this.width) , 17);
    }
    drawOneSide(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        let yellowHeight = 2;
        let lightgrayHeight = 10;
        let grayHeight = 5;
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, this.width, grayHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight, this.width, lightgrayHeight);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight, this.width, yellowHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight, this.width, lightgrayHeight);
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight+lightgrayHeight, this.width, grayHeight);
    }

    update(): void {
        this.y += Board.riverSpeed
    }
    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }

}
