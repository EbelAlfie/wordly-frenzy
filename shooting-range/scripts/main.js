class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.targetTexts = ['Jawaban 1', 'Jawaban 2', 'Jawaban 3', 'Jawaban 4', 'Jawaban 5']; // predetermined texts
    this.targetTextMap = {}; // map to store target-text associations
  }

  preload() {
    this.load.image('background', 'assets/bg.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('target', 'assets/target.png');
  }

  create() {
    this.game.canvas.style.cursor = 'none'; // hide cursor

    this.bg = this.add.image(0, 0, 'background').setOrigin(0);
    this.updateBgSize();

    this.crosshair = this.physics.add.image(0, 0, 'crosshair');
    this.crosshair.setOrigin(0.5); // center origin
    this.crosshair.setDepth(1); // higher depth value (e.g., 1) to render on top

    // calculate responsive target positions
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    const targetPositions = [ // predetermined target positions
      { x: screenWidth * 0.15, y: screenHeight * 0.3 },
      { x: screenWidth * 0.3, y: screenHeight * 0.4 },
      { x: screenWidth * 0.5, y: screenHeight * 0.55 },
      { x: screenWidth * 0.65, y: screenHeight * 0.25 },
      { x: screenWidth * 0.85, y: screenHeight * 0.2 },
      { x: screenWidth * 0.7, y: screenHeight * 0.6 },
      { x: screenWidth * 0.2, y: screenHeight * 0.8 },
      { x: screenWidth * 0.8, y: screenHeight * 0.65 },
      { x: screenWidth * 0.75, y: screenHeight * 0.5 },
      { x: screenWidth * 0.55, y: screenHeight * 0.75 },
    ];

    const targetSizes = [ // predetermined target sizes
      { width: 40 },
      { width: 45 },
      { width: 50 },
      { width: 55 },
      { width: 60 },
      { width: 65 },
      { width: 70 },
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
    for (let i = 0; i < 5; i++) {
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
    }
  }

  onTargetHover(target) {
    const index = this.targetsGroup.getChildren().indexOf(target);
    const textToShow = this.targetTexts[index];

    // Show the text on hover
    const hoverText = this.add.text(target.x, target.y - 30, textToShow, { fontSize: '16px', fill: '#ffffff' });
    hoverText.setOrigin(0.5);
    hoverText.setDepth(1); // ensure text renders on top
    target.hoverText = hoverText; // store the hover text reference in the target object
  }

  onTargetHoverOut(target) {
    if (target.hoverText) {
      target.hoverText.destroy(); // destroy the hover text when mouse leaves the target
      delete target.hoverText; // remove hover text reference from the target object
    }
  }

  update() {
    this.crosshair.x = this.input.mousePointer.x;
    this.crosshair.y = this.input.mousePointer.y;
  }

  updateBgSize() {
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = this.bg.width / this.bg.height;

    if (windowAspectRatio > imageAspectRatio) {
      this.bg.displayWidth = window.innerWidth;
      this.bg.displayHeight = window.innerWidth / imageAspectRatio;
    } else {
      this.bg.displayHeight = window.innerHeight;
      this.bg.displayWidth = window.innerHeight * imageAspectRatio;
    }

    this.bg.x = (window.innerWidth - this.bg.displayWidth) / 2;
    this.bg.y = (window.innerHeight - this.bg.displayHeight) / 2;
  }

  onTargetClicked(target) {
    // destroy the target
    target.destroy();

    // check if the target has associated text
    const textToShow = this.targetTextMap[target];
    if (textToShow && target.hoverText) {
      // destroy the associated hover text
      target.hoverText.destroy();
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth, // 100% screen width
  height: window.innerHeight, // 100% screen height
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
