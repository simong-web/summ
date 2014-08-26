/// <reference path="phaser.d.ts" />


module summ {
    export class Ad extends Phaser.Sprite{

        game: Phaser.Game;
        upTime: number;
        onEnd: Function;
        onEndContext: Object;
        clickToClear: boolean;


        constructor(game: Phaser.Game, x:number,y:number,width?:number,height?:number, key?: any, frame?: any, startDelay?: number, upTime?: number, onEnd?: Function, onEndContext?: Object, clickToClear?: boolean, centerAnchor: boolean = true, stretchToFit: boolean = false) {
            this.upTime = upTime||3000;
            this.onEnd = onEnd;
            this.onEndContext = onEndContext;
            this.clickToClear = clickToClear || true;

            super(game, x, y, key, frame);

            if (!stretchToFit) {
                var multiplier = Math.min((height / this.height), (width / this.width));
                this.width = Math.round(this.width * multiplier);
                this.height = Math.round(this.height * multiplier);
            } else {
                this.width = width;
                this.height = height;
            }

            if(centerAnchor)
                this.anchor.set(0.5);


            if (startDelay >= 0) {
                this.game.time.events.add(startDelay, function () {
                    this.show();
                }, this);
            }
        }


        show() {
            this.game.add.existing(this);
            this.game.time.events.add(this.upTime, function () {
                this.remove();
            }, this);

            if (this.clickToClear)
                this.game.input.onUp.addOnce(function () { this.remove() }, this); 

        }

        remove() {            
            this.game.time.events.add(0, function () {
                if (this) this.destroy();
            }, this);
            if (typeof this.onEnd === 'function') {
                this.onEnd.call(this.onEndContext);
            }
        }
        
        
    }
}