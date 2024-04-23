export class Food extends Phaser.Physics.Arcade.Sprite {
    isDead = false ;
    
    constructor (scene, x, y, speed)
    {
        super(scene, x, y, 'food');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.1);

        this.setCollideWorldBounds(false);

        this.speed = speed;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.isDead = false ;
    }

    kill ()
    {
        this.isDead = true ;
        this.body.stop();
        this.setActive(false);
        this.setVisible(false);
        this.setAlpha(0);
    }

    preUpdate ()
    {
        const endPositionX = 25 + Math.random() * (this.scene.bg.width - 25)
        const endPositionY = 25 + Math.random() * (this.scene.bg.height - 25)

        this.setFlipX(this.x > endPositionX)
        this.scene.tweens.add({
            targets: this,
            props: {
            x: { value: endPositionX, flipX: true },
            y: { value: endPositionY, },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
}