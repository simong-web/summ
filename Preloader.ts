//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

    export class Preloader {

        static load(game: Phaser.Game, loadAssets: Function,context: Object,nextState: string) {

            game.state.add('gitbootload', {
                preload: function () {
                    game.load.image('gitpreloadbar', 'http://gitsumm.com/files/_/simon/Preloader/loader.png');
                    game.load.image('gitpreloadlogo', 'http://gitsumm.com/files/blk/img/logo.png');

                },
                create: function () {
                    game.state.start('gitpreload');
                }
            }, true);

            game.state.add('gitpreload', {
                preload: function () {

                    var logo = game.add.sprite(game.width / 2, game.height * 3 / 4, 'gitpreloadlogo');
                    logo.anchor.set(0.5, 1);

                    var bar = game.add.sprite(logo.x, logo.y, 'gitpreloadbar');
                    bar.x -= bar.width/2;
                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context, this.game);
                    summ.LeaderboardDisplay.loadDefaults(this.game);

                },
                create: function () {
                    game.state.start(nextState);
                }
            });

        }

        static loadLocal(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string) {

            game.state.add('gitbootload', {
                preload: function () {
                    game.load.image('gitpreloadbar', 'assets/loader.png');
                    game.load.image('gitpreloadlogo', 'assets/logo.png');

                },
                create: function () {
                    game.state.start('gitpreload');
                }
            }, true);

            game.state.add('gitpreload', {
                preload: function () {

                    var logo = game.add.sprite(game.width / 2, game.height * 3 / 4, 'gitpreloadlogo');
                    logo.anchor.set(0.5, 1);

                    var bar = game.add.sprite(logo.x, logo.y, 'gitpreloadbar');
                    bar.x -= bar.width / 2;
                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context);
                    summ.LeaderboardDisplay.loadDefaults(this.game);

                },
                create: function () {
                    game.state.start(nextState);
                }
            });

        }

    }
}