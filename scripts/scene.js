import { Enemy } from "./enemy.js"
import Player from "./player.js"
import { Food } from "./food.js"
import { foodConfig, MOUSE_X_BUFFER, MOUSE_Y_BUFFER, WATER_FRICTION, MAX_FOOD } from "./config/game_config.js"

export class OceanScene extends Phaser.Scene {

    pointer = null
    player = null

    foods = Array() ;

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

        this.input.on('pointermove', (pointer) => {
            this.pointer = pointer
        });
        this.input.once('pointerdown', (pointer) => {
          this.player.start()
        })

        setInterval(() => {
          if (this.foods.length >= MAX_FOOD) return ;
          var keys = Object.keys(foodConfig);
          
          let newFood = new Food(
            foodConfig[keys[ keys.length * Math.random() << 0]],
            this,
            Math.random() * this.bg.width,
            Math.random() * this.bg.height
           ) ;
           newFood.start() ;
           this.physics.add.overlap(this.player, newFood, (player, food) => this.eat(food));
           this.foods.push(newFood) ;
        }, 1000) ;

        this.physics.add.overlap(this.player, enemy, (player, enemy) => this.eaten(enemy));

        //this.cameras.main.startFollow(this.player)
        // this.cameras.main.zoom = 0.5
    }

    update() {
      //this.move() ;
    }

    eat(food) {
      if (!food.isDead) {
        this.score += food.score ;
        this.scoreText.setText('Score   ' + this.score);
        food.kill() ;
        this.foods.splice(this.foods.indexOf(food), 1) ;
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

    move() {
      if (this.player.body && this.pointer !== null) {

        const lockedToCamPointer = this.pointer.positionToCamera(this.cameras.main)
  
        let newPlayerVelocityX = this.player.body.velocity.x - WATER_FRICTION
        let newPlayerVelocityY = this.player.body.velocity.y - WATER_FRICTION
  
  
        if (newPlayerVelocityX < 0)
          newPlayerVelocityX = 0
  
        if (newPlayerVelocityY < 0)
          newPlayerVelocityY = 0
  
        if (lockedToCamPointer.x >= this.player.x + MOUSE_X_BUFFER) {
  
          this.player.flipX = false
          newPlayerVelocityX = (lockedToCamPointer.x - this.player.x) / this.player.scale
  
        }
  
        else if (lockedToCamPointer.x <= this.player.x - MOUSE_X_BUFFER) {
  
          newPlayerVelocityX = -1 * Math.abs(lockedToCamPointer.x - this.player.x) / this.player.scale
          this.player.flipX = true
  
        }
  
        if (lockedToCamPointer.y >= this.player.y + MOUSE_Y_BUFFER) {
  
          newPlayerVelocityY = (lockedToCamPointer.y - this.player.y) / this.player.scale * 2
  
        }
  
        else if (lockedToCamPointer.y <= this.player.y - MOUSE_Y_BUFFER) {
  
          newPlayerVelocityY = -1 * Math.abs(lockedToCamPointer.y - this.player.y) / this.player.scale * 2
  
        }
  
        this.player.body.setVelocityX(newPlayerVelocityX)
        this.player.body.setVelocityY(newPlayerVelocityY)
      }
    }
}
