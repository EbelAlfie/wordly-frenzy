export default class Player extends Phaser.Physics.Arcade.Image
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(0.3);

        this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(true);

        this.isAlive = false;

        this.speed = 280;
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
                // this.setAccelerationX(pointer.x) ;
                // this.setAccelerationY(pointer.y) ;
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
        if (this.body.speed > 0 && this.isAlive)
        {
            if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 6)
            {
                this.body.reset(this.target.x, this.target.y);
            }
        }
    }
    
    
}
