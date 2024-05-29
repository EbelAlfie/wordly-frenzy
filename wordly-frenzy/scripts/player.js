import {MOUSE_X_BUFFER, MOUSE_Y_BUFFER, WATER_FRICTION } from "./config/game_config.js"

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    mousePointer = null ;
    constructor (scene, x, y)
    {
        super(scene, x, y, 'player', 'right');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.play('right', true) ;

        this.setBounce(0.2, 0.2)
        this.setDrag(300, 300)
        this.setMaxVelocity(600, 600)
        this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(true);

        this.setScale(2);

        this.isAlive = true;

        this.speed = 500;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.isAlive = true;

        this.scene.input.once('pointermove', (pointer) =>
          {
              if (this.isAlive) this.mousePointer = pointer ;
          }
        );
    }

    stop ()
    {
        this.isAlive = false;

        this.body.stop();
    }

    preUpdate ()
    {
      this.move() ;
    }
    
    move() {
      let pointer = this.mousePointer ;
      if (pointer == null) return ; // || !this.isAlive
      let newPlayerVelocityX = this.body.velocity.x - WATER_FRICTION
      let newPlayerVelocityY = this.body.velocity.y - WATER_FRICTION


      if (newPlayerVelocityX < 0) newPlayerVelocityX = 0

      if (newPlayerVelocityY < 0) newPlayerVelocityY = 0


      if (pointer.x >= this.x + MOUSE_X_BUFFER) {

        this.flipX = true
        newPlayerVelocityX = 5 * (pointer.x - this.x) 

      }

      else if (pointer.x <= this.x - MOUSE_X_BUFFER) {

        newPlayerVelocityX = -5 * Math.abs(pointer.x - this.x)
        this.flipX = false

      }

      if (pointer.y >= this.y + MOUSE_Y_BUFFER) {

        newPlayerVelocityY = 5 * (pointer.y - this.y) 

      }

      else if (pointer.y <= this.y - MOUSE_Y_BUFFER) {

        newPlayerVelocityY = -5 * Math.abs(pointer.y - this.y) 

      }

      this.body.setVelocityX(newPlayerVelocityX)
      this.body.setVelocityY(newPlayerVelocityY)

    }
}
