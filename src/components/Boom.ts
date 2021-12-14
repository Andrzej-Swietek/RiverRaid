import {BoardElement} from "../Engine/BoardElement";

export default class Boom extends BoardElement{
    protected readonly height: number = 10;
    protected readonly width: number = 10;
    x: number;
    y: number;
    constructor() {
        super();
    }


    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillRect( x, y, this.width, this.height );
    }

    getSize(): { w: number; h: number } {
        return {h: 0, w: 0};
    }

    update(): void {
    }
}
