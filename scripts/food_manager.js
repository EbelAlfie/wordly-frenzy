import { foodConfig, MAX_FOOD } from "./config/game_config.js"
import { Food } from "./food.js"

export class FoodManager extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene);
        this.foodConfig = foodConfig ;
    }
    start ()
    {
        this.timedEvent = this.scene.time.addEvent({ delay: 2000, callback: this.manageFoods, callbackScope: this, loop: true });
    }

    stop ()
    {
        this.timedEvent.remove();

        // this.getChildren().forEach((child) => {

        //     child.stop();

        // });
    }

    manageFoods ()
    {
        const x = Phaser.Math.RND.between(0, 800);
        const y = Phaser.Math.RND.between(0, 600);

        let food;
        var keys = Object.keys(this.foodConfig);

        // this.getChildren().forEach((child) => {

        //     if (child.anims.getName() === config.animation && !child.active)
        //     {
        //         food = child;
        //     }

        // });

        food = new Food(
            this.foodConfig[keys[ keys.length * Math.random() << 0]],
            this.scene,
            this.scene.bg.getBounds().left,
            Math.random() * this.scene.bg.height
        ) ;

        this.add(food, true);

        food.start();
    }
}