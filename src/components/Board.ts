import { Plane } from "./Plane";
import Balloon from "./Balloon";
import Cruiser from "./Cruiser";
import Bolt from "./Bolt";
import Keyboard from "../Engine/Keyboard";
import Movements from "../Engine/decorators/Movements";
import {Directions} from "../Directions";
import {BoardElement} from "../Engine/BoardElement";
import Fuel from "./Fuel";
import EnemyPlane from "./EnemyPlane";



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
    static riverSpeed: number = 1;

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
            new Balloon(this.width/2,20),
            new Cruiser(this.width/2+30, 100),
            new Bolt(this.width/2, 100),
            new Fuel(this.width/2+20, 20),
            new EnemyPlane(this.width/2+20, 50)
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
        else if ( Movements.attack ) { this.stage.push( new Bolt(this.plane.x + this.plane.width/2, this.height*0.8) ) }

        let mentToBeRemoved = []
        // REDRAW ALL STAGE ELEMENTS
        if ( this.stage.length > 0 ) {
            this.stage.forEach( (stageElement: BoardElement) => {
                stageElement.draw(this.ctx, stageElement.x, stageElement.y );
                if ( stageElement instanceof Bolt) (stageElement as Bolt).update();
                stageElement.update();
                if ( stageElement.y > this.height || stageElement.y < 0 ) {
                    console.log(`%c ${stageElement.constructor.name}`, 'color: red' )
                    mentToBeRemoved.push( stageElement )
                }
            })
        }
        mentToBeRemoved.forEach( (stageElement: BoardElement) => {
            this.stage = [ ...this.stage.filter( item => item !== stageElement ) ]
            console.log( stageElement, this.stage )
        })


        // this.ctx.fillStyle = 'yellow';
        // this.ctx.fillRect(this.plane.x+this.plane.width/2,this.height*0.6,2,10)

        requestAnimationFrame(this.update.bind(this))
    }
}
