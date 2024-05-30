/**
 * Pass in a formatted text 
 * Baca https://faq.whatsapp.com/539178204879377/?cms_platform=web
 * 
 */
export default class TextFormatter extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style) ;
    }

    setQuiz(quiz) {
        this.setText(quiz) ;
    }

    italic() { return /_([^_]+)_/g }

    bold() { return /\*([^\*]+)\*/g }

    strikeThrough() { return /~([^~]+)~/g }

    monospace() { return /```([^`]+)```/g }


}