import { Enemy } from "./enemy.js"
import Player from "./player.js"
import { Food } from "./food.js"
import { foodConfig, MAX_FOOD } from "./config/game_config.js"
import { FoodManager } from "./food_manager.js"
import { PowerUpManager } from "./power_up_manager.js"

export class OceanScene extends Phaser.Scene {

    pointer = null
    player = null

    foods = Array() ;

    preload() {
        this.load.image('background', '../resource/underwater.png');
        this.load.image('player', '../resource/player.png') ; //ejnhance 
        this.load.image('food', '../resource/food.png') ;
        this.load.image('food2', '../resource/food2.jpg') ;
        this.load.image('food3', '../resource/food3.jpg') ;
        this.load.spritesheet(
          'enemy', 
          '../resource/enemy.png', 
          {
            frameWidth: 20 * 16,
            frameHeight: 18 * 16
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
        
        //this.physics.add.sprite
        this.player = new Player(this, 0, 0) ;
        this.player.start() ;
        
        this.foodManager = new FoodManager(this.physics.world, this) ;
        this.foodManager.start() ;

        this.powerUpManager = new PowerUpManager(this.physics.world, this) ;
        this.powerUpManager.start() ;
        
        this.physics.add.overlap(this.player, this.foodManager, (player, food) => this.eat(food, this.foodManager))
        this.physics.add.overlap(this.player, this.powerUpManager, (player, powerUp) => this.power(powerUp, player))
        //this.cameras.main.startFollow(this.player)
        // this.cameras.main.zoom = 0.5
    }

    update() {
      //this.move() ;
    }

    eat(food, foodManager) {
      if (!food.isDead) {
        this.score += food.score ;
        this.scoreText.setText('Score   ' + this.score);
        foodManager.remove(food) ;
        food.kill() ;
        //this.foods.splice(this.foods.indexOf(food), 1) ;
      }
    }

    power(power, player) {
      
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
