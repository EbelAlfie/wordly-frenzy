export default class HintContainer extends Phaser.GameObjects.Container {
    hintText = null ;
    hintBox = null ; 
    constructor(scene, x, y, initialText) {
        super(scene, x, y) ;
        this.hintText = scene.add.text(30, 30, initialText, {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Poppins, Arial, sans-serif',
            wordWrap: { width: window.innerWidth * 0.28, useAdvacedWrap: true}, // enable advanced word wrapping
            align: 'left',
            fontStyle: 'bold',
        });
        this.hintText.setOrigin(0, 0);

        this.hintBox = this.scene.add.graphics() ;
        this.hintBox.fillStyle(0x000000, 0.6);
        
        this.add(this.hintText);
        this.add(this.hintBox) ;

        this.hide() ;

        this.recalculate() ;
    }

    recalculate() {
        const textWidth = this.hintText.displayWidth;
        const textHeight = this.hintText.displayHeight;
        this.y = window.innerHeight - 160 + 60 - textHeight ;

        this.setSize(textWidth + 40, window.innerHeight - 160 + 60 - this.y) ;
        this.hintBox.clear();
        this.hintBox.fillRect(0, 0, textWidth + 40, textHeight * 4);
        
        this.hintText.y = this.height/2 ;
        this.bringToTop(this.hintText) ;
    }

    setHint(hint) {
        if (this.hintText === null) return ;
        this.hintText.setText(hint) ;
        this.recalculate();
    }

    show() {
        this.scene.tweens.add({
            targets: [this, this.hintText],
            alpha: { value: 1, duration: 750 },
            delay: 300
        });
    }

    hide() {
        this.scene.tweens.add({
            targets: [this, this.hintText],
            alpha: { value: 0, duration: 750 },
            delay: 300
        });
    }
}