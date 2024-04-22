import Phaser from "phaser";
import OceanScene from "./scene.js" ;

window.onload = (a, t) => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: "aquarium",
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene: OceanScene
    };

    const game = Phaser.Game(config)
}