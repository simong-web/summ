//#######################FullScreenSettings.ts###############################
/// <reference path="phaser.d.ts" />

module summ {
    export class FullScreenSettings {
        static apply(game: Phaser.Game) {
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            game.canvas.onresize = function () {
                game.scale.refresh();
            }

            if (game.device.desktop)
                game.scale.fullScreenTarget = document.getElementById('content');

            game.canvas.style.position = 'absolute';
            game.canvas.style.top = '0';
            game.canvas.style.left = '0';
            game.canvas.style.right = '0';
            game.canvas.style.bottom = '0';
            game.canvas.style.margin = 'auto';

            if (document.domain.indexOf("gitsumm.com") > -1) {

                if (game.width / game.height > document.documentElement.clientWidth / document.documentElement.clientHeight) {

                    game.canvas.style['width'] = '100%';
                    game.canvas.style['height'] = 'auto';

                } else  {
                    game.canvas.style['width'] = 'auto';
                    game.canvas.style['height'] = '100%';
                    game.scale.fullScreenTarget.style['height'] = '100%';
                }

            }

            game.scale.refresh();

            document.body.style.margin = '0';

            game.scale.enterFullScreen.add(function () {
                /*if (this.device.firefox) {
                    this.canvas.style.position = 'absolute';
                    this.canvas.style.top = '0';
                    this.canvas.style.left = '0';
                    this.canvas.style.right = '0';
                    this.canvas.style.bottom = '0';
                    this.canvas.style.margin = 'auto';

                    //this.canvas.style.width = 'auto !important';
                    //this.canvas.style.height = '100% !important';
                }
                */
                if (this.width / this.height > this.scale.fullScreenTarget.clientWidth / this.scale.fullScreenTarget.clientHeight) {

                    this.canvas.style['width'] = '100%';
                    this.canvas.style['height'] = 'auto';

                } else {
                    this.canvas.style['width'] = 'auto';
                    this.canvas.style['height'] = '100%';
                }

                this.scale.refresh();
            }, game);

            game.scale.leaveFullScreen.add(function () {
                this.scale.fullScreenTarget.style.width = "";
                this.scale.fullScreenTarget.style.height = "";

                if (document.domain.indexOf("gitsumm.com") > -1) {
                    /*
                    game.canvas.style['width'] = '100%';
                    game.canvas.style['height'] = 'auto';

                    if (game.canvas.clientHeight > document.documentElement.clientHeight) {
                        game.canvas.style['width'] = 'auto';
                        game.canvas.style['height'] = '100%';
                    }
                    */


                    if (game.width / game.height > document.documentElement.clientWidth / document.documentElement.clientHeight) {

                        game.canvas.style['width'] = '100%';
                        game.canvas.style['height'] = 'auto';

                    } else {
                        game.canvas.style['width'] = 'auto';
                        game.canvas.style['height'] = '100%';
                        game.scale.fullScreenTarget.style['height'] = '100%';
                    }

                    this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);
                }

                this.scale.refresh();


            }, game);
        }
    }

}