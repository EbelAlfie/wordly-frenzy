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

        this.getChildren().forEach((child) => {

            child.kill();

        });
    }

    manageFoods ()
    {
        const y = Phaser.Math.RND.between(0, this.scene.bg.height);

        var keys = Object.keys(this.foodConfig);

        console.log(this.getChildren().length) ;

        if (this.getChildren().length >= MAX_FOOD) return
        let food = new Food(
            this.foodConfig[keys[ keys.length * Math.random() << 0]],
            this.scene,
            this.scene.bg.getBounds().left,
            y
        ) ;

        this.add(food, true);

        food.start();
    }
}