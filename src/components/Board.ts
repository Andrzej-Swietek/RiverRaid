import {Plane} from "./Plane";


export default class Board{
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    private readonly plane;
    private readonly riverWidth: number;
    private planeObject: Plane
    constructor( planeObject: Plane) {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.riverWidth = this.width/4;
        this.planeObject = planeObject;
        console.log( this.planeObject )
        this.plane = document.querySelector('#plane')
    }
    public drawGrass(): void {
        this.ctx.fillStyle = 'green';
        for ( let i=0; i < this.width ; i++ ){
            for ( let j=0; j < this.height; j++ ){
                    this.ctx.fillRect(10*i, 10*j, 10, 10);
            }
        }
    }
    public drawRiver(): void{
        for ( let i=0; i < this.width ; i++ ){
            this.ctx.fillStyle = 'brown';
            this.ctx.fillRect(5 * Math.sin( i / 2 ) + this.width / 2 - this.riverWidth/2-5,2 * i, 5, 2);

            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(5 * Math.sin( i / 2) + this.width / 2 - this.riverWidth/2,2 * i, this.riverWidth, 2);

            this.ctx.fillStyle = 'brown';
            this.ctx.fillRect(5 * Math.sin( i / 2 ) + this.width / 2 + this.riverWidth/2,2*i, 5, 2);
        }
    }

    public drawPlane(): void {
        this.ctx.drawImage(this.plane, this.canvas.width/2 - 10, this.height*0.9, 25, 10)
    }

    public clearCanvas(): void {
        this.ctx.clearRect(0,0,this.width, this.height);
    }

    public update(): void {
        this.clearCanvas();
        this.drawGrass();
        this.drawRiver();
        this.ctx.drawImage(this.plane, this.planeObject.x, this.height*0.9, 25, 10)

        requestAnimationFrame(this.update.bind(this))
    }
}
