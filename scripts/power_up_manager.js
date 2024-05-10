import { PowerUp } from "./power_up.js";

export class PowerUpManager extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene)
    }
    start ()
    {
        this.timedEvent = this.scene.time.addEvent({ delay: 2000, callback: this.deployPowerUps, callbackScope: this, loop: true });
    }

    stop ()
    {
        this.timedEvent.remove();
    }

    deployPowerUps ()
    {
        const x = Phaser.Math.RND.between(0, this.scene.bg.width);

        var keys = Object.keys(this.powerUpsConfig);

        if (this.getChildren().length >= MAX_POWERUPS) return
        let powerUp = new PowerUp(
            this.powerUpsConfig,
            this.scene,
            x,
            this.scene.bg.height
        ) ;

        this.add(powerUp, true);

        food.start();
    }

}