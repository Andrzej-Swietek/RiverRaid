export default class Bolt {
    public x: number;
    public y: number;
    private readonly width: number;
    private readonly height: number;
    constructor(x: number,y: number) {
        this.x = x;
        this.y = y;
        this.width = 2;
        this.height = 10;
    }

    public draw(ctx: CanvasRenderingContext2D, x: number=this.x, y: number=this.y){
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x,y,this.width,this.height)
    }
    public update() {
        this.y--;
    }
    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }
}
