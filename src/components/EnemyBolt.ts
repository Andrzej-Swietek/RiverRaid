import Board from "./Board";

export default class EnemyBolt {
    public x: number;
    public y: number;
    private readonly width: number;
    private readonly height: number;
    private readonly speed: number;
    private readonly direction: 'left'|'right'

    constructor(x: number,y: number, direction: 'left'|'right') {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 1;
        this.speed = 4;
        this.direction = direction
    }

    public draw(ctx: CanvasRenderingContext2D, x: number=this.x, y: number=this.y){
        ctx.fillStyle = 'orange';
        ctx.fillRect(x,y,this.width,this.height)
    }
    public update() {
        this.x += (( this.direction == 'left' )? -1 : 1 ) * this.speed;
        this.y += Board.riverSpeed;
    }
    public getSize(): { w: number, h: number }  {
        return { w: this.width, h: this.height }
    }
}
