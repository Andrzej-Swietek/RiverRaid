import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";

export default class Helikopter extends BoardElement {
    protected readonly height: number;
    protected readonly width: number;
    private readonly image;
    x: number;
    y: number;
    private direction: string = 'left';

    constructor(x: number,y: number) {
        super();
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#helicopter');
        this.width = 35;
        this.height = 15;
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        // ctx.fillStyle = "green"
        // ctx.fillRect(x,y, this.width, this.height)
        if (x)
            ctx.drawImage(this.image, x, y, this.width, this.height)
        else
            ctx.drawImage(this.image, this.x, y, this.width, this.height)
    }

    getSize(): { w: number; h: number } {
        return {h: this.height, w: this.width};
    }

    update(): void {
        this.y += Board.riverSpeed;
        let dirCoefficient = ( this.direction == 'left' )? -1 : 1
        this.x = this.x + 2*dirCoefficient;
    }

    changeDirection() {
        if ( this.direction == 'left' ) this.direction = 'right';
        else this.direction = 'left';
    }

}
