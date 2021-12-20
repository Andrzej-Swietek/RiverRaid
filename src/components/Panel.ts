import { HTMLComponent } from "../Engine/HTMLComponent";
import {UIComponent} from "../Engine/decorators/UIComponent";
import {query} from "../Engine/Query";
import Board from "./Board";
import {planeCrush} from "../Engine/Events";

@UIComponent({
    selector: 'component-panel',
    template: `<div id="score"></div>  <div id="lv"> Bridges 0 </div> <div id="hp"></div><div id="fuel"> <div id="caption">1/1</div> <div id="marker"></div> `,
    style: ``,
})
export default class Panel extends HTMLComponent{
    private _points: number = 0;
    private _hp: number = 5
    private _fuel: number = 100;
    private _fuelInterval;
    private _bridges: number = 0
    constructor() {
        super();
    }

    public get points(){
        return this._points
    }

    public get hp(){
        return this._hp;
    }

    public set fuel(v: number){
        this._fuel += v;
        this._fuel = Math.min(100, this._fuel);
        if ( this._fuel == 100 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 1 }`;
        if ( this._fuel == 75 ) query<HTMLElement>`#caption`.innerHTML = `${ 3 }/${ 4 }`;
        if ( this._fuel == 50 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 2 }`;
        if ( this._fuel == 25 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 4 }`;
        if ( this._fuel == 0 )  query<HTMLElement>`#caption`.innerHTML = `${ 0 }/${ 0 }`;
        query<HTMLElement>`#marker`.style.left = `${ this._fuel }%`;
    }

    increaseBridge(){
        this._bridges++;
        query<HTMLElement>`#lv`.innerHTML = `Bridges: ${ this._bridges }`
    }

    init(){
        this.updateScore(0);
        this.updateHP(5);
    }

    updateScore(points: number) {
        this._points = points;
        document.querySelector<HTMLDivElement>('#score').innerText = `${ this.points } POINTS`;
    }

    updateHP(hp: number) {
        this._hp = hp;
        document.querySelector<HTMLDivElement>('#hp').innerText  = `${ this.hp } HP`;
    }

    fillFuel() {
        this._fuel = 100
    }
    stop(){
        clearInterval(this._fuelInterval)
    }

    start() {
        this._fuelInterval = setInterval( ()=>{
            if (this._fuel == 0) {
                clearInterval(this._fuelInterval)
                document.body.dispatchEvent(planeCrush)
            };
            if ( this._fuel > 0 && !Board.pause) this._fuel-=0.5;
            query<HTMLElement>`#marker`.style.left = `${ this._fuel }%`;
            if ( this._fuel == 100 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 1 }`;
            if ( this._fuel == 75 ) query<HTMLElement>`#caption`.innerHTML = `${ 3 }/${ 4 }`;
            if ( this._fuel == 50 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 2 }`;
            if ( this._fuel == 25 ) query<HTMLElement>`#caption`.innerHTML = `${ 1 }/${ 4 }`;
            if ( this._fuel == 0 )  query<HTMLElement>`#caption`.innerHTML = `${ 0 }/${ 0 }`;
        },500)
    }


}
