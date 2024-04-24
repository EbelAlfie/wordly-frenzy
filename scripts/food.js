export class Food extends Phaser.Physics.Arcade.Sprite {
    isDead = false ;
    score = 0 ;

    constructor (config, scene, x, y)
    {
        super(scene, x, y, config.sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.1);

        this.setCollideWorldBounds(false);

        this.score = config.value ;

        this.speed = config.speed;
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

        this.setFlipX(this.body.width/2 + this.x < endPositionX) ;
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

        this.scene.physics.moveTo(this, endPositionX, endPositionY, this.speed) + 1.5707963267948966;
    }
}