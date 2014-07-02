/// <reference path="../phaser.d.ts" />
declare module summ {
    class PauseMenu {
        public game: Phaser.Game;
        private _paused;
        public paused : boolean;
        private preUpdateFunction;
        private updateFunction;
        private tweenUpdate;
        private timeUpdate;
        public defaultSpriteKey: string;
        public defaultSpriteOver: number;
        public defaultSpriteOut: number;
        public defaultSpriteDown: number;
        public defaultSpriteUp: number;
        public defaultScaleX: number;
        public defaultScaleY: number;
        public menuBox: Phaser.Rectangle;
        public backgroundSprite: Phaser.Sprite;
        public buttons: Phaser.Button[];
        public buttonsText: Phaser.Text[];
        public defaultTextStyle: any;
        public spreadAlongY: boolean;
        constructor(game: Phaser.Game, defaultSprite?: string, defaultOverFrame?: number, defaultOutFrame?: number, defaultDownFrame?: number, defaultUpFrame?: number, defaultScaleX?: number, defaultScaleY?: number, defaultTextStyle?: any, backgroundSprite?: Phaser.Sprite, stretchBackground?: boolean, menuBounds?: Phaser.Rectangle, spreadAlongY?: boolean);
        public addButton(text: string, callback?: Function, callbackContext?: Object, addButtonTextToCallBack?: boolean, key?: string, overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number, scaleX?: number, scaleY?: number, textStyle?: any): void;
        public addExistingButton(button: Phaser.Button, buttonText: Phaser.Text): void;
        public showMenu(): void;
        public hideMenu(): void;
        public updateButtonPositions(): void;
        public togglePause(): void;
    }
}
declare module summ {
    class Preloader {
        public staticload(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string): void;
    }
}
