import { HTMLComponent } from "../Engine/HTMLComponent";
import {UIComponent} from "../Engine/decorators/UIComponent";

@UIComponent({
    selector: 'component-panel',
    template: `<div id="score"></div><div id="fuel"></div><div id="hp"></div>`,
    style: ``,
})
export default class Panel extends HTMLComponent{
    constructor() {
        super();
    }
}
