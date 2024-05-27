//import Phaser from "./phaser.js";
import { OceanScene } from "./scenes/game.js" ;

window.onload = (a, t) => {
    const config = {
        type: Phaser.AUTO,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        backgroundColor: "#0482ef",
        parent: "aquarium",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: [OceanScene]
    };

    const game = new Phaser.Game(config)
}