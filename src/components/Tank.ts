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
        this.image = document.querySelector('#cruiser');
        this.width = 70;
        this.height = 12;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number): void{
        if (x)
            ctx.drawImage(this.image, x, y, this.width, this.height)
        else
            ctx.drawImage(this.image, this.x, y, this.width, this.height)
    }

    update(): void {
        this.y += Board.riverSpeed
        this.x = this.x - 2
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }
}
