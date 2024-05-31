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

        scene.tweens.add({
            targets: [this, this.hintText],
            alpha: { value: 1, duration: 750 },
            delay: 300
        });
        this.hide() ;

        this.recalculate() ;
    }

    recalculate() {
        const textWidth = this.hintText.displayWidth;
        const textHeight = this.hintText.displayHeight;
        this.hintBox.clear();
        this.hintBox.fillRect(0, this.hintText.y - 20 , textWidth + textWidth + 0.2, textHeight * 4);

        this.setSize(textWidth + 20, textHeight + 20);
        this.bringToTop(this.hintText) ;
    }

    setHint(hint) {
        if (this.hintText === null) return ;
        this.hintText.setText(hint) ;
        this.recalculate();
    }

    show() {
        this.setVisible(true) ;
    }

    hide() {
        this.setVisible(false) ;
    }
}