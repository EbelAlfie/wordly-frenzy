import { Enemy } from "./enemy.js"
import Player from "./player.js"
import { Food } from "./food.js"

export class OceanScene extends Phaser.Scene {
    MOUSE_X_BUFFER = 30
    MOUSE_Y_BUFFER = 13
    WATER_FRICTION = 2

    pointer = null
    player = null

    preload() {
        this.load.image('background', '../resource/underwater.png');
        this.load.image('player', '../resource/player.png') ; //ejnhance 
        this.load.image('food', '../resource/food.png') ;
        this.load.spritesheet(
          'enemy', 
          '../resource/enemy.png', 
          {
            frameWidth: 290,
            frameHeight: 250,
            startFrame: 0,
            endFrame: 5
          }
        )

        this.scoreText;
        this.score = 0;
    }

    create() {
        this.bg = 
            this.add.image(0, 0, 'background').setOrigin(0)
            .setDisplaySize(document.body.clientWidth, document.body.clientHeight);
            
        this.scoreText = this.add.text(16, 32, 'Score   0', 40).setDepth(1);
        
        this.player = new Player(this, 0, 0) ;
        this.player.start() ;

        let enemy = new Enemy(this, 100, 100, 200) ;
        enemy.start() ;

        let food = new Food(this, 100, 100, 200) ;
        food.start() ;
        
        this.input.on('pointermove', (pointer) => {
            this.pointer = pointer
        });
        this.input.once('pointerdown', (pointer) => {
          this.player.start()
        })

        this.physics.add.overlap(this.player, enemy, (enemy) => this.eaten(enemy));
        this.physics.add.overlap(this.player, food, (food) => this.eat(food));

        //this.cameras.main.startFollow(this.player)
        // this.cameras.main.zoom = 0.5
    }

    update() {
        if (this.player.body && this.pointer !== null) {

            const lockedToCamPointer = this.pointer.positionToCamera(this.cameras.main)
      
            let newPlayerVelocityX = this.player.body.velocity.x - this.WATER_FRICTION
            let newPlayerVelocityY = this.player.body.velocity.y - this.WATER_FRICTION
      
      
            if (newPlayerVelocityX < 0)
              newPlayerVelocityX = 0
      
            if (newPlayerVelocityY < 0)
              newPlayerVelocityY = 0
      
            if (lockedToCamPointer.x >= this.player.x + this.MOUSE_X_BUFFER) {
      
              this.player.flipX = false
              newPlayerVelocityX = (lockedToCamPointer.x - this.player.x) / this.player.scale
      
            }
      
            else if (lockedToCamPointer.x <= this.player.x - this.MOUSE_X_BUFFER) {
      
              newPlayerVelocityX = -1 * Math.abs(lockedToCamPointer.x - this.player.x) / this.player.scale
              this.player.flipX = true
      
            }
      
            if (lockedToCamPointer.y >= this.player.y + this.MOUSE_Y_BUFFER) {
      
              newPlayerVelocityY = (lockedToCamPointer.y - this.player.y) / this.player.scale * 2
      
            }
      
            else if (lockedToCamPointer.y <= this.player.y - this.MOUSE_Y_BUFFER) {
      
              newPlayerVelocityY = -1 * Math.abs(lockedToCamPointer.y - this.player.y) / this.player.scale * 2
      
            }
      
            this.player.body.setVelocityX(newPlayerVelocityX)
            this.player.body.setVelocityY(newPlayerVelocityY)
          }
    }

    eat(food) {
      if (!food.isDead) {
        this.score++ ;
        this.scoreText.setText('Score   ' + this.score);
        food.kill() ;
      }
    }

    eaten(enemy) {
      this.player.kill() ;

    }

    getPlayerLocation(location) {
      location.x = this.player.x;
      location.y = this.player.y;
      return location ;
    }
}
