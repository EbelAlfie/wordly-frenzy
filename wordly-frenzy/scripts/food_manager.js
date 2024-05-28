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
        console.log(this.getChildren()) ;
        let childrens = this.getChildren() ;
        let length = childrens.length
        for (let i = length - 1; i >= 0; i--) {
            const child = childrens[i];
            child.kill();
        }
        this.clear(true);
    }

    manageFoods (answers)
    {
        var keys = Object.keys(this.foodConfig);

        answers.forEach((answer) => {
            const y = Phaser.Math.RND.between(0, this.world.bounds.height - 100);
            const x = Phaser.Math.RND.between(0, this.world.bounds.width - 100);
            let food = new Food(
                this.foodConfig[keys[ keys.length * Math.random() << 0]],
                this.scene,
                x,
                y,
                answer
            ) ;
    
            this.add(food, true);
    
            food.start();
        })
        this.scene.physics.add.collider(this);

    }

}