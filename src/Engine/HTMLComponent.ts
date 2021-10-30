export abstract class HTMLComponent extends HTMLElement{
    protected constructor() {
        super();
    }
    public mount(parent: HTMLElement): void {
        parent.appendChild(this);
    }
}
