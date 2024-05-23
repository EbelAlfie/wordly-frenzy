export class Food extends Phaser.Physics.Arcade.Sprite {
    isDead = false ;
    score = 0 ;
    text = null ;

    constructor (config, scene, x, y, label)
    {
        super(scene, x, y, config.sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.text = 
            this.scene.add.text(x, y, label, 40)
            .setDepth(1);

        this.setScale(config.scale);

        this.setBounce(1, 1) ;

        this.setCollideWorldBounds(true).setInteractive();

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
        this.destroy() ; 
    }

    preUpdate ()
    {
        const endPositionX = this.scene.bg.width ; 
        const endPositionY = 25 + Math.random() * (this.scene.bg.height - 25)

        this.setFlipX(this.body.width/2 + this.x < endPositionX) ;
        this.scene.tweens.add({
            targets: this,
            props: {
            x: { value: endPositionX },
            y: { value: endPositionY, },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.text.setPosition(endPositionX, endPositionY) ;

        this.scene.physics.moveTo(this, endPositionX, endPositionY, this.speed) + 1.5707963267948966;
    }
}