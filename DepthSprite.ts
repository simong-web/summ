//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

//Just a comment

    export class DepthSprite extends Phaser.Sprite {

        
        private _depth: number = 1; //distance away
        private _lastDepth: number = 1;
        private _halfWidth: number;
        private _halfHeight: number;

        up;
        down;
        left;
        right;
        zoomIn;
        zoomOut;

        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any) {
            super(game, x, y, key, frame);
            this.anchor.set(0.5);

            this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.left= this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.zoomIn = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.zoomOut = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

            this.game.physics.enable(this, Phaser.Physics.ARCADE);

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
            if (this.up.isDown) this.body.velocity.y--;
            if (this.down.isDown) this.body.velocity.y++;
            if (this.left.isDown) this.body.velocity.x--;
            if (this.right.isDown) this.body.velocity.x++;
            if (this.zoomIn.isDown) this._depth -= 0.01;
            if (this.zoomOut.isDown) this._depth += 0.01;

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