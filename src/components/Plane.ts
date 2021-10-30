import {Directions} from "../Directions";

export class Plane {
    public x: number;
    public y: number;
    public readonly FACTOR: number = 2;

    constructor( x: number, y: number ) {
        this.x = x;
        this.y = y;
    }
    move( direction: Directions ){

        if ( direction == Directions.LEFT )
            this.x-= this.FACTOR;
        else
            this.x+= this.FACTOR;

        console.log( direction , this.x );
    }
}
