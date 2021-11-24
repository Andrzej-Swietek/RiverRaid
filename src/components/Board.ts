import { Plane } from "./Plane";
import Balloon from "./Balloon";
import Cruiser from "./Cruiser";
import Bolt from "./Bolt";
import Keyboard from "../Engine/Keyboard";
import Movements from "../Engine/decorators/Movements";
import {Directions} from "../Directions";



export default class Board {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    private readonly riverWidth: number;
    private plane: Plane
    private speedFactor = 1;
    private stage: Array<object>
    keyboard: Keyboard

    constructor( planeObject: Plane) {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.riverWidth = this.width/4;
        this.plane = planeObject;
        this.keyboard = new Keyboard(window,this.plane)

        this.stage = [
            new Balloon(100,100),
            new Cruiser(300, 200),
            new Bolt(500, 200)
        ]
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
            this.ctx.fillRect(5 * Math.sin( i / 2 + this.speedFactor) + this.width / 2 - this.riverWidth/2-5,2 * i, 5, 2);

            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(5 * Math.sin( i / 2 + this.speedFactor) + this.width / 2 - this.riverWidth/2,2 * i, this.riverWidth, 2);

            this.ctx.fillStyle = 'brown';
            this.ctx.fillRect(5 * Math.sin( i / 2 + this.speedFactor) + this.width / 2 + this.riverWidth/2,2*i, 5, 2);
        }
    }

    public clearCanvas(): void {
        this.ctx.clearRect(0,0,this.width, this.height);
    }

    public update(): void {
        // new Bolt(0,0).draw(this.ctx,30, 30)
        this.clearCanvas();
        this.drawGrass();
        this.drawRiver();
        this.speedFactor-= .3;
        this.plane.draw(this.ctx, null, this.height*0.9);

        // PLANE MOVEMENT ON KEYBOARD
        if ( Movements.moveLeft ){      this.plane.move( Directions.LEFT )      }
        else if ( Movements.moveRight ) {   this.plane.move( Directions.RIGHT )     }
        else if ( Movements.attack ) {  }

        // REDRAW ALL STAGE ELEMENTS
        this.stage.forEach( (stageElement: Balloon| Cruiser | Bolt) => {
            stageElement.draw(this.ctx, stageElement.x, stageElement.y )
        })
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(this.plane.x+this.plane.width/2,this.height*0.6,2,10)

        requestAnimationFrame(this.update.bind(this))
    }
}
