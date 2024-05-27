import Player from "../player.js"
import { FoodManager } from "../food_manager.js"
import { QuizModule } from "../data/quiz_provider.js"
import { background, foodConfig } from "../config/game_config.js";

export class OceanScene extends Phaser.Scene {

  quizModule = new QuizModule() ;

  pointer = null
  player = null

  isAnswering = false ;
  foods = Array() ;

  preload() {
      this.load.image('background', 'resource/underwater.png');
      this.load.image('background1', 'resource/Deep Sea.png');
      this.load.image('background2', 'resource/ocean.gif');
      this.load.spritesheet(
        'player', 
        'resource/me.png', 
        {
          frameWidth: 90,
          frameHeight: 58
        }
      )
      
      this.load.image('food', 'resource/food.png') ;
      this.load.image('food2', 'resource/food2.png') ;
      this.load.spritesheet(
        'food3', 
        'resource/food3.png', 
        {
          frameWidth: foodConfig["large"].frameWidth,
          frameHeight: foodConfig["large"].frameHeight
        }
      )
      this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNames('food3', { start: 1, end: 12 }),
        frameRate: 8,
        repeat: -1
      });

      this.load.spritesheet(
        'enemy', 
        'resource/enemy.png', 
        {
          frameWidth: 20 * 16,
          frameHeight: 18 * 16
        }
      )
    }

  showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
  }

  dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
  }

  showEndGameScreen() {
    let endGame = document.getElementById("end-game") ;
    endGame.style.visibility = "visible" ;
    let answered = document.getElementById("soal_terjawab") ;
    let scoreLayout = document.getElementById("nilai") ;
    answered.innerText = `Pertanyaan yang terjawab benar dari sekali ${this.quizModule.soalBenar}` ;
    scoreLayout.innerText = `Nilai anda: ${this.quizModule.score}` ;
  }

  loadQuiz() {
    this.showLoading() ;
    this.quizModule.queryQuiz("")
    .then((quiz) => {
      if (quiz === null || quiz === undefined) {
        //gameover
        this.gameOver() ;
      } else {
        this.onQuizLoaded(quiz) ;
      }
      this.dismissLoading() ;
    })
    // .catch((error) => {
    //   console.log("LOAD QUIZ ERROR " + error)
    // }) ;
  }

  onQuizLoaded(quizModel) {
    this.paragraphText.setText(quizModel.soal) ;
    this.restart(quizModel);
  }

  create() {
    let choosenBackground = Phaser.Math.RND.pick(background)
    this.bg = this.add.image(0, 0, choosenBackground).setOrigin(0)
        .setDisplaySize(document.body.clientWidth, document.body.clientHeight) ;
    this.updateBgSize(this.bg) ;

    //this.scoreText = this.add.text(0, 0, `Score ${this.quizModule.score}`) ;
    
    const textWidth = window.innerWidth * 0.9 - 120; 
    const timeWidth = window.innerWidth * 0.1;

    this.topBar = this.add.graphics();
    this.topBar.fillStyle(0x8B22DE, 0.7); 
    this.topBar.fillRect(0, 0, window.innerWidth, 205); 

    const verticalCenter = 205 / 2; 

    this.paragraphText = this.add.text(60, verticalCenter, "quizModel.soal", {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      wordWrap: { width: textWidth },
      align: 'center',
      fontStyle: 'bold',
    });
    this.paragraphText.setOrigin(0, 0.5); 
    
    this.player = new Player(this, this.bg.getCenter().x, this.bg.getCenter().y) ;
    this.player.start() ;
    
    this.foodManager = new FoodManager(this.physics.world, this) ;
    // this.powerUpManager = new PowerUpManager(this.physics.world, this) ;
    // this.powerUpManager.start() ;
    
    this.physics.add.overlap(this.player, this.foodManager, (player, food) => this.eat(food, this.foodManager))
    // this.physics.add.overlap(this.player, this.powerUpManager, (player, powerUp) => this.power(powerUp, player))
    // this.cameras.main.startFollow(this.player)
    // this.cameras.main.zoom = 0.5
    this.loadQuiz() ;
  }

  update() {
    this.physics.world.collide(this.foodManager.getChildren());
  }

  updateBgSize(image) {
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = image.width / image.height;

    if (windowAspectRatio > imageAspectRatio) {
      image.displayWidth = window.innerWidth;
      image.displayHeight = window.innerWidth / imageAspectRatio;
    } else {
      image.displayHeight = window.innerHeight;
      image.displayWidth = window.innerHeight * imageAspectRatio;
    }

    image.x = (window.innerWidth - image.displayWidth) / 2;
    image.y = (window.innerHeight - image.displayHeight) / 2;
  }

  restart(currentQuiz) {
    this.foodManager.spawn(currentQuiz.jawaban) ;
    this.isAnswering = false ;
  }

  eat(food, foodManager) {
    console.log("Answer")
    this.showLoading() ;
    if (!food.isDead && !this.isAnswering) {
      this.isAnswering = true ;
      this.quizModule.postAnswer(food.label) ;
      this.foodManager.stop();
      this.loadQuiz() ;
    }
  }

  power(power, player) {
    
  }

  gameOver() {
    this.player.stop() ;
    this.foodManager.stop() ;
    this.showEndGameScreen()
  }

  getPlayerLocation(location) {
    location.x = this.player.x;
    location.y = this.player.y;
    return location ;
  }
}
