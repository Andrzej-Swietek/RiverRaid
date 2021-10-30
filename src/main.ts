import './style.css'
import Board from "./components/Board";
import Panel from "./components/Panel";
import {Plane} from "./components/Plane";
import {Directions} from "./Directions";

const app = document.querySelector<HTMLDivElement>('#app')!

class Game {
    private board: Board;
    private panel: Panel;
    private plane: Plane;
    constructor() {
        this.plane = new Plane(50,50);
        this.board = new Board( this.plane );
        this.plane.x = this.board.width / 2 - 25/2;
        this.panel = new Panel();
    }
    public start(){
        this.panel.mount(app);
        this.board.drawGrass();
        this.board.drawRiver();
        this.board.drawPlane();


        window.addEventListener('keydown', (e:KeyboardEvent)=> {
            if(e.keyCode == 39){
                this.plane.move( Directions.RIGHT )
            }
            if(e.keyCode == 37){
                this.plane.move( Directions.LEFT )
            }
        })

        this.board.update();
    }

    public restart(){

    }

    public finish(){

    }

}


( async ()=>{
    const game = new Game();
    game.start();
} )();
