export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.targetTexts = []; // texts array for answer
    this.targetTextMap = {}; // map to store target-text associations
    this.question = ''; // variable to store the question text
    this.correctAnswer = '';
    this.currentQuestionIndex = 0; // question index for current level
    this.totalQuestion = '';
    this.score = 0;
    this.first = true;
    this.bottomBar = '';
    this.paragraphText = '';
    this.timerText = '';
    this.timerWaktu = '';
    this.timerInterval = '';
    this.background = null;
    this.hintText = null;
    this.hitBox = null;
    this.loadingText = null;
  }

  preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('background_red', 'assets/bg_red.png');
    this.load.image('background_red_blur', 'assets/bg_red_blur.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('target', 'assets/target.png');
    this.load.css('google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');

    // load the question and answer from a JSON file
    this.load.json('gameData', 'scripts/game_data.json');

    // load audio
    this.load.audio('backgroundMusic', '../asset/frenzy.mp3');
    this.load.audio('correct', '../asset/correct.mp3');
    this.load.audio('wrong', '../asset/wrong.mp3');

    this.load.image('xImage', 'assets/X.png');
    this.load.image('correctImage', 'assets/correct.png');
  }

  playBackgroundMusic() {
    this.backgroundMusic = this.sound.add('backgroundMusic', {
        loop: true, // loop the music
        volume: 0.3 // set volume level (0 to 1)
    });

    this.backgroundMusic.play();
  }

  playCorrectAudio() {
    this.correctAudio = this.sound.add('correct', {
        loop: false,
        volume: 0.3
    });

    this.correctAudio.play();
  }

  playWrongAudio() {
    this.wrongAudio = this.sound.add('wrong', {
        loop: false,
        volume: 0.3
    });

    this.wrongAudio.play();
  }

  updateTargetTexts() {
    this.first = true;

    const gameData = this.cache.json.get('gameData');
    const levelData = gameData[this.currentQuestionIndex];

    // update target texts and correct answer for the current level
    this.targetTexts = levelData.targetTexts;
    this.question = levelData.question;
    this.correctAnswer = levelData.correctAnswer;
    this.hint = levelData.hint; // get the hint for the current level

    // calculate responsive target positions
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    const targetPositions = [ // predetermined target positions
      { x: screenWidth * 0.25, y: screenHeight * 0.3 },
      { x: screenWidth * 0.3, y: screenHeight * 0.4 },
      { x: screenWidth * 0.5, y: screenHeight * 0.55 },
      { x: screenWidth * 0.6, y: screenHeight * 0.25 },
      { x: screenWidth * 0.75, y: screenHeight * 0.2 },
      { x: screenWidth * 0.7, y: screenHeight * 0.6 },
      { x: screenWidth * 0.2, y: screenHeight * 0.65 },
      { x: screenWidth * 0.4, y: screenHeight * 0.45 },
      { x: screenWidth * 0.65, y: screenHeight * 0.5 },
      { x: screenWidth * 0.55, y: screenHeight * 0.15 },
    ];

    const targetSizes = [ // predetermined target sizes
      { width: 45 },
      { width: 50 },
      { width: 55 },
      { width: 60 },
      { width: 65 },
      { width: 70 },
      { width: 75 },
      { width: 80 },
      { width: 90 },
      { width: 100 },
    ];

    // shuffle the arrays to randomize order
    Phaser.Utils.Array.Shuffle(targetPositions);
    Phaser.Utils.Array.Shuffle(targetSizes);

    // select 5 non-duplicate targets
    const selectedPositions = targetPositions.slice(0, 5);
    const selectedSizes = targetSizes.slice(0, 5);

    // enable physics and create targets group
    this.targetsGroup = this.physics.add.group();

    // create targets using selected positions and sizes
    for (let i = 0; i < this.targetTexts.length; i++) {
      const target = this.physics.add.sprite(selectedPositions[i].x, selectedPositions[i].y, 'target');
      const aspectRatio = target.width / target.height;
      const height = selectedSizes[i].width / aspectRatio;
      target.setScale(selectedSizes[i].width / target.width, height / target.height);

      // add the target to the physics group
      this.targetsGroup.add(target);

      // add input events to targets
      target.setInteractive();
      target.on('pointerdown', () => this.onTargetClicked(target));
      
      // add hover event to show text
      target.on('pointerover', () => this.onTargetHover(target));
      target.on('pointerout', () => this.onTargetHoverOut(target));

      // store target-text association
      this.targetTextMap[target] = this.targetTexts[i];
      target.hoverText = null; // initialize hoverText property

      // create hover text for each target
      this.createHoverText(target);

      target.text = this.targetTexts[i]; // set the text property for the target

      target.setDepth(0.99); // adjust the depth value as needed
    }

    const targets = this.targetsGroup.getChildren();
    const texts = targets.map(target => target.hoverText).filter(text => text);

    targets.forEach((target, index) => {
      const delay = index * 150;

      this.tweens.add({
        targets: target,
        y: target.y + 10,
        duration: 1000,
        delay: delay,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const text = texts[index]; // retrieve the text associated with the target
      if (text) { // check if the text exists
        this.tweens.add({
          targets: text,
          y: text.y + 10,
          duration: 1000,
          delay: delay,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    });

    // calculate the width for text and time columns
    const textWidth = window.innerWidth * 0.9 - 120; // 90% width minus padding and time column width
    const timeWidth = window.innerWidth * 0.1;

    // create a graphics object for the bottom bar
    this.bottomBar = this.add.graphics();
    this.bottomBar.fillStyle(0x000000, 0.7); // black color with 80% opacity
    this.bottomBar.fillRect(0, window.innerHeight - 205, window.innerWidth, 205); // 120px height, spans entire width

    // calculate the vertical position for centering text vertically
    const verticalCenter = window.innerHeight - 160 + 60; // center vertically within the 120px height bar

    // add text for the paragraph (left column) with multiple lines and wrapping, centered vertically
    this.paragraphText = this.add.text(60, verticalCenter, this.question, {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      wordWrap: { width: textWidth },
      align: 'justify',
      fontStyle: 'bold',
    });
    this.paragraphText.setOrigin(0, 0.5); // align left and center vertically

    // add text for the timer (right column) floated right within the container
    this.timerWaktu = this.add.text(window.innerWidth - 60, window.innerHeight - 160 + 29, 'Waktu', {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.timerWaktu.setOrigin(1, 0.5); // align right and center vertically

    // add text for the timer (right column) floated right within the container
    this.timerText = this.add.text(window.innerWidth - 78, window.innerHeight - 160 + 82, '60', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(1, 0.5); // align right and center vertically

    // set the initial time in seconds
    let timeInSeconds = 60;

    // update the timer text every second using setInterval
    this.timerInterval = setInterval(() => {
      timeInSeconds--; // Decrement the time by 1 second

      // update the timer text
      this.timerText.setText(timeInSeconds.toString());

      // check if the time has reached zero
      if (timeInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.loadingText = 'Waktumu habis..';
        this.first = false;
        this.handleCorrectAnswer();
      }
    }, 1000); // update the timer every second (1000 milliseconds)
  }
  
  create() {
    const gameData = this.cache.json.get('gameData');
    this.totalQuestion = Object.keys(gameData).length;

    this.game.canvas.style.cursor = 'none'; // hide cursor

    this.bg = this.add.image(0, 0, 'background').setOrigin(0);
    this.updateBgSize(this.bg);

    this.crosshair = this.physics.add.image(0, 0, 'crosshair');
    this.crosshair.setOrigin(0.5); // center origin
    this.crosshair.setDepth(3); // higher depth value (e.g., 1) to render on top

    this.updateTargetTexts();

    this.playBackgroundMusic();
  }

  createHintBox() {
    this.hintText = this.add.text(30, 30, '', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        wordWrap: { width: window.innerWidth * 0.28, useAdvancedWrap: true }, // enable advanced word wrapping
        align: 'left',
        fontStyle: 'bold',
    });
    this.hintText.setOrigin(0, 0);

    this.hintText.setText(this.hint);
    
    // get the text dimensions
    const textBounds = this.hintText.getBounds();

    // create a graphics object for the hint box based on text dimensions
    this.hintBox = this.add.graphics();
    this.hintBox.fillStyle(0x000000, 0.6);
    this.hintBox.fillRect(textBounds.x - 20, textBounds.y - 20, textBounds.width + 40, textBounds.height + 40);

    // make sure the hint box and text are grouped together
    this.hintContainer = this.add.container(20, 20);
    this.hintContainer.add(this.hintBox);
    this.hintContainer.add(this.hintText);

    // resize the hint box to fit the text content dynamically
    this.hintContainer.setSize(textBounds.width + 20, textBounds.height + 20); // adjust padding as needed

    if (this.first != false) {
      // set initial alpha value to 0 for fade-in effect
      this.hintContainer.alpha = 0;

      // add fade-in animation for the hint box and text
      this.tweens.add({
          targets: [this.hintContainer, this.hintText],
          alpha: { value: 1, duration: 750 },
          delay: 300
      });
    }
  }




  loadBackgroundImage() {
    if (!this.background) {
      this.background = this.add.image(0, 0, 'background_red').setOrigin(0);
      this.updateBgSize(this.background);
    }
  }

  createHoverText(target) {
    const index = this.targetsGroup.getChildren().indexOf(target);
    const textToShow = this.targetTexts[index]; // get the text corresponding to the target

    // calculate the vertical offset based on the scaled height of the target
    const scaledHeight = target.displayHeight * target.scaleY;
    const yOffset = scaledHeight / 2 + 30; // adjust the offset as needed

    // create the hover text with initial opacity set to 0 (invisible)
    const hoverText = this.add.text(target.x, target.y - yOffset, textToShow, { 
      fontSize: '16px', 
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
      fontSize: 18,
      align: 'center',
      alpha: 0,
    });
    hoverText.setOrigin(0.5);
    hoverText.setDepth(1);
    hoverText.setVisible(false); // initially invisible

    // create a fade-in tween for the hover text
    this.tweens.add({
      targets: hoverText,
      alpha: 1, // fade from 0 (invisible) to 1 (fully visible)
      duration: 500, // duration of the fade-in animation in milliseconds
    });

    // store the hover text reference in the target object
    target.hoverText = hoverText;

    // update the targetTextMap with the correct association
    this.targetTextMap[target] = textToShow;
  }

  onTargetHover(target) {
    const hoverText = target.hoverText;
    if (hoverText) {
      hoverText.alpha = 1;
      hoverText.visible = true;
    }
  }

  onTargetHoverOut(target) {
    const hoverText = target.hoverText;
    if (hoverText) {
      if (hoverText.visible) {
        // if the hover text is currently visible, fade out with a shorter duration
        this.tweens.add({
          targets: hoverText,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            hoverText.visible = false;
          }
        });
      } else {
        // if the hover text is not visible, simply hide it
        hoverText.visible = false;
      }
    }
  }

  update() {
    this.crosshair.x = this.input.mousePointer.x;
    this.crosshair.y = this.input.mousePointer.y;
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

  onTargetClicked(target) {
    const textToShow = target.text; // get the text directly from the clicked target

    if (textToShow === this.correctAnswer) {
      this.loadingText = 'Jawabanmu benar!';
      this.handleCorrectAnswer();
      this.playCorrectAnimation(target.x, target.y);
    } else {
      this.handleIncorrectAnswer();
      this.playXAnimation(target.x, target.y);
    }

    // destroy the target
    target.destroy();

    // check if the target has associated text
    if (textToShow && target.hoverText) {
      // destroy the associated hover text
      target.hoverText.destroy();
    }
  }

  playXAnimation(x, y) {
    const xSprite = this.add.sprite(x, y, 'xImage');
    xSprite.setScale(0); // Start with scale 0 to make it invisible initially

    // Add a scale animation to make the "X" appear with a bounce effect
    this.tweens.add({
        targets: xSprite,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 500, // Animation duration in milliseconds
        ease: 'Back', // Easing type for the bounce effect
        onComplete: () => {
            // Fade out the "X" sprite after appearing
            this.tweens.add({
                targets: xSprite,
                delay: 350,
                alpha: 0, // Fade out to transparency
                duration: 500, // Fade-out duration
                onComplete: () => {
                    xSprite.destroy(); // Remove the "X" sprite after fading out
                },
            });
        },
    });
  }

  playCorrectAnimation(x, y) {
    const xSprite = this.add.sprite(x, y, 'correctImage');
    xSprite.setScale(0); // Start with scale 0 to make it invisible initially

    // Add a scale animation to make the "X" appear with a bounce effect
    this.tweens.add({
        targets: xSprite,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 500, // Animation duration in milliseconds
        ease: 'Back', // Easing type for the bounce effect
        onComplete: () => {
            // Fade out the "X" sprite after appearing
            this.tweens.add({
                targets: xSprite,
                delay: 350,
                alpha: 0, // Fade out to transparency
                duration: 500, // Fade-out duration
                onComplete: () => {
                    xSprite.destroy(); // Remove the "X" sprite after fading out
                },
            });
        },
    });
  }

  handleCorrectAnswer() {
    this.playCorrectAudio();

    // animate closing doors
    this.animateClosingDoors();
    this.animateTextLoading();

    // calculate score
    if (this.first == true) {
      this.addScore();
    } else {
      this.first = false;
    }

    // hide all targets, texts, and bottom bar instantly on correct answer
    this.hideGameElements();
    
    this.time.delayedCall(3000, () => {
        // check if it's past halfway point to change to a new background
        if (this.currentQuestionIndex >= this.totalQuestion / 2 - 1) {
          // change the background assets
          this.loadBackgroundImage();
        }

        this.currentQuestionIndex++;

        const gameData = this.cache.json.get('gameData');
        if (this.currentQuestionIndex < gameData.length) {
          this.bottomBar.destroy();
          this.paragraphText.destroy();
          this.timerText.destroy();
          clearInterval(this.timerInterval);
          this.updateTargetTexts();
          if (this.hintBox && this.hintBox.visible) {
            this.hintBox.setVisible(false);
          }
          
          if (this.hintText && this.hintText.visible) {
            this.hintText.setVisible(false);
          }
        } else {
          this.bottomBar.destroy();
          this.paragraphText.destroy();
          this.timerText.destroy();
          clearInterval(this.timerInterval);
        }
        
        if (this.currentQuestionIndex == this.totalQuestion) {
          this.displayScore();
        }
    });
  }

  handleIncorrectAnswer() {
    this.playWrongAudio();

    if (this.first == false){
      // display the hint
      this.hintBox.setVisible(false);
      this.hintText.setVisible(false);
    }

    this.createHintBox();
    this.first = false;
  }

  animateClosingDoors() {
    const door = this.add.rectangle(0, -this.game.config.height, this.game.config.width, this.game.config.height, 0xffffff);
    door.setOrigin(0);
    door.setDepth(2);

    this.tweens.add({
      targets: door,
      y: 0,
      duration: 1600,
      delay: 85,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.reverseClosingDoors(door);
        });
      }
    });

    const doorPurple = this.add.rectangle(0, -this.game.config.height, this.game.config.width, this.game.config.height, 0x8B22DE);
    doorPurple.setOrigin(0);
    doorPurple.setDepth(1.99);

    this.tweens.add({
      targets: doorPurple,
      y: 0,
      duration: 1600,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        this.time.delayedCall(1170, () => {
          this.reverseClosingDoors(doorPurple);
        });
      }
    });
  }

  reverseClosingDoors(door) {
    this.tweens.add({
      targets: door,
      y: -this.game.config.height,
      duration: 1600,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        door.destroy();
      }
    });
  }

  animateTextLoading() {
    function changeText(textObject, newText) {
      textObject.setText(newText);
    }

    const textBenar = this.add.text(this.game.config.width / 2, -100, this.loadingText, {
      fontSize: '48px',
      fill: '#000000',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontWeight: 'bold'
    });
    textBenar.setOrigin(0.5);
    textBenar.setDepth(2.01);

    const text = this.add.text(this.game.config.width / 2, -100, 'Your Text', {
      fontSize: '24px',
      fill: '#000000',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontWeight: 'bold'
    });
    text.setOrigin(0.5);
    text.setDepth(2.01);

    // call the changeText function to change the text content immediately
    changeText(text, (this.currentQuestionIndex + 1) + ' dari ' + this.totalQuestion + ' soal terjawab');

    this.tweens.add({
      targets: text,
      y: this.game.config.height / 2 + 30,
      duration: 1300,
      delay: 420,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        this.time.delayedCall(850, () => {
          this.reverseTextAnimation(text);
        });
      }
    });

    this.tweens.add({
      targets: textBenar,
      y: this.game.config.height / 2 - 30,
      duration: 1300,
      delay: 485,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        this.time.delayedCall(690, () => {
          this.reverseTextAnimation(textBenar);
        });
      }
    });
  }

  reverseTextAnimation(text) {
    this.tweens.add({
      targets: text,
      y: -100,
      duration: 1300,
      ease: 'Expo.easeInOut',
    });
  }

  addScore() {
    // first shot right answer grant this.score + 1
    this.score+=1;
    return this.score;
  }

  displayScore() {
    this.background = this.add.image(0, 0, 'background_red_blur').setOrigin(0);
    this.updateBgSize(this.background);
    
    const finalScore = ((this.score / this.totalQuestion) * 100).toFixed(0);

    // create a graphics object for the score box
    const scoreBox = this.add.graphics();
    scoreBox.fillStyle(0x000000, 0.7);
    scoreBox.fillRect(0, this.game.config.height / 2 - 100, this.game.config.width, 200);

    // add text for the final score (left column)
    const scoreText = this.add.text(40, this.game.config.height / 2, `Pertanyaan yang terjawab benar dari sekali tembak: ${this.score}\nNilai anda: ${finalScore}`, {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'left',
        fontFamily: 'Poppins, Arial, sans-serif',
        lineSpacing: 10,
    });
    scoreText.setOrigin(0, 0.5); // align left and center vertically

    // Add buttons (right column)
    const buttonSpacing = 20;
    const buttonWidth = 220;
    const buttonHeight = 50;

    const button1X = this.game.config.width - buttonWidth - buttonSpacing - 280;
    const button1Y = this.game.config.height / 2 - 25;

    const button2X = this.game.config.width - buttonWidth - buttonSpacing - 20;
    const button2Y = this.game.config.height / 2 - 25;

    // create button graphics for button 1
    const button1Graphics = this.add.graphics();
    button1Graphics.fillStyle(0x3DB2FF, 1); // Red color
    button1Graphics.fillRoundedRect(button1X, button1Y, buttonWidth, buttonHeight, 25);
    button1Graphics.setInteractive(new Phaser.Geom.Rectangle(button1X, button1Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // add text on top of button 1 graphics
    const button1Text = this.add.text(button1X + buttonWidth / 2, button1Y + buttonHeight / 2, 'Coba lagi', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        align: 'center',
    });
    button1Text.setOrigin(0.5);

    // create button graphics for button 2
    const button2Graphics = this.add.graphics();
    button2Graphics.fillStyle(0x8B22DE, 1); // Green color
    button2Graphics.fillRoundedRect(button2X, button2Y, buttonWidth, buttonHeight, 25);
    button2Graphics.setInteractive(new Phaser.Geom.Rectangle(button2X, button2Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // add text on top of button 2 graphics
    const button2Text = this.add.text(button2X + buttonWidth / 2, button2Y + buttonHeight / 2, 'Ke menu utama', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        align: 'center',
    });
    button2Text.setOrigin(0.5);

    // Add pointer events for button 1
    button1Graphics.on('pointerdown', () => {
      window.location.reload();
    });

    // Add pointer events for button 2
    button2Graphics.on('pointerdown', () => {
      window.location.href = "../index.html";
    });
  }

  hideGameElements() {
    // clear and destroy all targets in the targetsGroup
    if (this.targetsGroup) {
      this.targetsGroup.clear(true, true);
      this.targetsGroup = null; // Reset targetsGroup
    }

    // hide all hover texts associated with targets and remove targets with matching text
    if (this.targetsGroup) {
      const targets = this.targetsGroup.getChildren();
      targets.forEach(target => {
        if (target.hoverText) {
          target.hoverText.destroy();
          target.hoverText = null; // clear the hoverText property
        }

        // check if the target's text matches any text from the JSON data
        if (this.targetTexts.includes(target.text)) {
          target.destroy();
        }
      });
    }
  }
}