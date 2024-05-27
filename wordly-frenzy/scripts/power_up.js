export class PowerUp extends Phaser.Physics.Arcade.Sprite {
    isDead = false ;
    score = 0 ;

    constructor (config, scene, x, y)
    {
        super(scene, x, y, config.sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(config.scale);

        this.setCollideWorldBounds(true);

        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
    }

    kill ()
    {
        this.body.stop();
        this.setActive(false);
        this.setVisible(false);
        this.setAlpha(0);
    }

    preUpdate ()
    {
        const endPositionX = 25 + Math.random() * (this.scene.bg.width - 25)
        const endPositionY = this.scene.bg.height

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