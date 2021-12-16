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
import Helikopter from "./Helikopter";
import Panel from "./Panel";


export type RiverRow = { x: number, width: number, xend: number  }


export default class Board {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    private readonly riverWidth: number;
    private plane: Plane
    //@ts-ignore
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
        this.plane.y = this.height*0.9;
        this.keyboard = new Keyboard(window,this.plane)

        this.stage = [
            new Bridge(0  , 10, this.width/2-100),
            new Balloon(this.width/2,20),
            // new Cruiser(this.width/2+30, 100),
            // new Bolt(this.width/2, 100),
            // new Fuel(this.width/2+20, 20),
            // new EnemyPlane(this.width/2+20, 50)
        ];
        this.riverRows = [];
        for (let i = 0; i < this.height; i++) {
            const obj : RiverRow = { x: this.width/2-this.riverWidth/2, width: this.riverWidth, xend: this.width/2-this.riverWidth/2 + this.riverWidth }
            this.riverRows.push( obj );
        }
        console.log(this.riverRows)

        setInterval(()=> this.spawnEnemy(), 1000)

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
        this.riverRows.forEach( (row: RiverRow, i)=> {
            this.ctx.fillStyle = "rgb(78,0,3)"
            this.ctx.fillRect( row.x-5, i, row.width+10, 3 )
            this.ctx.fillStyle = "blue"
            this.ctx.fillRect( row.x, i, row.width, 3 )
        })
    }

    public clearCanvas(): void {
        this.ctx.clearRect(0,0,this.width, this.height);
    }

    spawnEnemy() {
        let r = Math.floor(Math.random() *10);
        if ( r == 1 )
            this.stage.push( new Balloon(this.width/2,0)  )
        else if ( r == 2 )
            this.stage.push( new EnemyPlane(this.width/2,0)  )
        else if ( r == 3  || r == 6)
            this.stage.push( new Cruiser(this.width/2,0)  )
        else if ( r == 4 )
            this.stage.push( new Fuel(this.width/2,0)  )
        else {
            this.stage.push( new Helikopter(this.width/2,0)  )
        }
    }

    isPointInObject(x:number,y:number, element: BoardElement|Plane) : boolean {
        return ( x >= element.x && x <= element.x + element.getSize().w ) && ( y >= element.y && y <= element.y + element.getSize().h )
    }

    collision(obj1:BoardElement|Plane, obj2:BoardElement|Plane) {
        const arr = [
            { x: obj1.x, y: obj1.y },
            { x: obj1.x, y: obj1.y + obj1.getSize().h },
            { x: obj1.x + obj1.getSize().w, y: obj1.y },
            { x: obj1.x + obj1.getSize().w, y: obj1.y + obj1.getSize().h },
        ]
        const arr2 = [
            { x: obj2.x, y: obj2.y },
            { x: obj2.x, y: obj2.y + obj2.getSize().h },
            { x: obj2.x + obj2.getSize().w, y: obj2.y },
            { x: obj2.x + obj2.getSize().w, y: obj2.y + obj2.getSize().h },
        ]
        const isCollision: boolean = this.isPointInObject(arr[0].x , arr[0].y, obj2) || this.isPointInObject( arr[1].x , arr[1].y, obj2) || this.isPointInObject(arr[2].x , arr[2].y, obj2) || this.isPointInObject( arr[3].x , arr[3].y, obj2);
        const isCollision2: boolean = this.isPointInObject(arr2[0].x , arr2[0].y, obj1) || this.isPointInObject( arr2[1].x , arr2[1].y, obj1) || this.isPointInObject(arr2[2].x , arr2[2].y, obj1) || this.isPointInObject( arr2[3].x , arr2[3].y, obj1)

        return isCollision || isCollision2
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
            if ( this.collision( this.plane, stageElement ) && stageElement.constructor.name!="Bolt" ){
                this.ctx.fillStyle = "purple"
                this.ctx.fillRect(stageElement.x,stageElement.y, 10,10)
                console.log(' %c boom: '+ stageElement.constructor.name + `plane ${this.plane.x},${this.plane.y} ${this.plane.getSize().w}x${this.plane.getSize().h} ` + ` - stageEl ${stageElement.x},${stageElement.y} ${stageElement.getSize().w}x${stageElement.getSize().h}`, 'color: yellow')
                if ( stageElement instanceof Fuel) {
                    document.querySelector<Panel>("component-panel").fuel = 3;
                }

            }
        })

        // COLLISION WITH RIVER
        if ( this.plane.x < this.riverRows[this.plane.y].x || this.plane.x > this.riverRows[this.plane.y].x + this.riverRows[this.plane.y].width){
            console.log('OUT')
        }
        this.stage.forEach( (element: any)=> {
            if( ( element.constructor.name=="Balloon" || element.constructor.name=="Helikopter" || element.constructor.name=="Cruiser" ||  element.constructor.name=="EnemyPlane") && element.y < this.height )
            if ( element.x < this.riverRows[element.y].x || element.x > this.riverRows[element.y].x + this.riverRows[element.y].width){
                element.changeDirection?.();
            }
        })

        mentToBeRemoved.forEach( (stageElement: BoardElement) => {
            this.stage = [ ...this.stage.filter( item => item !== stageElement ) ]
        })

        this.riverRows.pop()
        let randomN = randomNumber(1,5);
        randomN *= ( randomN%2 === 0  && this.riverRows[0].x < 3/7  *this.width )? 1 : -1
        this.riverRows.unshift({
                x: this.riverRows[0].x+randomN ,
                width: this.riverRows[0].width+randomN,
                xend: this.riverRows[0].x + this.riverRows[0].width + 2* randomN
            })

        requestAnimationFrame(this.update.bind(this))
    }
}
