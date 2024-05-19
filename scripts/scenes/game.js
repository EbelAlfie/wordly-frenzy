import { Enemy } from "../enemy.js"
import Player from "../player.js"
import { Food } from "../food.js"
import { foodConfig, MAX_FOOD } from "../config/game_config.js"
import { FoodManager } from "../food_manager.js"
import { PowerUpManager } from "../power_up_manager.js"
import { QuizModule } from "../data/quiz_provider.js"

export class OceanScene extends Phaser.Scene {

  quizModule = new QuizModule() ;

  pointer = null
  player = null

  foods = Array() ;

  preload() {
      this.load.image('background', '../resource/underwater.png');
      //this.load.image('player', '../resource/player.png') ; //ejnhance 
      this.load.spritesheet(
        'player', 
        '../resource/me.png', 
        {
          frameWidth: 14 * 16,
          frameHeight: 15 * 16
        }
      )
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
  }

  showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
  }

  dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
  }

  loadQuiz() {
    this.showLoading() ;
    this.quizModule.queryQuiz("")
    .then((quiz) => {
      this.onQuizLoaded(quiz) ;
      this.dismissLoading() ;
    })
    .catch((error) => {
      console.log("LOAD QUIZ ERROR " + error)
    }) ;
  }

  onQuizLoaded(quizModel) {
    document.getElementById('soal_quiz').innerText = quizModel.soal
    this.restart(quizModel);
  }

  create() {
    this.bg = 
        this.add.image(0, 0, 'background').setOrigin(0)
        .setDisplaySize(document.body.clientWidth, document.body.clientHeight);
        
    this.scoreText = 
    this.add.text(60, 32, `Score   ${this.quizModule.score}`, 40).setDepth(1);
    
    //this.physics.add.sprite
    this.player = new Player(this, 0, 0) ;
    this.player.start() ;
    
    this.foodManager = new FoodManager(this.physics.world, this) ;
    // this.powerUpManager = new PowerUpManager(this.physics.world, this) ;
    // this.powerUpManager.start() ;
    
    this.physics.add.overlap(this.player, this.foodManager, (player, food) => this.eat(food, this.foodManager))
    //this.physics.add.overlap(this.player, this.powerUpManager, (player, powerUp) => this.power(powerUp, player))
    //this.cameras.main.startFollow(this.player)
    // this.cameras.main.zoom = 0.5
     //loadQuiz
    this.loadQuiz() ;
  }

  restart(currentQuiz) {
    this.foodManager.spawn(currentQuiz.jawaban) ;
  }

  update() {
    //this.move() ;
  }

  eat(food, foodManager) {
    this.showLoading() ;
    if (!food.isDead) {
      this.quizModule.postAnswer(food.answer) ;
      this.scoreText.setText('Score   ' + this.quizModule.score);
      // foodManager.remove(food) ;
      // food.kill() ;
      //reset game
      foodManager.stop();
      this.loadQuiz() ;
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
