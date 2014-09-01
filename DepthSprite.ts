//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

//Just a comment

    export class DepthSprite extends Phaser.Sprite {

        private _depth: number = 1; //distance away
        get depth(): number {
            return this._depth;
        }
        set depth(value: number) {
            this._depth = value;
        }


        private _lastDepth: number = 1;
        private _halfWidth: number;
        private _halfHeight: number;



        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any) {
            super(game, x, y, key, frame);
            this.anchor.set(0.5);
        }
    
        preUpdate() {
            this._halfWidth = this.game.width / 2;
            this._halfHeight = this.game.width / 2;
            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x *= this._lastDepth;
            this.y *= this._lastDepth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x * this._lastDepth, this.scale.y * this._lastDepth);
            super.preUpdate();
        }

        update() {


        }
        
        postUpdate() {
            super.postUpdate();

            this._lastDepth = this._depth;

            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x /= this._depth;
            this.y /= this._depth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x / this._depth, this.scale.y / this._depth);
        }

    }
}