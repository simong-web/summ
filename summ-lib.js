//#######################PauseMenu.ts###############################
/// <reference path="build\phaser.d.ts" />
var summ;
(function (summ) {
    var PauseMenu = (function () {
        function PauseMenu(game, defaultSprite, defaultOverFrame, defaultOutFrame, defaultDownFrame, defaultUpFrame, defaultScaleX, defaultScaleY, defaultTextStyle, backgroundSprite, stretchBackground, menuBounds, spreadAlongY) {
            this.game = game;

            this.buttons = new Array();
            this.buttonsText = new Array();

            this.defaultSpriteKey = defaultSprite;
            this.defaultSpriteOver = defaultOverFrame;
            this.defaultSpriteOut = defaultOutFrame;
            this.defaultSpriteDown = defaultDownFrame;
            this.defaultSpriteUp = defaultUpFrame;

            this.defaultScaleX = defaultScaleX || 1;
            this.defaultScaleY = defaultScaleY || 1;

            this.defaultTextStyle = defaultTextStyle;

            this.menuBox = menuBounds || this.game.camera.bounds;

            if (backgroundSprite) {
                this.backgroundSprite = backgroundSprite;
                this.backgroundSprite.anchor.set(0.5, 0.5);
                this.backgroundSprite.position.setTo(menuBounds.centerX, menuBounds.centerY);

                if (stretchBackground) {
                    this.backgroundSprite.width = this.menuBox.width;
                    this.backgroundSprite.height = this.menuBox.height;
                }
            }

            this.spreadAlongY = spreadAlongY;
        }
        Object.defineProperty(PauseMenu.prototype, "paused", {
            get: function () {
                return this._paused;
            },
            set: function (value) {
                if (value === !this._paused) {
                    this.togglePause();
                }
            },
            enumerable: true,
            configurable: true
        });


        PauseMenu.prototype.addButton = function (text, callback, callbackContext, addButtonTextToCallBack, key, overFrame, outFrame, downFrame, upFrame, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultSpriteKey && !key)
                throw Error("No image key was given and no default has been specified");

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.fixedToCamera = true;
            buttonText.anchor.set(0.5, 0.5);
            this.buttonsText.push(buttonText);

            if (addButtonTextToCallBack)
                callbackContext['buttonText'] = buttonText;

            var button = new Phaser.Button(this.game, 0, 0, key || this.defaultSpriteKey, callback, callbackContext, overFrame || this.defaultSpriteOver, outFrame || this.defaultSpriteOut, downFrame || this.defaultSpriteDown, upFrame || this.defaultSpriteUp);
            button.anchor.set(0.5, 0.5);
            button.fixedToCamera = true;
            button.scale.setTo(scaleX, scaleY);
            this.buttons.push(button);

            this.updateButtonPositions();
        };

        PauseMenu.prototype.addExistingButton = function (button, buttonText) {
            this.buttons.push(button);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
        };

        PauseMenu.prototype.showMenu = function () {
            if (this.backgroundSprite)
                this.game.add.existing(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                this.game.add.existing(this.buttons[i]);
                this.game.add.existing(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.hideMenu = function () {
            if (this.backgroundSprite)
                this.game.world.remove(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                this.game.world.remove(this.buttons[i]);
                this.game.world.remove(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.updateButtonPositions = function () {
            var totalButtonHeight = 0;

            if (!this.spreadAlongY)
                for (var i = 0; i < this.buttons.length; i++) {
                    totalButtonHeight += this.buttons[i].height;
                }

            var butHeightCumulative = 0;
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].x = this.menuBox.centerX;

                if (this.spreadAlongY)
                    this.buttons[i].y = this.menuBox.top + (i + 1) * this.menuBox.height / (this.buttons.length + 2);
                else {
                    this.buttons[i].y = this.menuBox.centerY - totalButtonHeight / 2 + butHeightCumulative + this.buttons[i].height / 2;
                }
                this.buttonsText[i].position.setTo(this.buttons[i].x, this.buttons[i].y);

                butHeightCumulative += this.buttons[i].height;

                this.buttons[i].fixedToCamera = true;
                this.buttonsText[i].fixedToCamera = true;
            }
        };

        PauseMenu.prototype.togglePause = function () {
            this._paused = !this._paused;
            if (this._paused) {
                //Show menu
                this.showMenu();

                //Pause game function
                this.game.time.events.pause();
                this.game.sound.pauseAll();
                this.preUpdateFunction = this.game.stage.preUpdate;
                this.game.stage.preUpdate = function () {
                };
                this.updateFunction = this.game.stage.update;
                this.game.stage.update = function () {
                    this.game.time.events.pause();
                };
                this.tweenUpdate = this.game.tweens.update;
                this.game.tweens.update = function () {
                    return false;
                };
                this.game.onPause.dispatch();
            } else {
                //Resume game function
                this.game.sound.resumeAll();
                this.game.stage.preUpdate = this.preUpdateFunction;
                this.game.stage.update = this.updateFunction;
                this.game.tweens.update = this.tweenUpdate;
                this.game.time.events.resume();
                this.game.onResume.dispatch();

                //Hide menu
                this.hideMenu();
            }
        };
        return PauseMenu;
    })();
    summ.PauseMenu = PauseMenu;
})(summ || (summ = {}));
//#######################GitsummPreloader.ts###############################
/// <reference path="build\phaser.d.ts" />
var Gitsumm;
(function (Gitsumm) {
    var Preloader = (function () {
        function Preloader() {
        }
        Preloader.load = function (game, loadAssets, context, nextState) {
            game.state.add('gitbootload', {
                preload: function () {
                    game.load.image('gitpreloadbar', 'assets/loader.png');
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
                    bar.x -= bar.width / 2;

                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context);
                },
                create: function () {
                    game.state.start(nextState);
                }
            });
        };
        return Preloader;
    })();
    Gitsumm.Preloader = Preloader;
})(Gitsumm || (Gitsumm = {}));
//# sourceMappingURL=summ-lib.js.map
