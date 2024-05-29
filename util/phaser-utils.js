export const updateBgSize = (image) => {
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

export const displayScore = (scene, soalBenar, score) => {
    // create a graphics object for the score box
    const scoreBox = scene.add.graphics();
    scoreBox.fillStyle(0x000000, 0.7);
    scoreBox.fillRect(0, scene.game.config.height / 2 - 100, scene.game.config.width, 200);

    // add text for the final score (left column)
    const scoreText = scene.add.text(40, scene.game.config.height / 2, `Pertanyaan yang terjawab benar dari sekali tembak: ${soalBenar}\nNilai anda: ${score}`, {
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

    const button1X = scene.game.config.width - buttonWidth - buttonSpacing - 280;
    const button1Y = scene.game.config.height / 2 - 25;

    const button2X = scene.game.config.width - buttonWidth - buttonSpacing - 20;
    const button2Y = scene.game.config.height / 2 - 25;

    // create button graphics for button 1
    const button1Graphics = scene.add.graphics();
    button1Graphics.fillStyle(0x3DB2FF, 1); // Red color
    button1Graphics.fillRoundedRect(button1X, button1Y, buttonWidth, buttonHeight, 25);
    button1Graphics.setInteractive(new Phaser.Geom.Rectangle(button1X, button1Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // add text on top of button 1 graphics
    const button1Text = scene.add.text(button1X + buttonWidth / 2, button1Y + buttonHeight / 2, 'Coba lagi', {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        align: 'center',
    });
    button1Text.setOrigin(0.5);

    // create button graphics for button 2
    const button2Graphics = scene.add.graphics();
    button2Graphics.fillStyle(0x8B22DE, 1); // Green color
    button2Graphics.fillRoundedRect(button2X, button2Y, buttonWidth, buttonHeight, 25);
    button2Graphics.setInteractive(new Phaser.Geom.Rectangle(button2X, button2Y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

    // add text on top of button 2 graphics
    const button2Text = scene.add.text(button2X + buttonWidth / 2, button2Y + buttonHeight / 2, 'Ke menu utama', {
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

export const createHintBox = (scene, x, y, hint) => {
    let hintText = scene.add.text(30, 30, '', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Poppins, Arial, sans-serif',
        wordWrap: { width: window.innerWidth * 0.28, useAdvancedWrap: true }, // enable advanced word wrapping
        align: 'left',
        fontStyle: 'bold',
    });
    hintText.setOrigin(0, 0);

    hintText.setText(hint);
    
    // get the text dimensions
    const textBounds = hintText.getBounds();

    // create a graphics object for the hint box based on text dimensions
    let hintBox = scene.add.graphics();
    hintBox.fillStyle(0x000000, 0.6);
    hintBox.fillRect(textBounds.x - 20, textBounds.y - 20, textBounds.width + 40, textBounds.height + 40);

    // make sure the hint box and text are grouped together
    let hintContainer = scene.add.container(x, y);
    hintContainer.add(hintBox);
    hintContainer.add(hintText);

    // resize the hint box to fit the text content dynamically
    hintContainer.setSize(textBounds.width + 20, textBounds.height + 20); // adjust padding as needed

    if (scene.first != false) {
      // set initial alpha value to 0 for fade-in effect
      hintContainer.alpha = 0;

      // add fade-in animation for the hint box and text
      scene.tweens.add({
          targets: [hintContainer, hintText],
          alpha: { value: 1, duration: 750 },
          delay: 300
      });
    }
  }

export const playCorrectAudio = (scene) => {
    let correctAudio = scene.sound.add('correct', {
        loop: false,
        volume: 0.3
    });

    correctAudio.play();
  }

export const playWrongAudio = (scene) => {
    let wrongAudio = scene.sound.add('wrong', {
        loop: false,
        volume: 0.3
    });

    wrongAudio.play();
  }

export const playAnswerAnimation = (scene, x, y, label) => {
    const sprite = scene.add.sprite(x, y, label);
    sprite.setScale(0); // Start with scale 0 to make it invisible initially

    // Add a scale animation to make the "X" appear with a bounce effect
    scene.tweens.add({
        targets: sprite,
        scaleX: 0.3,
        scaleY: 0.3,
        duration: 500, // Animation duration in milliseconds
        ease: 'Back', // Easing type for the bounce effect
        onComplete: () => {
            // Fade out the "X" sprite after appearing
            scene.tweens.add({
                targets: sprite,
                delay: 350,
                alpha: 0, // Fade out to transparency
                duration: 500, // Fade-out duration
                onComplete: () => {
                    sprite.destroy(); // Remove the "X" sprite after fading out
                },
            });
        },
    });
  }

function reverseClosingDoors(scene, door) {
    scene.tweens.add({
        targets: door,
        y: -scene.game.config.height,
        duration: 1600,
        ease: 'Expo.easeInOut',
        onComplete: () => {
            door.destroy();
        }
    });
}

export const animateClosingDoors = (config) => {
    let scene = config.scene;
    const door = scene.add.rectangle(0, - scene.game.config.height, scene.game.config.width, scene.game.config.height, 0xffffff);
    door.setOrigin(0);
    door.setDepth(2);

    scene.tweens.add({
      targets: door,
      y: 0,
      duration: 1600,
      delay: 85,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        scene.time.delayedCall(1000, () => {
          reverseClosingDoors(scene, door);
        });
      }
    });

    const doorPurple = scene.add.rectangle(0, - scene.game.config.height, scene.game.config.width, scene.game.config.height, 0x8B22DE);
    doorPurple.setOrigin(0);
    doorPurple.setDepth(1.99);

    scene.tweens.add({
      targets: doorPurple,
      y: 0,
      duration: 1600,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        scene.time.delayedCall(1170, () => {
            config.onCompleted() ;
            reverseClosingDoors(scene, doorPurple);
        });
      }
    });
  }

function reverseTextAnimation(scene, text) {
    scene.tweens.add({
        targets: text,
        y: -100,
        duration: 1300,
        ease: 'Expo.easeInOut',
    });
}

export const animateTextLoading = (scene, title, content) => {
    function changeText(textObject, newText) {
      textObject.setText(newText);
    }

    const textBenar = scene.add.text(scene.game.config.width / 2, -100, title, {
      fontSize: '48px',
      fill: '#000000',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontWeight: 'bold'
    });
    textBenar.setOrigin(0.5);
    textBenar.setDepth(2.01);

    const text = scene.add.text(scene.game.config.width / 2, -100, 'Your Text', {
      fontSize: '24px',
      fill: '#000000',
      fontFamily: 'Poppins, Arial, sans-serif',
      fontWeight: 'bold'
    });
    text.setOrigin(0.5);
    text.setDepth(2.01);

    // call the changeText function to change the text content immediately
    changeText(text, content);

    scene.tweens.add({
      targets: text,
      y: scene.game.config.height / 2 + 30,
      duration: 1300,
      delay: 420,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        scene.time.delayedCall(850, () => {
          reverseTextAnimation(scene, text);
        });
      }
    });

    scene.tweens.add({
      targets: textBenar,
      y: scene.game.config.height / 2 - 30,
      duration: 1300,
      delay: 485,
      ease: 'Expo.easeInOut',
      onComplete: () => {
        scene.time.delayedCall(690, () => {
          reverseTextAnimation(scene, textBenar);
        });
      }
    });
  }