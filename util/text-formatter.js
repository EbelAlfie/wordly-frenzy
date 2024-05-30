import Phaser from "phaser"

/**
 * Pass in a formatted text 
 * Baca https://faq.whatsapp.com/539178204879377/?cms_platform=web
 * 
 */
export default class TextFormatter extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style) ;

        "".search
    }

    italic() { return "_[\w]+_" }

    bold() { return "*[\w]+*" }

    strikeThrough() { return "~[\w]+~" }

    monospace() { return "```[\w]+```" }


}