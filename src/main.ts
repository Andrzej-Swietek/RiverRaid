import './style.css'
import Board from "./components/Board";
import Panel from "./components/Panel";
import {Plane} from "./components/Plane";
import {query} from "./Engine/Query";



const app = document.querySelector<HTMLDivElement>('#app')!

class Game {
    private board: Board;
    private panel: Panel;
    private plane: Plane;
    private audio: HTMLAudioElement;
    constructor() {
        this.plane = new Plane(50,50);
        this.board = new Board( this.plane );
        this.plane.x = this.board.width / 2 - 25/2;
        this.panel = new Panel();
        this.audio = query<HTMLAudioElement>`audio`;
    }
    public start(){
        this.panel.mount(app);
        this.panel.init();
        this.board.drawGrass();
        this.board.drawRiver();
        this.panel.start();
        this.audio.addEventListener("ended", ()=> {
            this.audio.play();
        })
        this.audio.play();

        window.addEventListener('plane-crush', ()=> {
            console.log("HEART --")
            this.handleCrush()
            this.panel.fillFuel();
            this.panel.stop()
            this.panel.start()
            if ( this.panel.hp == 0 ) {
                alert('GAME OVER')
            }
        })

        this.board.update();
    }

    public restart(){

    }

    private handleCrush() {
        Board.pause = true;
        this.panel.updateHP(this.panel.hp-1);
        let newX = ( 2 * this.board.getCurrentRiverRow().x + this.board.getCurrentRiverRow().width ) / 2
        // this.plane.x = this.board.width / 2 - 25/2;
        this.plane.x = newX;
        setTimeout(()=> {
            this.board.clearStage();
            Board.pause = false;
        }, 2000);
    }

    public finish(){

    }

}

document.addEventListener("DOMContentLoaded", ()=> {
    ( async ()=>{
        const game = new Game();
        game.start();
    } )();
})

