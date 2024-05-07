import { foodConfig, MAX_FOOD } from "./config/game_config.js"
import { Food } from "./food.js"

export class FoodManager extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene);
        this.foodConfig = foodConfig ;
    }
    start ()
    {
        let food1 = new Food(
            foodConfig["small"],
            this.scene,
            this.scene.bg.getBounds().left,
            Math.random() * this.scene.bg.height
           ) ;
        let food2 = new Food(
            foodConfig["medium"],
            this.scene,
            this.scene.bg.getBounds().left,
            Math.random() * this.scene.bg.height
           ) ;
        let food3 = new Food(
            foodConfig["large"],
            this.scene,
            this.scene.bg.getBounds().left,
            Math.random() * this.scene.bg.height
           ) ;

        this.add(food1, true);
        this.add(food2, true);
        this.add(food3, true);

        food1.start();
        food2.start();
        food3.start();

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

        let config = Phaser.Math.RND.pick(this.foodConfig);

        // this.getChildren().forEach((child) => {

        //     if (child.anims.getName() === config.animation && !child.active)
        //     {
        //         food = child;
        //     }

        // });


        food = new Food(
            config,
            this,
            this.scene.bg.getBounds().left,
            Math.random() * this.scene.bg.height
            ) ;;

        this.add(food, true);

        food.start();
    }
}