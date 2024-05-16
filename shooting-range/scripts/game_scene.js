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
    this.timerInterval = '';
    this.background = null;
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
  }

  updateTargetTexts() {
    this.first = true;

    const gameData = this.cache.json.get('gameData');
    const levelData = gameData[this.currentQuestionIndex];

    // Update target texts and correct answer for the current level
    this.targetTexts = levelData.targetTexts;
    this.question = levelData.question;
    this.correctAnswer = levelData.correctAnswer;

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

      // Create hover text for each target
      this.createHoverText(target);

      target.text = this.targetTexts[i]; // Set the text property for the target

      target.setDepth(0.99); // Adjust the depth value as needed
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

      const text = texts[index]; // Retrieve the text associated with the target
      if (text) { // Check if the text exists
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

    // Calculate the width for text and time columns
    const textWidth = window.innerWidth * 0.9 - 120; // 90% width minus padding and time column width
    const timeWidth = window.innerWidth * 0.1;

    // Create a graphics object for the bottom bar
    this.bottomBar = this.add.graphics();
    this.bottomBar.fillStyle(0x000000, 0.7); // Black color with 80% opacity
    this.bottomBar.fillRect(0, window.innerHeight - 205, window.innerWidth, 205); // 120px height, spans entire width

    // Calculate the vertical position for centering text vertically
    const verticalCenter = window.innerHeight - 160 + 60; // Center vertically within the 120px height bar

    // Add text for the paragraph (left column) with multiple lines and wrapping, centered vertically
    this.paragraphText = this.add.text(60, verticalCenter, this.question, {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      wordWrap: { width: textWidth },
      align: 'left',
      fontStyle: 'bold',
    });
    this.paragraphText.setOrigin(0, 0.5); // Align left and center vertically

    // Add text for the timer (right column) floated right within the container
    this.timerText = this.add.text(window.innerWidth - 60, window.innerHeight - 160 + 65, '100', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
    });
    this.timerText.setOrigin(1, 0.5); // Align right and center vertically

    // Set the initial time in seconds
    let timeInSeconds = 100;

    // Update the timer text every second using setInterval
    this.timerInterval = setInterval(() => {
      timeInSeconds--; // Decrement the time by 1 second

      // Update the timer text
      this.timerText.setText(timeInSeconds.toString());

      // Check if the time has reached zero
      if (timeInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.first = false;
        this.handleCorrectAnswer();
      }
    }, 1000); // Update the timer every second (1000 milliseconds)
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
  }

  loadBackgroundImage() {
    if (!this.background) {
      this.background = this.add.image(0, 0, 'background_red').setOrigin(0);
      this.updateBgSize(this.background);
    }
  }

  createHoverText(target) {
    const index = this.targetsGroup.getChildren().indexOf(target);
    const textToShow = this.targetTexts[index]; // Get the text corresponding to the target

    // Calculate the vertical offset based on the scaled height of the target
    const scaledHeight = target.displayHeight * target.scaleY;
    const yOffset = scaledHeight / 2 + 30; // Adjust the offset as needed

    // Create the hover text with initial opacity set to 0 (invisible)
    const hoverText = this.add.text(target.x, target.y - yOffset, textToShow, { 
      fontSize: '16px', 
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      fontFamily: 'Poppins, Arial, sans-serif',
      fontStyle: 'bold',
      fontSize: 18,
      align: 'center', // Center-align the text
      alpha: 0, // Initial opacity set to 0 for fade-in effect
    });
    hoverText.setOrigin(0.5);
    hoverText.setDepth(1); // Ensure text renders on top
    hoverText.setVisible(false); // Initially invisible

    // Create a fade-in tween for the hover text
    this.tweens.add({
      targets: hoverText,
      alpha: 1, // Fade from 0 (invisible) to 1 (fully visible)
      duration: 500, // Duration of the fade-in animation in milliseconds
    });

    // Store the hover text reference in the target object
    target.hoverText = hoverText;

    // Update the targetTextMap with the correct association
    this.targetTextMap[target] = textToShow;
  }

  onTargetHover(target) {
    const hoverText = target.hoverText;
    if (hoverText) {
      hoverText.alpha = 1;
      hoverText.visible = true; // Ensure the hover text is visible
    }
  }

  onTargetHoverOut(target) {
    const hoverText = target.hoverText;
    if (hoverText) {
      if (hoverText.visible) {
        // If the hover text is currently visible, fade out with a shorter duration
        this.tweens.add({
          targets: hoverText,
          alpha: 0,
          duration: 250, // Shorter duration for quicker fade-out
          onComplete: () => {
            hoverText.visible = false; // Hide the hover text after fade-out
          }
        });
      } else {
        // If the hover text is not visible, simply hide it
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
      console.log('Correct Answer!');
      this.handleCorrectAnswer();
    } else {
      console.log('Incorrect Answer!');
      this.handleIncorrectAnswer();
    }

    // destroy the target
    target.destroy();

    // check if the target has associated text
    if (textToShow && target.hoverText) {
      // destroy the associated hover text
      target.hoverText.destroy();
    }
  }

  handleCorrectAnswer() {
    // animate closing doors
    this.animateClosingDoors();
    this.animateTextLoading();

    // calculate score
    if (this.first == true) {
      this.addScore();
    } else {
      this.first = false;
    }
    
    this.time.delayedCall(3000, () => {
        // hide all targets, texts, and bottom bar
        this.hideGameElements();

        // Check if it's past halfway point to change to a new background
        if (this.currentQuestionIndex >= this.totalQuestion / 2 - 1) {
          // Change the background assets
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
      y: this.game.config.height / 2,
      duration: 1300,
      delay: 420,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        this.time.delayedCall(850, () => {
          this.reverseTextAnimation(text);
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

    // Create a graphics object for the score box
    const scoreBox = this.add.graphics();
    scoreBox.fillStyle(0x000000, 0.7); // Black color with 70% opacity
    scoreBox.fillRect(0, this.game.config.height / 2 - 100, this.game.config.width, 200); // 200px height, spans entire width

    let rating = '';

    if (finalScore == 100) {
      rating = 'S';
    } else if (finalScore >= 90 && finalScore < 100) {
      rating = 'A';
    } else if (finalScore >= 80 && finalScore < 90) {
      rating = 'B+';
    } else if (finalScore >= 70 && finalScore < 80) {
      rating = 'B';
    } else if (finalScore >= 60 && finalScore < 70) {
      rating = 'C+';
    } else if (finalScore >= 50 && finalScore < 60) {
      rating = 'C';
    } else if (finalScore < 50) {
      rating = 'D';
    }

    // Add text for the final score (left column)
    const scoreText = this.add.text(40, this.game.config.height / 2, `Pertanyaan yang terjawab benar dari sekali tembak: ${this.score}\nNilai anda: ${finalScore}\nRating anda: ${rating}`, {
        fontSize: '24px',
        fill: '#ffffff',
        align: 'left',
        fontFamily: 'Poppins, Arial, sans-serif',
        lineSpacing: 10,
    });
    scoreText.setOrigin(0, 0.5); // Align left and center vertically

    // Add buttons (right column)
    const buttonSpacing = 20; // Space between buttons
    const buttonWidth = 220; // Width of each button
    const buttonHeight = 50; // Height of each button

    const button1X = this.game.config.width - buttonWidth - buttonSpacing - 280; // Adjust position with spacing
    const button1Y = this.game.config.height / 2 - 25; // Centered vertically

    const button2X = this.game.config.width - buttonWidth - buttonSpacing - 20; // Adjust position with spacing
    const button2Y = this.game.config.height / 2 - 25; // Centered vertically

    // Create button graphics for button 1
    const button1Graphics = this.add.graphics();
    button1Graphics.fillStyle(0x3DB2FF, 1); // Red color
    button1Graphics.fillRoundedRect(button1X, button1Y, buttonWidth, buttonHeight, 25); // Rounded rectangle with border radius 10
    button1Graphics.setInteractive(new Phaser.Geom.Rectangle(button1X, button1Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // Add text on top of button 1 graphics
    const button1Text = this.add.text(button1X + buttonWidth / 2, button1Y + buttonHeight / 2, 'Coba lagi', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        align: 'center',
    });
    button1Text.setOrigin(0.5); // Center align text within the button

    // Create button graphics for button 2
    const button2Graphics = this.add.graphics();
    button2Graphics.fillStyle(0x8B22DE, 1); // Green color
    button2Graphics.fillRoundedRect(button2X, button2Y, buttonWidth, buttonHeight, 25); // Rounded rectangle with border radius 10
    button2Graphics.setInteractive(new Phaser.Geom.Rectangle(button2X, button2Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // Add text on top of button 2 graphics
    const button2Text = this.add.text(button2X + buttonWidth / 2, button2Y + buttonHeight / 2, 'Ke menu utama', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        align: 'center',
    });
    button2Text.setOrigin(0.5); // Center align text within the button

    // Add pointer events for button 1
    button1Graphics.on('pointerdown', () => {
        console.log('Button 1 clicked');
    });

    // Add pointer events for button 2
    button2Graphics.on('pointerdown', () => {
        console.log('Button 2 clicked');
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