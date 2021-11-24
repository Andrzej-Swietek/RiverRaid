export abstract class BoardElement {
    public abstract x: number;
    public abstract y: number;
    protected abstract readonly width: number;
    protected abstract readonly height: number;
    protected constructor() { }
    public abstract draw(ctx: CanvasRenderingContext2D, x: number, y: number): void
}
