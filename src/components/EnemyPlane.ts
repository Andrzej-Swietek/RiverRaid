import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class EnemyPlane extends BoardElement{
    protected readonly height: number;
    protected readonly width: number;
    x: number;
    y: number;
    private readonly image: HTMLImageElement;
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#enemyPlane');
        this.width = 50;
        this.height = 15;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.drawImage(this.image, x, y, this.width, this.height)
    }

    update(): void {
        this.y += Board.riverSpeed
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }

}
