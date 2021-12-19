import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class EnemyPlane extends BoardElement{
    protected readonly height: number;
    protected readonly width: number;
    x: number;
    y: number;
    private readonly image: HTMLImageElement;
    private readonly imageR: HTMLImageElement;
    private direction: string = 'left';
    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#enemyPlane');
        this.imageR = document.querySelector('#enemyPlane-r');
        this.width = 50;
        this.height = 15;
    }
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.drawImage((this.direction == "left")? this.image : this.imageR, x, y, this.width, this.height)
    }

    update(): void {
        this.y += Board.riverSpeed
        let dirCoefficient = ( this.direction == 'left' )? -1 : 1
        this.x = this.x + 2*dirCoefficient;
    }

    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }

    changeDirection() {
        if ( this.direction == 'left' ) this.direction = 'right';
        else this.direction = 'left';
        // this.image.src = ( this.direction == 'left' )? "src/assets/imgs/enemyPlane.png" : "src/assets/imgs/enemyPlane-rev.png"
    }
}
