import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";
import {query} from "../Engine/Query";

export default class Bridge extends BoardElement{
    protected readonly height: number;
    protected width: number;
    x: number;
    y: number;
    open: boolean = false;
    fullWidth: number;
    openWidth: number;
    barImage: HTMLImageElement;

    constructor(x: number, y: number, width: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.openWidth = width;
        this.fullWidth = width * 2 + 100;
        this.width = this.fullWidth;
        this.height = 2*5+2*10+2;
        this.barImage = query<HTMLImageElement>`#barricade`
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.drawOneSide(ctx, x, y);
        if ( !this.open ) this.drawBarricade(ctx, x, y);
        this.drawOneSide(ctx, x+600, y);
    }
    drawBarricade(ctx: CanvasRenderingContext2D, x: number, y: number){
        ctx.fillStyle = "brown";
        ctx.fillRect(x+this.openWidth, y+17/2  ,x+600 - (x+this.openWidth) , 17);
        ctx.drawImage(this.barImage, x+this.openWidth, y+17/2  ,x+600 - (x+this.openWidth) , 17)
    }
    drawOneSide(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        let yellowHeight = 2;
        let lightgrayHeight = 10;
        let grayHeight = 5;
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, this.openWidth, grayHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight, this.openWidth, lightgrayHeight);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight, this.openWidth, yellowHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight, this.openWidth, lightgrayHeight);
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight+lightgrayHeight, this.openWidth, grayHeight);
    }

    update(): void {
        this.y += Board.riverSpeed;
    }
    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }

    boltCollisionHandle() {
        this.open = true
        this.width = this.openWidth;
    }

}
