/// <reference path="phaser.d.ts" />
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
        public phaserPause: boolean;
        constructor(game: Phaser.Game, defaultSprite?: string, defaultOverFrame?: number, defaultOutFrame?: number, defaultDownFrame?: number, defaultUpFrame?: number, defaultScaleX?: number, defaultScaleY?: number, defaultTextStyle?: any, backgroundSprite?: Phaser.Sprite, stretchBackground?: boolean, menuBounds?: Phaser.Rectangle, spreadAlongY?: boolean);
        public addButton(text: string, callback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, key?: string, overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number, scaleX?: number, scaleY?: number, textStyle?: any): void;
        public addTextAsButton(text: string, callback?: Function, onOverSize?: number, onDownSize?: number, onOutSize?: number, callbackContext?: Object, setButtonTextInContext?: boolean, scaleX?: number, scaleY?: number, textStyle?: any): void;
        public addTextAsCustomizedButton(text: string, onUpCallback?: Function, onOverCallback?: Function, onDownCallback?: Function, onOutCallback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, scaleX?: number, scaleY?: number, textStyle?: any): void;
        public addExistingButton(buttonText: Phaser.Text, button?: Phaser.Button): void;
        public showMenu(): void;
        public hideMenu(): void;
        public updateButtonPositions(): void;
        public togglePause(): void;
        public handleClick(pointer: Phaser.Pointer): void;
    }
}
declare module summ {
    class Preloader {
        static load(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string): void;
        static loadLocal(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string): void;
    }
}
declare module summ {
    class FullScreenSettings {
        static apply(game: Phaser.Game): void;
    }
}
declare module summ {
    class DepthSprite extends Phaser.Sprite {
        private _depth;
        private _lastDepth;
        private _halfWidth;
        private _halfHeight;
        public up: any;
        public down: any;
        public left: any;
        public right: any;
        public zoomIn: any;
        public zoomOut: any;
        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any);
        public preUpdate(): void;
        public update(): void;
        public postUpdate(): void;
    }
}
