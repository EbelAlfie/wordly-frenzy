import {MOUSE_X_BUFFER, MOUSE_Y_BUFFER, WATER_FRICTION } from "./config/game_config.js"

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene.anims.create({
          key: 'move-player',
          frames: this.scene.anims.generateFrameNames('player', { start: 0, end: 9 }),
          frameRate: 8,
          repeat: -1,
        });

        this.play('move-player') ;

        this.setScale(2);

        this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(true);

        this.isAlive = false;

        this.speed = 300;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.isAlive = true;
        
        this.scene.input.on('pointermove', (pointer) =>
        {
            if (this.isAlive)
            {
                this.target.x = pointer.x;
                this.target.y = pointer.y;
                this.move(pointer); 
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
    
    move(pointer) {
        if (this.body && pointer !== null) {
  
          const lockedToCamPointer = pointer.positionToCamera(this.scene.cameras.main)
    
          let newPlayerVelocityX = this.body.velocity.x - WATER_FRICTION
          let newPlayerVelocityY = this.body.velocity.y - WATER_FRICTION
    
    
          if (newPlayerVelocityX < 0) newPlayerVelocityX = 0
    
          if (newPlayerVelocityY < 0) newPlayerVelocityY = 0
    
          if (lockedToCamPointer.x >= this.x + MOUSE_X_BUFFER) {
    
            this.flipX = false
            newPlayerVelocityX = (lockedToCamPointer.x - this.x) / this.scale
    
          }
    
          else if (lockedToCamPointer.x <= this.x - MOUSE_X_BUFFER) {
    
            newPlayerVelocityX = -1 * Math.abs(lockedToCamPointer.x - this.x) / this.scale
            this.flipX = true
    
          }
    
          if (lockedToCamPointer.y >= this.y + MOUSE_Y_BUFFER) {
    
            newPlayerVelocityY = (lockedToCamPointer.y - this.y) / this.scale * 2
    
          }
    
          else if (lockedToCamPointer.y <= this.y - MOUSE_Y_BUFFER) {
    
            newPlayerVelocityY = -1 * Math.abs(lockedToCamPointer.y - this.y) / this.scale * 2
    
          }
    
          this.body.setVelocityX(newPlayerVelocityX)
          this.body.setVelocityY(newPlayerVelocityY)
        }
      }
    
}
