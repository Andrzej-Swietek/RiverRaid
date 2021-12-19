import {BoardElement} from "../Engine/BoardElement";
import {query} from "../Engine/Query";

export default class Boom extends BoardElement{
    protected readonly height: number = 20/16*8;
    protected readonly width: number = 43;
    private currentH: number = 0;
    private currentW: number = 0;
    x: number;
    y: number;
    img: HTMLImageElement;
    show: boolean  = true;
    constructor(x : number,y : number) {
        super();
        this.x = x;
        this.y = y;
        this.img = query<HTMLImageElement>`#boom`;
    }


    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        if (this.show)
            ctx.drawImage(this.img,x,y,this.currentW, this.currentH)
    }

    getSize(): { w: number; h: number } {
        return {h: 0, w: 0};
    }

    update(): void {
        this.y++;
        if ( this.currentW < this.width ) this.currentW += 1;
        if ( this.currentH < this.height ) this.currentH += 0.5;
        if ( this.currentH == this.height &&  this.currentW == this.width ) this.show = false
    }
}
