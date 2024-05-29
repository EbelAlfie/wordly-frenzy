import Player from "../player.js"
import { FoodManager } from "../food_manager.js"
import { QuizRepository } from "../data/quiz_repository.js"
import { background, foodConfig, TIME_LIMIT } from "../config/game_config.js";
import { animateClosingDoors, createHintBox, displayScore, playAnswerAnimation, playCorrectAudio, playWrongAudio, updateBgSize } from "../../../util/phaser-utils.js";

export class OceanScene extends Phaser.Scene {

  quizModule = new QuizRepository() ;
  player = null

  isAnswering = false ;
  foods = Array() ;

  preload() {
      // this.load.image('background', 'resource/underwater.png');
      // this.load.image('background1', 'resource/Deep Sea.png');
      // this.load.image('background2', 'resource/ocean.gif');
      this.load.image('background', 'resource/ocean1.png');
      this.load.image('background1', 'resource/ocean2.png');
      this.load.image('background2', 'resource/ocean3.png');
      this.load.spritesheet(
        'player', 
        'resource/dragon.png', 
        {
          frameWidth: 96,
          frameHeight: 64
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

      this.load.spritesheet(
        'enemy', 
        'resource/enemy.png', 
        {
          frameWidth: 20 * 16,
          frameHeight: 18 * 16
        }
      )
      this.load.image('wrongAnim', '../shooting-range/assets/X.png');
      this.load.image('correctAnim', '../shooting-range/assets/correct.png');

      this.load.audio('correct', '../asset/correct.mp3');
      this.load.audio('wrong', '../asset/wrong.mp3');
      this.load.audio('scene-music', [ '../asset/frenzy.mp3']);

      this.quizModule.loadAllQuizes() ;
    }

  showLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "visible"
  }

  dismissLoading() {
    let loading = document.getElementById("loading-screen") ;
    loading.style.visibility = "hidden"
  }

  resetGame() {
    this.quizModule.reset() ;
    this.create() ;
  }

  showEndGameScreen() {
    displayScore(
      this,
      this.quizModule.soalBenar,
      this.quizModule.getFinalScore()
    ) ;
  }

  loadQuiz() {
    this.showLoading() ;
    this.quizModule.queryQuiz("")
    .then((quiz) => {
      if (quiz === null || quiz === undefined) {
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
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
  });

    let choosenBackground = Phaser.Math.RND.pick(background)
    this.bg = this.add.image(0, 0, choosenBackground).setOrigin(0)
        .setDisplaySize(document.body.clientWidth, document.body.clientHeight) ;
    updateBgSize(this.bg) ;

    this.sound.stopAll();
    this.music = this.sound.play('scene-music', { loop: true, volume: 0.3 });

    const verticalCenter = 0 + 160 - 60;

    const textWidth = window.innerWidth * 0.9 - 120 ; 

    this.topBar = this.add.graphics();
    this.topBar.fillStyle(0x000000, 0.7);
    this.topBar.fillRect(0, 0, window.innerWidth, 205); 

    let timerTextPosition = window.innerWidth - 60
    let paragraphTextPosition = (window.innerWidth - timerTextPosition)/2

    this.paragraphText = this.add.text(60, verticalCenter, "quizModel.soal", {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      wordWrap: { width: textWidth },
      align: 'justify',
      fontStyle: 'bold'
    });
    this.paragraphText.setOrigin(0, 0.5);
    
    // add text for the timer (right column) floated right within the container
    this.timerWaktu = this.add.text(window.innerWidth - 60, verticalCenter - 10, 'Waktu', {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.timerWaktu.setOrigin(1, 1); // align right and center vertically

    // add text for the timer (right column) floated right within the container
    this.timerText = this.add.text(window.innerWidth - 78, verticalCenter + 60, TIME_LIMIT, {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(1, 1); // align right and center vertically

    this.player = new Player(this, this.bg.getCenter().x, this.bg.getCenter().y) ;
    this.player.start() ;
    
    this.foodManager = new FoodManager(this.physics.world, this) ;
    this.physics.add.collider(this.foodManager, undefined);
    
    this.physics.add.overlap(this.player, this.foodManager, (player, food) => this.eat(food, this.foodManager))

    this.loadQuiz() ;
  }

  restart(currentQuiz) {
    let timeInSeconds = TIME_LIMIT;

    this.timerInterval = setInterval(() => {
      timeInSeconds--; 

      this.timerText.setText(timeInSeconds.toString());

      if (timeInSeconds <= TIME_LIMIT * 1/4)
        this.timerText.setColor("#ff0000")
      else if (timeInSeconds <= TIME_LIMIT * 1/2) 
        this.timerText.setColor("#efa504")
      else 
        this.timerText.setColor("#ffffff")

      if (timeInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.onRoundFail();
      }
    }, 1000);
    this.foodManager.spawn(currentQuiz.jawaban) ;
    this.isAnswering = false ;
  }

  eat(food, foodManager) {
    if (!food.isDead && !this.isAnswering) {
      this.isAnswering = true ;
      let isWrong = this.quizModule.postAnswer(food.label) ;

      if (isWrong) 
        this.onWrongAnswer(food) ;
      else 
        this.onCorrectAnswer(food) ;

      this.isAnswering = false ;
    }
  }

  onCorrectAnswer(food) {
    playAnswerAnimation(this, food.x, food.y, 'correctAnim') ;
    playCorrectAudio(this) ;
    this.onRoundEnd() ;
  }

  onWrongAnswer(food) {
    playAnswerAnimation(this, food.x, food.y, 'wrongAnim') ;
    playWrongAudio(this) ;
    createHintBox(this, 0, window.innerHeight, this.quizModule.getHint()) ;
    food.kill() ;
  }

  onRoundFail() {
    this.quizModule.postAnswer("") ;
    this.onRoundEnd() ;
  }
  
  onRoundEnd() {
    clearInterval(this.timerInterval);
    this.foodManager.stop();
    animateClosingDoors(
      {
        scene: this,
        onCompleted: () => {
          this.showLoading() ;
          this.loadQuiz() ;
        }
      }
    ) ;
  }

  gameOver() {
    clearInterval(this.timerInterval);
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
