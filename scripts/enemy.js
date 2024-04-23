export class Enemy extends Phaser.Physics.Arcade.Image {
    isChasing = true ;
    
    constructor (scene, x, y, speed)
    {
        super(scene, x, y, 'enemy');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.setScale(0.9);

        this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(false);

        this.speed = speed;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 2000,
            ease: 'Linear',
            flipX: true, 
            onComplete: () => {
                if (this.scene.player.isAlive)
                {
                    this.lifespan = Phaser.Math.RND.between(6000, 12000);
                    this.isChasing = true;
                }
            }
        });
    }

    kill ()
    {
        this.isAlive = false;

        this.body.stop();
    }

    preUpdate ()
    {
        let playerTarget = this.scene.getPlayerLocation(this.target);
        this.setFlipX(this.x > playerTarget.x) ;
        this.scene.physics.moveToObject(this, playerTarget, this.speed) + 1.5707963267948966;
    }
}