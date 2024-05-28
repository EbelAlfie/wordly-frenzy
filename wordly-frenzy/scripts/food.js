
export class Food extends Phaser.Physics.Arcade.Sprite {
    isDead = false ;
    score = 0 ;
    text = null ;
    label = ""

    constructor (config, scene, x, y, label)
    {
        super(scene, x, y, config.sprite);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.label = label ;
        
        this.text = this.scene.add.text(x, y, label, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            align: 'center',
            fontStyle: 'bold',
            strokeThickness: 2,
            stroke: '#000000'
          });

        this.text.setDepth(1);

        this.flipX = true ;

        this.setScale(config.scale);

        this.setBounce(1) ;

        this.setCollideWorldBounds(true)

        this.score = config.value ;

        this.speed = config.speed;
        this.target = new Phaser.Math.Vector2();
    }

    start ()
    {
        this.isDead = false ;

        const endPositionX = Phaser.Math.RND.between(50, window.innerWidth - 50) ; 
        const endPositionY = Phaser.Math.RND.between(50, window.innerHeight - 50) ;
        
        let tween = this.scene.tweens.add({
            targets: this,
            props: {
                x: { value: endPositionX, duration: 10000, flipX: true },
                y: { value: endPositionY, duration: 8000,  },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            paused: true
        });
    
        tween.play();
    }

    kill ()
    {
        this.isDead = true ;
        this.text.destroy() ;
        this.body.stop();
        this.setActive(false);
        this.setVisible(false);
        this.setAlpha(0);
        this.destroy() ; 
    }

    preUpdate ()
    {
        this.text.setPosition(this.x - this.body.width/2, this.y + 30) ;
        if (this.validatePosition()) this.scene.onRoundOver("")
    }

    validatePosition() {
        return this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0 
    }
}