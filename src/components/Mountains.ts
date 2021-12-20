import {BoardElement} from "../Engine/BoardElement";
import Board from "./Board";
import {randomNumber} from "../utils/random";
import {query} from "../Engine/Query";

export default class Mountains extends BoardElement{
    protected readonly height: number = 30;
    protected readonly width: number = 80;
    x: number;
    y: number;
    style: boolean = randomNumber(0,10)%2==0;
    img1 = query<HTMLImageElement>`#mountains1`
    img2 = query<HTMLImageElement>`#mountains2`

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    draw(ctx: CanvasRenderingContext2D, x: number=this.x, y: number=this.y): void {
       ctx.drawImage( (this.style)? this.img1 : this.img2, x, y, this.width, this.height )
    }

    getSize(): { w: number; h: number } {
        return {h: this.height, w: this.width};
    }

    update(): void {
        this.y += Board.riverSpeed
    }

}
