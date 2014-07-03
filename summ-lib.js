//#######################PauseMenu.ts###############################
/// <reference path="build\phaser.d.ts" />
var summ;
(function (summ) {
    var PauseMenu = (function () {
        function PauseMenu(game, defaultSprite, defaultOverFrame, defaultOutFrame, defaultDownFrame, defaultUpFrame, defaultScaleX, defaultScaleY, defaultTextStyle, backgroundSprite, stretchBackground, menuBounds, spreadAlongY) {
            this._paused = false;
            this.phaserPause = false;
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
                return this.phaserPause ? this.game.paused : this._paused;
            },
            set: function (value) {
                if (value === !this.paused) {
                    this.togglePause();
                }
            },
            enumerable: true,
            configurable: true
        });


        PauseMenu.prototype.addButton = function (text, callback, callbackContext, setButtonTextInContext, key, overFrame, outFrame, downFrame, upFrame, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultSpriteKey && !key) {
                if (this.defaultTextStyle && !textStyle) {
                    console.warn('No image key was given and no default has been specified, default to a text button');
                    this.addTextAsButton(text, callback, null, null, null, null, setButtonTextInContext, scaleX, scaleY, textStyle);
                    return;
                } else
                    throw Error("No image key was given and no default has been specified");
            }
            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            this.buttonsText.push(buttonText);

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            var button = new Phaser.Button(this.game, 0, 0, key || this.defaultSpriteKey, callback, callbackContext, overFrame || this.defaultSpriteOver, outFrame || this.defaultSpriteOut, downFrame || this.defaultSpriteDown, upFrame || this.defaultSpriteUp);
            button.anchor.set(0.5, 0.5);
            button.scale.setTo(scaleX, scaleY);
            this.buttons.push(button);

            this.updateButtonPositions();
        };

        PauseMenu.prototype.addTextAsButton = function (text, callback, onOverSize, onDownSize, onOutSize, callbackContext, setButtonTextInContext, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            buttonText.inputEnabled = true;
            if (callback)
                buttonText.events.onInputUp.add(callback, callbackContext);
            if (onOverSize)
                buttonText.events.onInputOver.add(function () {
                    this.scale.set(onOverSize);
                }, buttonText);
            if (onDownSize)
                buttonText.events.onInputDown.add(function () {
                    this.scale.set(onDownSize);
                }, buttonText);
            if (onOutSize)
                buttonText.events.onInputOut.add(function () {
                    this.scale.set(onOutSize);
                }, buttonText);

            this.buttons.push(null);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
        };

        PauseMenu.prototype.addTextAsCustomizedButton = function (text, onUpCallback, onOverCallback, onDownCallback, onOutCallback, callbackContext, setButtonTextInContext, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            buttonText.inputEnabled = true;
            if (onUpCallback)
                buttonText.events.onInputUp.add(onUpCallback, callbackContext);
            if (onOverCallback)
                buttonText.events.onInputOver.add(onOverCallback, callbackContext);
            if (onDownCallback)
                buttonText.events.onInputDown.add(onDownCallback, callbackContext);
            if (onOutCallback)
                buttonText.events.onInputOut.add(onOutCallback, callbackContext);

            this.buttons.push(null);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
        };

        PauseMenu.prototype.addExistingButton = function (buttonText, button) {
            button = button || null;
            this.buttons.push(button);

            this.buttonsText.push(buttonText);
            this.updateButtonPositions();
        };

        PauseMenu.prototype.showMenu = function () {
            if (this.backgroundSprite)
                this.game.add.existing(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.add.existing(this.buttons[i]);
                this.game.add.existing(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.hideMenu = function () {
            if (this.backgroundSprite)
                this.game.world.remove(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.world.remove(this.buttons[i]);
                this.game.world.remove(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.updateButtonPositions = function () {
            var totalButtonHeight = 0;

            if (!this.spreadAlongY)
                for (var i = 0; i < this.buttons.length; i++) {
                    if (this.buttons[i])
                        totalButtonHeight += this.buttons[i].height;
                    else
                        totalButtonHeight += this.buttonsText[i].height;
                }

            var butHeightCumulative = 0;
            for (var i = 0; i < this.buttons.length; i++) {
                var workingElement;
                if (this.buttons[i])
                    workingElement = this.buttons[i];
                else
                    workingElement = this.buttonsText[i];

                workingElement.x = this.menuBox.centerX;

                if (this.spreadAlongY)
                    workingElement.y = this.menuBox.top + (i + 1) * this.menuBox.height / (this.buttons.length + 2);
                else {
                    workingElement.y = this.menuBox.centerY - totalButtonHeight / 2 + butHeightCumulative + workingElement.height / 2;
                }

                butHeightCumulative += workingElement.height;
                workingElement.fixedToCamera = true;

                //If the working element was the button, align the text on top of it
                if (this.buttons[i]) {
                    this.buttonsText[i].position.setTo(this.buttons[i].x, this.buttons[i].y);
                    this.buttonsText[i].fixedToCamera = true;
                }
            }
        };

        PauseMenu.prototype.togglePause = function () {
            if (this.phaserPause) {
                var oldMute = this.game.sound.mute;
                this.game.paused = !this.game.paused;
                this.game.sound.mute = oldMute;

                if (this.game.paused) {
                    this.game.input.onUp.add(this.handleClick, this);
                    this.showMenu();
                } else {
                    this.game.input.onUp.remove(this.handleClick, this);
                    this.hideMenu();
                }
            } else {
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
            }
        };

        PauseMenu.prototype.handleClick = function (pointer) {
            this.buttons.forEach(function (button) {
                if (button.getBounds().contains(pointer.x, pointer.y)) {
                    button.onInputUpHandler(this, pointer, true);
                }
            }, this);
        };
        return PauseMenu;
    })();
    summ.PauseMenu = PauseMenu;
})(summ || (summ = {}));
//#######################Preloader.ts###############################
/// <reference path="build\phaser.d.ts" />
var summ;
(function (summ) {
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

                    loadAssets.call(context, this.game);
                },
                create: function () {
                    game.state.start(nextState);
                }
            });
        };

        Preloader.loadLocal = function (game, loadAssets, context, nextState) {
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
                },
                create: function () {
                    game.state.start(nextState);
                }
            });
        };
        return Preloader;
    })();
    summ.Preloader = Preloader;
})(summ || (summ = {}));
//# sourceMappingURL=summ-lib.js.map
