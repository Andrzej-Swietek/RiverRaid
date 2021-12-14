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
import Bridge from "./Bridge";
import {randomNumber} from "../utils/random";


export type RiverRow = { x: number, width: number, xend: number  }


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
    stopAttack: boolean = false;
    private riverRows : RiverRow[] = [];

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
            new Bridge(0  , 10, this.width/2-100),
            new Balloon(this.width/2,20),
            new Cruiser(this.width/2+30, 100),
            new Bolt(this.width/2, 100),
            new Fuel(this.width/2+20, 20),
            new EnemyPlane(this.width/2+20, 50)
        ];
        this.riverRows = [];
        for (let i = 0; i < this.height; i++) {
            const obj : RiverRow = { x: this.width/2-this.riverWidth/2, width: this.riverWidth, xend: this.width/2-this.riverWidth/2 + this.riverWidth }
            this.riverRows.push( obj );
        }
        console.log(this.riverRows)
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
        // scan lines: = new Array(this.height)
        // for ( let i=0; i < this.height ; i++ ){
        //     this.ctx.fillStyle = 'brown';
        //     // let r = Math.random()*100;
        //     let r = 1
        //     this.ctx.fillRect(5 * Math.sin( (i / 2 + this.speedFactor) / r) + this.width / 2 - this.riverWidth/2-5,2 * i, 5, 2);
        //
        //     this.ctx.fillStyle = 'blue';
        //     this.ctx.fillRect(5 * Math.sin( (i / 2 + this.speedFactor) / r) + this.width / 2 - this.riverWidth/2,2 * i, this.riverWidth, 2);
        //
        //     this.ctx.fillStyle = 'brown';
        //     this.ctx.fillRect(5 * Math.sin( (i / 2 + this.speedFactor) / r) + this.width / 2 + this.riverWidth/2,2*i, 5, 2);
        // }

        this.riverRows.forEach( (row: RiverRow, i)=> {
            this.ctx.fillStyle = "blue"
            this.ctx.fillRect( row.x, i, row.width, 1 )
        })
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
        else if ( Movements.attack && !this.stopAttack ) { this.stage.push( new Bolt(this.plane.x + this.plane.width/2, this.height*0.8) ); this.stopAttack = true; setTimeout( ()=> this.stopAttack = false,500 ) }

        let mentToBeRemoved = []
        // REDRAW ALL STAGE ELEMENTS
        if ( this.stage.length > 0 ) {
            this.stage.forEach( (stageElement: BoardElement) => {
                stageElement.draw(this.ctx, stageElement.x, stageElement.y );
                if ( stageElement instanceof Bolt) (stageElement as Bolt).update();
                stageElement.update();
                if ( stageElement.y > this.height || stageElement.y < 0 ) {
                    // console.log(`%c ${stageElement.constructor.name}`, 'color: red' )
                    mentToBeRemoved.push( stageElement )
                }
            })
        }

        // COLLISIONS
        this.stage.forEach( (stageElement: BoardElement)=> {
            this.stage.forEach( (element: BoardElement)=>  {
                if (
                    element !== stageElement
                    && ( stageElement.x > element.x && stageElement.x < element.x + element.getSize().w )
                    && (stageElement.y < element.y && stageElement.y > element.y - element.getSize().h)
                ) {
                    console.log('collision', element.constructor.name, stageElement.constructor.name);
                    // if ( stageElement instanceof Bolt){
                       mentToBeRemoved.push(stageElement)
                       mentToBeRemoved.push(element)
                    // }
                }
            })

            // COLLISION OF PLANE
            // if (
            //     stageElement.constructor.name !== "Bolt"
            //     && ( stageElement.x > this.plane.x && stageElement.x < this.plane.x + this.plane.width )
            //     && ( stageElement.y == this.plane.y )
            // ) {
            //     console.log( 'boom', stageElement )
            // }
        }) 

        // COLLISION WITH RIVER
        if ( this.plane.x < this.riverRows[this.plane.y].x || this.plane.x > this.riverRows[this.plane.y].x + this.riverRows[this.plane.y].width){
            console.log('OUT')
        }

        mentToBeRemoved.forEach( (stageElement: BoardElement) => {
            this.stage = [ ...this.stage.filter( item => item !== stageElement ) ]
            // console.log( stageElement, this.stage )
            let r = Math.floor(Math.random() *10);
            if ( r == 1 )
                this.stage.push( new Balloon(this.width/2,0)  )
            else if ( r == 2 )
                this.stage.push( new EnemyPlane(this.width/2,0)  )
            else if ( r == 3 )
                this.stage.push( new Cruiser(this.width/2,0)  )
            else if ( r == 4 )
                this.stage.push( new Fuel(this.width/2,0)  )

        })


        this.riverRows.shift()
        let randomN = randomNumber(1,5);
        randomN *= ( randomN%2 === 0  && this.riverRows[this.riverRows.length-1].x < 3/7  *this.width )? 1 : -1
        this.riverRows.push(
            {
                x: this.riverRows[this.riverRows.length-1].x+randomN ,
                width: this.riverRows[this.riverRows.length-1].width+randomN,
                xend: this.riverRows[this.riverRows.length-1].x + this.riverRows[this.riverRows.length-1].width + 2* randomN
            }
        )
        // this.riverRows.pop();
        // this.riverRows.push()

        requestAnimationFrame(this.update.bind(this))
    }
}
