export default class Balloon {
    public x: number;
    public y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly image;
    constructor(x: number,y: number) {
        this.x = x;
        this.y = y;
        this.image = document.querySelector('#balloon');
        this.width = 25;
        this.height = 10;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number){
        if (x)
            ctx.drawImage(this.image, x, y, this.width, this.height)
        else
            ctx.drawImage(this.image, this.x, y, this.width, this.height)
    }
}
