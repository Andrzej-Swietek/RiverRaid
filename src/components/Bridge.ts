import {BoardElement} from "../Engine/BoardElement";
import Board, {RiverRow} from "./Board";
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
    riverRows: RiverRow[]
    rightSideWidth: number


    constructor(x: number, y: number, width: number, riverRows: RiverRow[]) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.openWidth = width;
        this.fullWidth = width * 2 + 100;
        this.width = this.fullWidth;
        this.height = 2*5+2*10+2;
        this.barImage = query<HTMLImageElement>`#barricade`
        this.riverRows = [...riverRows];
        this.openWidth = [...riverRows].slice(0,this.height).reduce( (acc:number,element: RiverRow)=> Math.max(acc, element.x) ,0)
        this.rightSideWidth = this.fullWidth-this.openWidth-this.riverRows[0].width;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        this.drawOneSide(ctx, x, y);
        if ( !this.open ) this.drawBarricade(ctx, x, y);
        let xEnd = this.riverRows.slice(0,this.height).reduce( (acc:number,element: RiverRow)=> Math.min(acc, element.x+element.width) ,9999)
        this.drawOneSide(ctx, xEnd, y);
    }
    drawBarricade(ctx: CanvasRenderingContext2D, x: number, y: number){
        ctx.fillStyle = "brown";
        ctx.fillRect(x+this.openWidth, y+17/2  ,x+600 - (x+this.openWidth) , 17);
        ctx.drawImage(this.barImage, x+this.openWidth, y+17/2  ,x+this.riverRows[0].width , 17)
    }
    drawOneSide(ctx: CanvasRenderingContext2D, x: number, y: number, side: 'left'|'right'='left'): void {
        let yellowHeight = 2;
        let lightgrayHeight = 10;
        let grayHeight = 5;
        let width = (side == 'left')? this.openWidth : this.rightSideWidth;
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y, width, grayHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight, width, lightgrayHeight);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight, width, yellowHeight);
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight, width, lightgrayHeight);
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, y+grayHeight+lightgrayHeight+yellowHeight+lightgrayHeight, width, grayHeight);
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
