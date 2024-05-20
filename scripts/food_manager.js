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
            child.kill();
            this.getChildren().pop() ;
            this.remove(child, true) ;
        });
        console.log("length stop " + this.getChildren().length) ;
    }

    manageFoods (answers)
    {
        var keys = Object.keys(this.foodConfig);

        console.log(answers) ;
        answers.forEach((answer) => {
            const y = Phaser.Math.RND.between(0, this.scene.bg.height);
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