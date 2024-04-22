
import Player from "./player.js"

export class OceanScene extends Phaser.Scene {
    MOUSE_X_BUFFER = 30
    MOUSE_Y_BUFFER = 13
    WATER_FRICTION = 2

    pointer = null
    player = null

    preload() {
        this.load.image('background', '../resource/underwater.png');
        this.load.image('player', '../resource/player.png') ; //ejnhance 
    }

    create() {
        this.bg = 
            this.add.image(0, 0, 'background').setOrigin(0)
            .setDisplaySize(document.body.clientWidth, document.body.clientHeight);
        
        this.player = new Player(this, 0, 0) ;
        this.player.start() ;
        
        this.input.on('pointermove', (pointer) => {
            this.pointer = pointer
        });

        //this.cameras.main.startFollow(this.player)
        // this.cameras.main.zoom = 0.5
    }

    update() {
        if (this.player.body && this.pointer !== null) {

            const lockedToCamPointer = this.pointer.positionToCamera(this.cameras.main)
      
            /**
             *  Move of player's fish
             */
            let newPlayerVelocityX = this.player.body.velocity.x - this.WATER_FRICTION
            let newPlayerVelocityY = this.player.body.velocity.y - this.WATER_FRICTION
      
      
            if (newPlayerVelocityX < 0)
              newPlayerVelocityX = 0
      
            if (newPlayerVelocityY < 0)
              newPlayerVelocityY = 0
      
            /**
             *  Move Player fish horizontally
             */
      
            if (lockedToCamPointer.x >= this.player.x + this.MOUSE_X_BUFFER) {
      
              this.player.flipX = false
              newPlayerVelocityX = (lockedToCamPointer.x - this.player.x) / this.player.scale
      
            }
      
            else if (lockedToCamPointer.x <= this.player.x - this.MOUSE_X_BUFFER) {
      
              newPlayerVelocityX = -1 * Math.abs(lockedToCamPointer.x - this.player.x) / this.player.scale
              this.player.flipX = true
      
            }
      
            /**
             *  Move Player fish vertically
             */
      
            if (lockedToCamPointer.y >= this.player.y + this.MOUSE_Y_BUFFER) {
      
              newPlayerVelocityY = (lockedToCamPointer.y - this.player.y) / this.player.scale * 2
      
            }
      
            else if (lockedToCamPointer.y <= this.player.y - this.MOUSE_Y_BUFFER) {
      
              newPlayerVelocityY = -1 * Math.abs(lockedToCamPointer.y - this.player.y) / this.player.scale * 2
      
            }
      
            this.player.body.setVelocityX(newPlayerVelocityX)
            this.player.body.setVelocityY(newPlayerVelocityY)
      
      
            /**
             *  Update player Fish scale.
             */
      
            //this.player.scale = this.gameState.
      
          }
    }
}
