import {MOUSE_X_BUFFER, MOUSE_Y_BUFFER, WATER_FRICTION } from "./config/game_config.js"

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        //this.play(config, 'move-player') ;

        this.setBounce(0.2, 0.2)
        this.setDrag(300, 300)
        this.setMaxVelocity(600, 600)
        this.setGravity(0, 450);

        this.setScale(2);

        this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(true);

        this.isAlive = true;

        this.speed = 600;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.isAlive = true;
        
        this.scene.input.on('pointermove', (pointer) =>
        {
            if (this.isAlive)
            {
                this.flipX = this.x <= pointer.x;
                this.scene.physics.moveToObject(this, pointer, this.speed) ;
                //this.move(pointer); 
                //this.setPosition(pointer.worldX, pointer.worldY);
                // this.setAccelerationX(pointer.x) ;
                // this.setAccelerationY(pointer.y) ;
            }
        });
    }

    stop ()
    {
        this.isAlive = false;

        this.body.stop();
    }

    preUpdate ()
    {
        if (this.body.speed > 0 && this.isAlive)
        {
            if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 6)
            {
                this.body.reset(this.target.x, this.target.y);
            }
        }
    }
    
      move(lockedToCamPointer) {
        let newPlayerVelocityX = this.body.velocity.x - WATER_FRICTION
        let newPlayerVelocityY = this.body.velocity.y - WATER_FRICTION


        if (newPlayerVelocityX < 0)
          newPlayerVelocityX = 0

        if (newPlayerVelocityY < 0)
          newPlayerVelocityY = 0


        if (lockedToCamPointer.x >= this.x + MOUSE_X_BUFFER) {

          this.flipX = true
          newPlayerVelocityX = (lockedToCamPointer.x - this.x) // playerFish.scale

        }

        else if (lockedToCamPointer.x <= this.x - MOUSE_X_BUFFER) {

          newPlayerVelocityX = -1 * Math.abs(lockedToCamPointer.x - this.x) // playerFish.scale
          this.flipX = false

        }

        if (lockedToCamPointer.y >= this.y + MOUSE_Y_BUFFER) {

          newPlayerVelocityY = (lockedToCamPointer.y - this.y) // playerFish.scale * 2

        }

        else if (lockedToCamPointer.y <= this.y - MOUSE_Y_BUFFER) {

          newPlayerVelocityY = -1 * Math.abs(lockedToCamPointer.y - this.y) // playerFish.scale * 2

        }

        this.body.setVelocityX(newPlayerVelocityX)
        this.body.setVelocityY(newPlayerVelocityY)

      }
}
