import {BoardElement} from "../Engine/BoardElement";
import {query} from "../Engine/Query";
import Board from "./Board";

export default class Island extends BoardElement{
    protected readonly height: number;
    protected readonly width: number;
    public x: number;
    public y: number;
    private img: HTMLImageElement;

    constructor(x:number, y:number, w: number, h: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.img = query<HTMLImageElement>`#island`
    }

    draw(ctx: CanvasRenderingContext2D, x: number=this.x, y: number=this.y): void {
        // ctx.fillStyle = "green"
        // ctx.fillRect(x, y, this.width, this.height)
        ctx.drawImage(this.img, x, y, this.width, this.height)
    }

    getSize(): { w: number; h: number } {
        return {h: this.height, w: this.width};
    }

    update(): void {
        this.y += Board.riverSpeed;
    }

}
