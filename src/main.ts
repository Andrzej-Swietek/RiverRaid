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
            if  (this.panel.hp >= 1) {
                console.log("HEART --")
                this.handleCrush()
                this.panel.fillFuel();
                this.panel.stop()
                this.panel.start()
            }
            if ( this.panel.hp == 0 ) {
                // alert('GAME OVER')
                Board.pause = true;
                this.openGameOver()
                this.audio.pause()
                document.body.onclick = ()=> location.reload();
            }
        })

        this.board.update();
    }

    private openGameOver(){
        setTimeout( ()=> {
            query<HTMLElement>`#gameOverContainer`.style.top = parseInt(window.getComputedStyle( document.querySelector("#gameOverContainer") ).top.split("px")[0] )+50 + "px"
            if ( parseInt(window.getComputedStyle( document.querySelector("#gameOverContainer") ).top.split("px")[0] ) < 0 ) this.openGameOver()
        } ,500);
    }

    public restart(){

    }

    private handleCrush() {

        Board.pause = true;
        this.panel.updateHP(this.panel.hp-1);
        this.board.deathAnimation().then( ()=>{
            let newX = ( 2 * this.board.getCurrentRiverRow().x + this.board.getCurrentRiverRow().width ) / 2
            // this.plane.x = this.board.width / 2 - 25/2;
            this.plane.x = newX;
            setTimeout(()=> {
                this.board.clearStage();
                Board.pause = false;
            }, 2000);
        })

    }

    public finish(){

    }

}

document.addEventListener("DOMContentLoaded", ()=> {
    ( async ()=>{
        // query<HTMLAudioElement>`#engineSound`.addEventListener("loadedmetadata", ()=> {
            setTimeout( ()=> {
                console.log("ASSETS LOADED")
                query<HTMLElement>`#banner`.remove();
                const game = new Game();
                game.start();
            }, 3000)
        // })
    } )();
})

