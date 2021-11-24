import {BoardElement} from "../Engine/BoardElement";

export default class Cruiser extends BoardElement{
    public x: number;
    public y: number;
    protected readonly width: number;
    protected readonly height: number;
    private readonly image;
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
}
