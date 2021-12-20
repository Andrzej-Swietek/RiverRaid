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
import {planeCrush} from "../Engine/Events";
import {query} from "../Engine/Query";
import Tank from "./Tank";

import Boom from "./Boom";
import Island from "./Island";
import Mountains from "./Mountains";


export type RiverRow = { x: number, width: number, xend: number  }


export default class Board {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;
    private readonly riverWidth: number;
    public plane: Plane
    //@ts-ignore
    private speedFactor = 1;
    private stage: Array<object>
    keyboard: Keyboard
    static riverSpeed: number = 1;
    static pause: boolean = false
    stopAttack: boolean = false;
    private riverRows : RiverRow[] = [];
    private hitValues = new Map<string, number>()
    private killCounter: number = 0;
    private meanderDirection: 'left'|'right'|'straight' = 'straight';
    private beforeTurn: number;


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

        this.hitValues.set("EnemyPlane", 60);
        this.hitValues.set("Helikopter", 40);
        this.hitValues.set("Fuel", 40);
        this.hitValues.set("Cruiser", 100);
        this.hitValues.set("Balloon", 40);
        this.hitValues.set("Tank", 100);
        this.hitValues.set("Bridge", 200);
        this.hitValues.set("Island", 0);
        this.hitValues.set("Bolt", 0);
        this.hitValues.set("EnemyBolt", 0);
        this.hitValues.set("TankBolt", 0);


        window.addEventListener("keydown", (e: KeyboardEvent)=> {
            if (e.keyCode == 80 ) Board.pause = !(Board.pause)
        })


        this.riverRows = [];
        for (let i = 0; i < this.height; i++) {
            const obj : RiverRow = { x: this.width/2-this.riverWidth/2, width: this.riverWidth, xend: this.width/2-this.riverWidth/2 + this.riverWidth }
            this.riverRows.push( obj );
        }

        this.stage = [
            new Bridge(0  , 10, this.width/2-100, this.riverRows),
        ];

        setInterval(()=> this.spawnEnemy(), 1000)
        setInterval(()=> {
            let x = randomNumber(0,10)%2==0? randomNumber( 5, this.riverRows[0].x-100 ) : randomNumber( this.riverRows[0].xend+100, this.width-100 )
            this.stage.push( new Mountains( x, 0) )
        }, 5000)

        setInterval( () => {
            this.meanderDirection = (randomNumber(0,2) % 2==0)? 'left' : 'right';
            this.beforeTurn = this.riverRows[0].x;
        }, 15000)
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

    public getCurrentRiverRow() {
        return this.riverRows[this.riverRows.length-1]
    }

    public clearCanvas(): void {
        this.ctx.clearRect(0,0,this.width, this.height);
    }

    private isThereAlreadyAnIsland(): boolean {
        let result: boolean = false;
        this.stage.forEach( element=> {
            if ( element.constructor.name === "Island" ) result = true
        })

        return result
    }

    spawnEnemy(): void {
        if ( !Board.pause ) {
            let r = Math.floor(Math.random() *10);
            if ( r == 1 )
                this.stage.push( new Balloon((2*this.riverRows[0].x + this.riverRows[0].width)/2-12,0)  )
            else if ( r == 2 )
                this.stage.push( new EnemyPlane((2*this.riverRows[0].x + this.riverRows[0].width)/2-25,0)  )
            else if ( r == 3  || r == 6)
                this.stage.push( new Cruiser((2*this.riverRows[0].x + this.riverRows[0].width)/2-35,0)  )
            else if ( r == 4 )
                this.stage.push( new Fuel((2*this.riverRows[0].x + this.riverRows[0].width)/2-10,0)  )
            else if ( r == 5 )
                this.stage.push( new Tank((randomNumber(1,10)%2==0)? this.riverRows[0].x - 100 :this.riverRows[0].xend + 50,0,this.stage)  )
            else if ( r == 7 && !this.isThereAlreadyAnIsland() && this.meanderDirection=="straight" && !this.stage.some( e => e.constructor.name == "Bridge" ) )
                this.stage.push( new Island( (this.riverRows[0].x + this.riverRows[0].xend)/2- this.riverRows[0].width*0.2, 1,this.riverRows[0].width*0.4, 40 ) )
            else {
                this.stage.push( new Helikopter(this.riverRows[0].xend-30,0, this.stage)  )
            }
        }
    }

    deathAnimation() {
        return new Promise( (resolve => {
            const boom = new Boom( this.plane.x + this.plane.width/2, this.plane.y + this.plane.height/2)
            boom.draw(this.ctx, boom.x, boom.y)
            this.ctx.fillStyle = "blue"
            this.ctx.fillRect(this.plane.x, this.plane.y, this.plane.width,this.plane.height)
            this.ctx.drawImage(query<HTMLImageElement>`#boom`,this.plane.x, this.plane.y, this.plane.width,this.plane.height)
            setTimeout( ()=> {
                resolve('ok')
            } , 1000)
        }) )
    }

    isPointInObject(x:number,y:number, element: BoardElement|Plane) : boolean {
        return ( x >= element.x && x <= element.x + element.getSize().w ) && ( y >= element.y && y <= element.y + element.getSize().h )
    }

    clearStage(): void {
        this.stage = []
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

    drawMeander(riverWidth:number = this.riverRows[0].width):RiverRow {
        const leftExtremum = this.width / 4;
        const rightExtremum = 3 * this.width / 4 - riverWidth/2;
        // const centerX = this.width/2-riverWidth/2;
        const centerX = this.beforeTurn;

        let resultX = 0;
        if ( this.riverRows[0].x > leftExtremum && this.meanderDirection == 'left' ) {
            resultX = this.riverRows[0].x - randomNumber(1,5);
            if ( resultX <= leftExtremum ) {
                this.meanderDirection = "straight"
                setTimeout(() => {
                    this.meanderDirection = "left"
                }, 3000)
            }
        }
        // else if ( this.riverRows[0].x <= leftExtremum && this.meanderDirection == 'left' ) {
        else if ( this.riverRows[0].x <= centerX && this.meanderDirection == 'left' ) {
            let factor = randomNumber(1,5) % 5 == 0? -1 : 1;
            resultX = this.riverRows[0].x + randomNumber(1,5)*factor
            if ( resultX >= centerX ) this.meanderDirection = 'straight'
        }
        else if ( this.riverRows[0].x < rightExtremum && this.meanderDirection == 'right' ) {
            resultX = this.riverRows[0].x + randomNumber(1,5);
            if ( resultX + this.riverRows[0].width >= rightExtremum ) {
                this.meanderDirection = "straight"
                setTimeout(() => {
                    this.meanderDirection = "right"
                }, 3000)
            }
        }
        else if ( this.riverRows[0].x >= rightExtremum && this.meanderDirection == 'right' ) {
            resultX = this.riverRows[0].x - randomNumber(1,5)
            if ( resultX <= centerX ) this.meanderDirection = 'straight'
        }
        else if( this.meanderDirection == 'straight' ) {
            let randomN = randomNumber(1,5);
            randomN *= ( randomN%2 === 0  && this.riverRows[0].x < 3/7  * this.width )? 1 : -1

            return {
                x: this.riverRows[0].x+randomN ,
                width: this.riverRows[0].width,
                // width: this.riverRows[0].width+randomN,
                xend: this.riverRows[0].x + this.riverRows[0].width + 2* randomN
            }
        }

        return { x: resultX, width: this.riverRows[0].width, xend: resultX + this.riverRows[0].width }
    }

    public update(): void {
        if ( !Board.pause ) {

            this.clearCanvas();
            this.drawGrass();
            this.drawRiver();
            this.speedFactor-= .3;
            this.plane.draw(this.ctx, null, this.height*0.9);

            // PLANE MOVEMENT ON KEYBOARD
            if ( Movements.moveLeft ){      this.plane.move( Directions.LEFT )      }
            else if ( Movements.moveRight ) {   this.plane.move( Directions.RIGHT )     }
            else if ( Movements.attack && !this.stopAttack ) { this.stage.push( new Bolt(this.plane.x + this.plane.width/2, this.height*0.8) ); this.stopAttack = true; query<HTMLAudioElement>`#shootSound`.play(); setTimeout( ()=> this.stopAttack = false,500 ); }

            let mentToBeRemoved = []
            // REDRAW ALL STAGE ELEMENTS
            if ( this.stage.length > 0 ) {
                this.stage.forEach( (stageElement: BoardElement) => {
                    stageElement.draw(this.ctx, stageElement.x, stageElement.y );
                    if ( stageElement instanceof Bolt) (stageElement as Bolt).update();
                    stageElement.update();
                    if ( stageElement.y > this.height || stageElement.y < 0 ) {
                        mentToBeRemoved.push( stageElement )
                        if ( stageElement instanceof Helikopter || stageElement instanceof Tank ) stageElement.killInterval()
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
                        // console.log('collision', element.constructor.name, stageElement.constructor.name);
                        if ( stageElement instanceof Bolt && element instanceof Bridge){
                            mentToBeRemoved.push(stageElement)
                            element.boltCollisionHandle()
                            let panel:Panel =  query<Panel>`component-panel`;
                            panel.updateScore( panel.points + this.hitValues.get(element.constructor.name) )
                            panel.increaseBridge();
                        }
                        else if ( stageElement instanceof Bolt && !(element instanceof Island)){
                            mentToBeRemoved.push(stageElement)
                            mentToBeRemoved.push(element)
                            let panel:Panel =  query<Panel>`component-panel`;
                            panel.updateScore( panel.points + this.hitValues.get(element.constructor.name) )
                            this.stage.push( new Boom( element.x+element.getSize().w/2, element.y+element.getSize().h/2 ) )
                            this.killCounter++;
                            if ( this.killCounter % 20 == 0 && this.killCounter> 0) {
                                this.stage.push(new Bridge(0, 0, this.width / 2 - 100, this.riverRows));
                            }
                        }
                    }
                })
                if ( this.collision( this.plane, stageElement ) && stageElement.constructor.name!="Bolt" && stageElement.constructor.name!="Boom" ){
                    // console.log(' %c boom: '+ stageElement.constructor.name + `plane ${this.plane.x},${this.plane.y} ${this.plane.getSize().w}x${this.plane.getSize().h} ` + ` - stageEl ${stageElement.x},${stageElement.y} ${stageElement.getSize().w}x${stageElement.getSize().h}`, 'color: yellow')
                    if ( stageElement instanceof Fuel) {
                        document.querySelector<Panel>("component-panel").fuel = 3;
                        query<HTMLAudioElement>`#fuelSound`.play();
                    } else {
                        this.killCounter = 0;
                        document.body.dispatchEvent(planeCrush)
                    }

                }
            })

            // COLLISION WITH RIVER
            if ( this.plane.x < this.riverRows[this.plane.y].x || this.plane.x > this.riverRows[this.plane.y].x + this.riverRows[this.plane.y].width){
                console.log('OUT')
                document.body.dispatchEvent(planeCrush)
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

            for (let i = 0 ; i < Board.riverSpeed; i++) {
                this.riverRows.pop();
                this.riverRows.unshift( this.drawMeander() )
            }

            // let randomN = randomNumber(1,5);
            // randomN *= ( randomN%2 === 0  && this.riverRows[0].x < 3/7  *this.width )? 1 : -1
            // this.riverRows.unshift({
            //     x: this.riverRows[0].x+randomN ,
            //     width: this.riverRows[0].width+randomN,
            //     xend: this.riverRows[0].x + this.riverRows[0].width + 2* randomN
            // })

        }

        requestAnimationFrame(this.update.bind(this))
    }
}
