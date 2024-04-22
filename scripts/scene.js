
import Player from "./player.js"

export class OceanScene extends Phaser.Scene {
    MOUSE_X_BUFFER = 30
    MOUSE_Y_BUFFER = 13
    WATER_FRICTION = 2

    pointer = null
    player = null

    preload() {
        this.load.image('background', 'https://ebelalfie.github.io/resource/underwater.png');
        this.load.image('player', 'https://ebelalfie.github.io/resource/player.png') ; //ejnhance 
    }

    create() {
        this.bg = 
            this.add.image(0, 0, 'background').setOrigin(0);

        this.player = new Player(this, 0, 0) ;
        this.player.start() ;
        
        this.input.on('pointermove', (pointer) => {
            this.pointer = pointer
        });
        this.spacebarListener = this.input.keyboard.addKey('Space');

        this.cameras.main.startFollow(this.player)
        this.cameras.main.zoom = 0.5
    }

    update() {
        if (this.player.body && this.pointer !== null) {

            const lockedToCamPointer = this.pointer.positionToCamera(this.cameras.main)
      
            /**
              *  TODO - Handle "boost" with spacebar (or possibly left click?)
              */
      
            // if (this.spacebarListener.isDown) {
            //   console.log('pressing space!')
      
            //   let boostDistance = BOOST_DISTANCE
      
            //   if (lockedToCamPointer.x <= playerFish.x - MOUSE_X_BUFFER) {
            //     boostDistance *= -1
            //   }
      
            //   // newPlayerVelocityX += 130 
      
            //   this.tweens.add({
            //     targets: playerFish,
            //     x: playerFish.x + boostDistance,
            //     duration: 500,
            //     ease: 'Cubic',
            //     yoyo: false,
            //     loop: false,
            //   })
            // }
      
      
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
