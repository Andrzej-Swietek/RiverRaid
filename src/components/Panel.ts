import { HTMLComponent } from "../Engine/HTMLComponent";
import {UIComponent} from "../Engine/decorators/UIComponent";

@UIComponent({
    selector: 'component-panel',
    template: `<div id="score"></div></div><div id="hp"></div><div id="fuel"> <div id="caption">1/1</div> <div id="marker"></div> `,
    style: ``,
})
export default class Panel extends HTMLComponent{
    private _points: number = 0;
    private _hp: number = 5
    constructor() {
        super();
    }

    public get points(){
        return this._points
    }

    public get hp(){
        return this._hp;
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


}
