import {BoardElement} from "./BoardElement";

type Zone = { x: number, y: number }
export default class Collider {
    private readonly objectA: BoardElement;
    private readonly objectB: BoardElement;
    zone : Zone

    constructor( objectA: BoardElement, objectB: BoardElement, zoneX: number, zoneY:number ) {
        this.objectA = objectA
        this.objectB = objectB
        this.zone = { x: zoneX, y: zoneY }
        console.log( `${ objectA.constructor.name } - ${ objectB.constructor.name } Collider Initialized`, 'color: purple' )
    }
    detect(): boolean {
        console.log( this.objectA, this.objectB )
        return false;
    }
}
