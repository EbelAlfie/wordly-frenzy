import { GameScene } from './game_scene.js'

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
