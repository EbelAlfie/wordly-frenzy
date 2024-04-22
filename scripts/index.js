import Phaser from "../node_modules/phaser/src/phaser.js";
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