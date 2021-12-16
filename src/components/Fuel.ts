import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class Fuel extends BoardElement{
    protected readonly height: number;
    protected readonly width: number;
    x: number;
    y: number;
    private readonly image: HTMLImageElement;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#fuel');
        this.width = 20;
        this.height = 20;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.drawImage(this.image, x, y, this.width, this.height);
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }

    update(): void {
        this.y += Board.riverSpeed
    }

}
