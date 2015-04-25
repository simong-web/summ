//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

    export class PauseMenu {

        game: Phaser.Game;

        private _paused = false; 

        get paused(): boolean {
            return this.phaserPause? this.game.paused : this._paused;
        }

        set paused(value: boolean) {
            if (value === !this.paused) {
                this.togglePause();
            }
        }

        private preUpdateFunction;
        private updateFunction;
        private tweenUpdate;
        private timeUpdate;
        private stateUpdate;
        private stagePostUpdate;
        
        defaultSpriteKey: string;
        defaultSpriteOver: number;
        defaultSpriteOut: number;
        defaultSpriteDown: number;
        defaultSpriteUp: number;
        defaultScaleX: number;
        defaultScaleY: number;

        public onShowCallback: Function;
        public onHideCallback: Function;
        public showHideCallbackContext: Object;

        menuBox: Phaser.Rectangle;
        backgroundSprite: Phaser.Sprite;

        buttons: Array<Phaser.Button>;
        buttonsText: Array<Phaser.Text>;
        defaultTextStyle: any;

        spreadAlongY: boolean;

        phaserPause = false;


        constructor(game: Phaser.Game, defaultSprite?: string, defaultOverFrame?: number, defaultOutFrame?: number, defaultDownFrame?: number, defaultUpFrame?: number, defaultScaleX?: number, defaultScaleY?: number, defaultTextStyle?: any, backgroundSprite?:any, stretchBackground?: boolean, menuBounds?: Phaser.Rectangle, spreadAlongY?: boolean) {

            this.game = game;

            this.buttons = new Array<Phaser.Button>();
            this.buttonsText = new Array<Phaser.Text>();

            this.defaultSpriteKey = defaultSprite;
            this.defaultSpriteOver = defaultOverFrame;
            this.defaultSpriteOut = defaultOutFrame;
            this.defaultSpriteDown = defaultDownFrame;
            this.defaultSpriteUp = defaultUpFrame;

            this.defaultScaleX = defaultScaleX || 1;
            this.defaultScaleY = defaultScaleY || 1;

            this.defaultTextStyle = defaultTextStyle;
            
            this.menuBox = menuBounds || new Phaser.Rectangle(0,0,this.game.width,this.game.height);

            if (backgroundSprite) {
                if (typeof (backgroundSprite) === "string") {
                    this.backgroundSprite = new Phaser.Sprite(this.game, 0, 0, backgroundSprite);
                } else if (backgroundSprite.type == Phaser.SPRITE)
                    this.backgroundSprite = backgroundSprite;
            }

            if (this.backgroundSprite) {

                this.backgroundSprite.anchor.set(0.5, 0.5);
                this.backgroundSprite.position.setTo(this.menuBox.centerX, this.menuBox.centerY);

                if (stretchBackground) {
                    this.backgroundSprite.width = this.menuBox.width;
                    this.backgroundSprite.height = this.menuBox.height;
                }
            }

            this.spreadAlongY = spreadAlongY;
        }

        addButton(text: string, callback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, key?: string, overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number, scaleX?: number, scaleY?: number,textStyle?: any):any {

            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultSpriteKey && !key) {
                if (this.defaultTextStyle && !textStyle) {
                    console.warn('No image key was given and no default has been specified, default to a text button');
                    return this.addTextAsButton(text, callback, null, null, null, null, setButtonTextInContext, scaleX, scaleY, textStyle);
                } else
                    throw Error("No image key was given and no default has been specified");

                
                }
            if(!this.defaultTextStyle && !textStyle)
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
            return button;
        }

        addTextAsButton(text: string, callback?: Function, onOverSize?: number, onDownSize?: number, onOutSize?: number, callbackContext?: Object, setButtonTextInContext?:boolean ,scaleX?: number, scaleY?: number, textStyle?: any) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            buttonText.inputEnabled = true;
            if (callback) {
                buttonText.events.onInputUp.add(callback, callbackContext);
                if (onOverSize)
                    buttonText.events.onInputUp.add(function () { this.scale.set(onOverSize) }, buttonText);
            }    
            if (onOverSize)
                buttonText.events.onInputOver.add(function () { this.scale.set(onOverSize) }, buttonText);
            if (onDownSize)
                buttonText.events.onInputDown.add(function () { this.scale.set(onDownSize) }, buttonText);
            if (onOutSize)
                buttonText.events.onInputOut.add(function () { this.scale.set(onOutSize) }, buttonText);

            this.buttons.push(null);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
            return buttonText;
        }

        addTextAsCustomizedButton(text: string, onUpCallback?: Function, onOverCallback?: Function, onDownCallback?: Function, onOutCallback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, scaleX?: number, scaleY?: number, textStyle?: any) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

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
            return buttonText;
        }

        addExistingButton(buttonText: Phaser.Text, button?: Phaser.Button):any {

            button = button || null;
            this.buttons.push(button);

            this.buttonsText.push(buttonText);
            this.updateButtonPositions();
            return button || buttonText;
        }

        showMenu() {

            if(this.backgroundSprite)
                this.game.add.existing(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if(this.buttons[i])
                    this.game.add.existing(this.buttons[i]);
                this.game.add.existing(this.buttonsText[i]);
            }

            if (this.onShowCallback)
                this.onShowCallback.call(this.showHideCallbackContext);
        }

        hideMenu() {

            if (this.backgroundSprite)
                this.game.world.remove(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.world.remove(this.buttons[i]);
                this.game.world.remove(this.buttonsText[i]);
            }

            if (this.onHideCallback)
                this.onHideCallback.call(this.showHideCallbackContext);
        }

        private updateButtonPositions() {
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

                var workingElement: any;
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
        }
        manualPause(pause?: boolean) {

            if(pause === undefined)
                pause = true;

            if (this.phaserPause && pause != this.phaserPause) {
                var oldMute = this.game.sound.mute;
                this.game.paused = !this.game.paused;
                this.game.sound.mute = oldMute;

                if (this.game.paused) {
                    this.game.input.onUp.add(this.handleClick, this);
                } else {
                    this.game.input.onUp.remove(this.handleClick, this);
                }
            } else {
                this._paused = pause;
                if (this._paused) {
                    
                    //Pause game function
                    this.game.time.events.pause();
                    this.game.sound.pauseAll();
                    this.preUpdateFunction = this.game.stage.preUpdate;
                    this.game.stage.preUpdate = function () { };
                    this.updateFunction = this.game.stage.update;
                    this.game.stage.update = function () { this.game.time.events.pause(); };

                    this.stateUpdate = this.game.state.update;
                    this.game.state.update = function () { };

                    this.stagePostUpdate = this.game.stage.postUpdate;
                    this.game.stage.postUpdate = function () { };

                    this.tweenUpdate = this.game.tweens.update;
                    this.game.tweens.update = function () {return false };
                    this.game.onPause.dispatch();




                } else {

                    //Resume game function
                    this.game.sound.resumeAll();
                    this.game.stage.preUpdate = this.preUpdateFunction;
                    this.game.stage.update = this.updateFunction;

                    this.game.state.update = this.stateUpdate;

                    this.game.stage.postUpdate = this.stagePostUpdate;

                    this.game.tweens.update = this.tweenUpdate;
                    this.game.time.events.resume();
                    this.game.onResume.dispatch();
                }
            }
        }


        togglePause() {
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
                    this.game.stage.preUpdate = function () { };
                    this.updateFunction = this.game.stage.update;
                    this.game.stage.update = function () { this.game.time.events.pause(); };

                    this.stateUpdate = this.game.state.update;
                    this.game.state.update = function () { };

                    this.stagePostUpdate = this.game.stage.postUpdate;
                    this.game.stage.postUpdate = function () { };

                    this.tweenUpdate = this.game.tweens.update;
                    this.game.tweens.update = function () {return false };
                    this.game.onPause.dispatch();




                } else {

                    //Resume game function
                    this.game.sound.resumeAll();
                    this.game.stage.preUpdate = this.preUpdateFunction;
                    this.game.stage.update = this.updateFunction;

                    this.game.state.update = this.stateUpdate;

                    this.game.stage.postUpdate = this.stagePostUpdate;

                    this.game.tweens.update = this.tweenUpdate;
                    this.game.time.events.resume();
                    this.game.onResume.dispatch();


                    //Hide menu
                    this.hideMenu();
                }
            }
        }

        private handleClick(pointer: Phaser.Pointer) {

            for (var i = 0; i < this.buttonsText.length; i++) {
                if (this.buttons[i]) {
                    if (this.buttons[i].getBounds().contains(pointer.x, pointer.y)) {
                        this.buttons[i].onInputUpHandler(this.buttons[i], pointer, true)
                    }
                } else if (this.buttonsText[i].getBounds().contains(pointer.x, pointer.y)) {
                    this.buttonsText[i].events.onInputUp.dispatch(this.buttonsText[i], pointer, true);
                }
            }
        }


    }

}
