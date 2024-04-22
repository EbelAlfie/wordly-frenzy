import Phaser from "phaser";

export class Ocean extends Phaser.Scene {
    preload() {
        this.load.image('background', '../resource/underwater.gif');
        this.load.image('player', '../resource/player.jpg') ; //ejnhance 
    }

    create() {
        player = this.physics.add.sprite(100, 450, 'player');
        player.setCollideWorldBounds(true);

        input = this.input.mousePointer ;

    }
}