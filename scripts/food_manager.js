import { foodConfig, MAX_FOOD } from "./config/game_config.js"
import { Food } from "./food.js"

export class FoodManager extends Phaser.Physics.Arcade.Group {
    constructor(world, scene) {
        super(world, scene);
        this.foodConfig = foodConfig ;
    }

    spawn (answers)
    {
        this.manageFoods(answers)
    }

    stop ()
    {
        this.getChildren().forEach((child) => {
            console.log(child.label);
            child.kill();
            this.remove(child) ;
        });
        console.log("length stop " + this.getChildren().length) ;
    }

    manageFoods (answers)
    {
        const y = Phaser.Math.RND.between(0, this.scene.bg.height);

        var keys = Object.keys(this.foodConfig);

        console.log(answers) ;
        answers.forEach((answer) => {
            let food = new Food(
                this.foodConfig[keys[ keys.length * Math.random() << 0]],
                this.scene,
                this.scene.bg.getBounds().left,
                y,
                answer
            ) ;
    
            this.add(food, true);
    
            food.start();
        })

        console.log("length init " + this.getChildren().length) ;
    }
}