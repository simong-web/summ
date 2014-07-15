//#######################FullScreenSettings.ts###############################
/// <reference path="phaser.d.ts" />

module summ {
    export class FullScreenSettings {
        static apply(game: Phaser.Game) {
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            if (game.device.desktop)
                game.scale.fullScreenTarget = document.getElementById('content');

            game.scale.enterFullScreen.add(function () {
                if (this.device.firefox) {
                    this.canvas.style.position = 'absolute';
                    this.canvas.style.top = '0';
                    this.canvas.style.left = '0';
                    this.canvas.style.right = '0';
                    this.canvas.style.bottom = '0';
                    this.canvas.style.margin = 'auto';
                    this.canvas.style.width = 'auto !important';
                    this.canvas.style.height = '100% !important';
                }

                this.scale.refresh();
            }, game);

            game.scale.leaveFullScreen.add(function () {
                this.fullScreenTarget.style['width'] = null;
                this.fullScreenTarget.style['height'] = null;
                this.scale.refresh();
            }, game);
        }
    }

}