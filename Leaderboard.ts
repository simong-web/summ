/// <reference path="jquery.d.ts" />
//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />

module summ {

    export function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }

    export var messageList = new Array(); 

    function recieveMessage(event) {
        if (event.origin == "https://www.gitsumm.com" || event.origin == "https://gitsumm.com" || event.origin == "http://www.gitsumm.com" || event.origin == "http://gitsumm.com") {
            var reply = JSON.parse(event.data);
            if (reply && reply.action) {

                for (var i = 0; i < messageList.length; i++) {
                    if (messageList[i].action == reply.action) {
                        var message = messageList[i];
                        messageList.splice(i, 1);

                        var secondArg;
                        if (reply.action == 'set_score')
                            if (reply.status == 'no_user') {
                                secondArg = "You must be logged in to save your high scores.";
                            } else if (reply.status[0] == 'higher') {
                                secondArg = "Congratulations! You beat your all time high score!";
                            } else if (reply.status[1] == 'higher') {
                                secondArg = "Great Work! You beat your monthly high score!";
                            } else if (reply.status[2] == 'higher') {
                                secondArg = "Nice Work! You beat your weekly high score!";
                            } else if (reply.status[0] == 'added') {
                                secondArg = "Check out your score on the leaderboards!";
                            } else if (reply.status[1] == 'added') {
                                secondArg = "Check out your new score on the monthly leaderboard!";
                            } else if (reply.status[2] == 'added') {
                                secondArg = "Check out your new score on the weekly leaderboard!";
                            } else if (reply.status[2] == 'not_higher') {
                                secondArg = "Try again to beat your old score!";
                            }

                        message.callback.call(message.context, reply,secondArg);
                        return;
                    }
                }
            }
        }
    }
    window.addEventListener("message", recieveMessage, false);
    
    export class LeaderboardMessageStructure {
        action: string;
        leaderboardName: string;
        success: boolean;
        status: string;
        user: LeaderboardSubmissionUser;
        leaderboard: Array<LeaderboardEntry>;
        leaderboards: Array<Array<LeaderboardEntry>>;
    };

    export class LeaderboardSubmissionUser {
        userID: number;
        display_name: string;
        nice_name: string;
    }

    export class LeaderboardEntry {
        userID: number; 
        display_name: string;
        nice_name: string;
        score: number;
    }

    export class LeaderboardMessages {

        

        public static sendScore(score: number, callback: Function, callbackContext: Object, timeout: number = 0) {
            try {
                //parent.postMessage(JSON.stringify({ action: 'set_score', score: score }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'set_score', score: score }), '*');
            } catch(e) {

            }
            messageList.push({action: 'set_score', callback: callback, context: callbackContext });
            

            /*
            var ajaxURL = <string>summ.urlParam('ajax_url');
            var postID = summ.urlParam('post_id');

            

            var response = jQuery.ajax({
                type: "post",
                dataType: "json",
                async: false,
                url: ajaxURL,
                data: { action: "send_score", post_id: postID, score: score },
                success: function (response) {
                    alert("Recieved: " + response);
                }
            }); 

            return (<any>response).responseJSON;
        */
        }

        static requestPlayer(callback: Function, callbackContext: Object, timeout: number = 0) {
            try {
            //parent.postMessage(JSON.stringify({ action: 'get_player' }), 'http://www.gitsumm.com');
            parent.postMessage(JSON.stringify({ action: 'get_player' }), '*');
            } catch(e) {

            }
            messageList.push({ action: 'get_player', callback: callback, context: callbackContext });
        }

        static requestScores(callback: Function, callbackContext: Object, timeout: number = 0) {
            try {
            //parent.postMessage(JSON.stringify({ action: 'get_leaderboard' }), 'http://www.gitsumm.com');
            parent.postMessage(JSON.stringify({ action: 'get_leaderboard' }), '*');
            } catch(e) {

            }
            messageList.push({ action: 'get_leaderboard', callback: callback, context: callbackContext });
            /*
            var ajaxURL = <string>summ.urlParam('ajax_url');
            var postID = summ.urlParam('post_id');


            var response = (<any>jQuery.ajax({
                type: "post",
                dataType: "json",
                async: false,
                url: ajaxURL,
                data: { action: "get_leaderboard", post_id: postID, score: score },
                success: function (response) {
                    alert("Recieved: " + response);
                }
            }));

            return response.responseJSON;
        */
        }

    }

    export class ScrollBar extends Phaser.Sprite {

        public value: number;
        horizontal: boolean;
        head: Phaser.Image;
        oldHeadPos = 0;
        callbackFunction: Function;
        callbackContext: Object;

        constructor(game: Phaser.Game, bounds: Phaser.Rectangle, callbackFunction: Function, callbackContext: Object, scrollHead: string, scrollBar: string, group?: Phaser.Group, horizontal: boolean = false) {
            super(game, bounds.x, bounds.y, scrollBar, null);
            if (group)
                group.add(this);
            else 
                game.add.existing(this);

            if (bounds.width != 0)
                this.width = bounds.width;
            else
                this.anchor.x = 0.5;

            if (bounds.height != 0)
                this.height = bounds.height;
            else
                this.anchor.y = 0.5;

            this.inputEnabled = true;

            this.horizontal = horizontal;


            this.head = game.add.sprite(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, scrollHead);
            if (group)
                group.add(this.head);
            this.head.anchor.setTo(0.5, 0.5);
            this.head.inputEnabled = true;
            this.head.input.enableDrag(false, false, true, 240, new Phaser.Rectangle(this.x,this.y+this.head.height/2,this.width,this.height));
            this.head.input.allowVerticalDrag = true;
            this.head.input.allowHorizontalDrag = false;
            this.moveHeadToValue(0);

            
            this.events.onInputDown.add(function (bar:Phaser.Image,pointer:Phaser.Pointer) {
                this.moveHeadToPoint(pointer);
            }, this);

            this.callbackFunction = callbackFunction;
            this.callbackContext = callbackContext;

        }

        update() {

            var headPos = this.horizontal ? this.head.x : this.head.y;

            if (headPos != this.oldHeadPos) {
                this.updateValue();
                this.callbackFunction.call(this.callbackContext,this.value);
                this.oldHeadPos = headPos;
            }
        }

        updateValue() {
            if (this.horizontal) {
                var effectiveLength = this.width - this.head.width;
                var distFromStart = this.head.x - this.x - this.head.width / 2;
                this.value = Phaser.Math.clamp(distFromStart / effectiveLength * 100, 0, 100);
            } else {
                var effectiveLength = this.height - this.head.height;
                var distFromStart = this.head.y - this.y - this.head.height/ 2;
                this.value = Phaser.Math.clamp(distFromStart / effectiveLength * 100, 0, 100);

            }
        }

        moveHeadToPoint(pointer:Phaser.Pointer) {
            if (this.horizontal) {
                var headHalfWidth = this.head.width / 2;
                this.head.x = Phaser.Math.clamp(pointer.x, this.x + headHalfWidth, this.x + this.width - headHalfWidth);
            } else {
                var headHalfHeight = this.head.height / 2;
                this.head.y = Phaser.Math.clamp(pointer.y, this.y + headHalfHeight, this.y + this.height - headHalfHeight);
            }
        }

        moveHeadToValue(value:number) {
            value = Phaser.Math.clamp(value, 0, 100);

          
            if (this.horizontal) {
                var effectiveLength = this.width - this.head.width;
                var headHalfWidth = this.head.width / 2;

                this.head.x = Phaser.Math.clamp(this.x + headHalfWidth + effectiveLength * value/100, this.x + headHalfWidth, this.x + this.width - headHalfWidth);
            } else {
                var effectiveLength = this.height - this.head.height;
                var headHalfHeight = this.head.height / 2;

                this.head.y = Phaser.Math.clamp(this.y + headHalfHeight + effectiveLength * value / 100, this.y + headHalfHeight, this.y + this.height - headHalfHeight);
            }
            this.oldHeadPos = this.horizontal ? this.head.x : this.head.y;
            this.value = value;

        }
    }



    export class LeaderboardDisplay {
        
        //Settings
        leaderboardNames = ['All Time', 'Monthly', 'Weekly'];
        tabHeight = 40;
        controlsWidth = 60;
        slots = 10;

        currentLeaderboard = 0;
        currentPos = 0;
        leaderboards: Array<Array<LeaderboardEntry>>;
        playerNames = new Array<Phaser.Text>(this.slots);
        playerScores = new Array<Phaser.Text>(this.slots);
        playerBackgrounds = new Array<Phaser.Sprite>(this.slots);
        leaderboardGroup: Phaser.Group;
        onExitCallback: Function;
        onExitContext: Object;

        entryBackgroundKey: string;

        constructor(game: Phaser.Game, tabImage: string, exitImage: string, jumpUpImage: string, stepUpImage: string, onExitCallback?: Function, onExitContext?: Object, tabHeight?: number, controlsWidth?: number, slots?: number, bounds?: Phaser.Rectangle, tabFont = { font: "bold 14px Arial", fill: "#ffffff", align: "middle" }, nameStyle: any = { font: "bold 16px Arial", fill: "#ffffff", align: "left" }, scoreStyle: any = { font: "bold 16px Arial", fill: "#ffffff", align: "right" }, leaderboardNames?: Array<string>) {

            var backgroundKey = 'lb_background';
            var titleKey = 'lb_title';
            this.entryBackgroundKey = 'lb_entry';
            exitImage = null;
            exitImage = exitImage || 'lb_close';
            stepUpImage = null;
            stepUpImage = stepUpImage || 'lb_up';
            tabImage = null;
            tabImage = tabImage || 'lb_tab';


            this.leaderboardGroup = game.add.group();
            this.leaderboardGroup.name = 'Leaderboard';

            this.hide();


            this.onExitCallback = onExitCallback || this.onExitCallback;
            this.onExitContext = onExitContext || this.onExitContext;

            this.tabHeight = tabHeight || this.tabHeight;
            this.controlsWidth = controlsWidth || this.controlsWidth;
            this.slots = slots || this.slots;
            this.leaderboardNames = leaderboardNames || this.leaderboardNames;

            var bitmap = new Phaser.BitmapData(game, 'black', game.width, game.height);
            bitmap.context.fillStyle = '#000';
            bitmap.context.fillRect(0, 0, game.width, game.height);
            var bg = game.add.sprite(0, 0, bitmap,null,this.leaderboardGroup);
            bg.alpha = 0.8;
            bg.inputEnabled = true;

            bounds = bounds || new Phaser.Rectangle(100, 100, 460, 400);

            var background = game.add.sprite(bounds.x, bounds.y, backgroundKey, null, this.leaderboardGroup);
            background.width = bounds.width;
            background.height = bounds.height;

            var title = game.add.sprite(bounds.x, bounds.y, titleKey, null, this.leaderboardGroup);

            title.scale.set(bounds.width / title.width);

            var titleHeight = title.height;


            var xTabIncrement = (bounds.width) / this.leaderboardNames.length;
            for (var i = 0; i < this.leaderboardNames.length; i++) {

                var buttonContext = { leaderboardDisplay: this, leaderboardNumber: i }

                var button = game.add.button(bounds.x + xTabIncrement * i, bounds.y + titleHeight, tabImage, function () {
                    this.leaderboardDisplay.currentLeaderboard = this.leaderboardNumber;
                    this.leaderboardDisplay.populateLeaderboards.call(this.leaderboardDisplay, this.leaderboardDisplay.currentLeaderboard);
                }, buttonContext, 2, 1, 0, 1, this.leaderboardGroup);
                button.width = xTabIncrement;
                button.height = this.tabHeight;
                button.freezeFrames = true;
                var text = game.add.text(button.x + button.width / 2, button.y + button.height / 2, this.leaderboardNames[i],tabFont, this.leaderboardGroup);
                text.anchor.set(0.5, 0.5);
            }

            var exitButton = game.add.button(bounds.x + bounds.width, bounds.y, exitImage, function () {
                this.hide();
                if (typeof this.onExitCallback === "function") {
                    this.onExitCallback.call(this.onExitContext);
                }

            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            exitButton.anchor.set(1, 0);
            exitButton.scale.set(title.height / exitButton.height);
            exitButton.freezeFrames = true;
            //exitButton.width = this.controlsWidth;
            //exitButton.height = title.height-20;

            //New Scroll bar layout
            var stepUpButton = game.add.button(bounds.x + bounds.width, bounds.y + this.tabHeight + titleHeight, stepUpImage, function () {
                this.currentPos = Math.max(this.currentPos - 1, 0);
                scrollBar.moveHeadToValue(this.currentPos / (this.leaderboards[this.currentLeaderboard].length - 1) * 100);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepUpButton.anchor.set(1, 0);
            stepUpButton.width = this.controlsWidth;
            stepUpButton.height = this.controlsWidth;
            stepUpButton.freezeFrames = true;

            var stepDownButton = game.add.button(bounds.x + bounds.width, bounds.y + bounds.height - this.controlsWidth, stepUpImage, function () {
                this.currentPos = Math.min(this.currentPos + 1, this.leaderboards[this.currentLeaderboard].length - 1);
                scrollBar.moveHeadToValue(this.currentPos / (this.leaderboards[this.currentLeaderboard].length - 1) * 100);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepDownButton.anchor.set(1, 1);
            stepDownButton.width = this.controlsWidth;
            stepDownButton.height = -this.controlsWidth;
            stepDownButton.freezeFrames = true;

            var scrollBar = new ScrollBar(game,
                new Phaser.Rectangle(bounds.x + bounds.width - this.controlsWidth / 2,
                    bounds.y + this.tabHeight + this.controlsWidth + titleHeight,
                    0,
                    bounds.height - this.tabHeight - titleHeight - this.controlsWidth * 2),
                function (value: number) {
                    if (this.leaderboards) {
                        this.currentPos = Math.floor(value / 100 * (this.leaderboards[this.currentLeaderboard].length - 1));
                        this.populateLeaderboards();
                    }
                }, this,
                'lb_scroll_head', 'lb_scroll_bar',this.leaderboardGroup, false);

            /*
            //OLD double jump up/down button layout
            var jumpUpButton = game.add.button(bounds.x + bounds.width, bounds.y + (bounds.height-this.tabHeight) / 2 , jumpUpImage, function () {
                this.currentPos = Math.max(this.currentPos - this.slots, 0);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            jumpUpButton.anchor.set(1, 1);
            jumpUpButton.width = this.controlsWidth;
            jumpUpButton.height = this.tabHeight;
            

            var stepUpButton = game.add.button(bounds.x + bounds.width, bounds.y + (bounds.height - this.tabHeight) / 2 + 1 * this.tabHeight,stepUpImage, function () {
                this.currentPos = Math.max(this.currentPos - 1, 0);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepUpButton.anchor.set(1, 1);
            stepUpButton.width = this.controlsWidth;
            stepUpButton.height = this.tabHeight;

            var stepDownButton = game.add.button(bounds.x + bounds.width, bounds.y + (bounds.height - this.tabHeight) / 2 + 2 * this.tabHeight, stepUpImage, function () {
                this.currentPos = Math.min(this.currentPos + 1, this.leaderboards[this.currentLeaderboard].length-1);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepDownButton.anchor.set(1, 0);
            stepDownButton.width = this.controlsWidth;
            stepDownButton.height = -this.tabHeight;

            
            var jumpDownButton = game.add.button(bounds.x + bounds.width, bounds.y + (bounds.height - this.tabHeight) / 2 + 3 * this.tabHeight, jumpUpImage, function () {
                this.currentPos = Math.min(this.currentPos + 10, this.leaderboards[this.currentLeaderboard].length-1);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            jumpDownButton.anchor.set(1, 0);
            jumpDownButton.width = this.controlsWidth;
            jumpDownButton.height = -this.tabHeight;
            */
            

            var yIncrement = (bounds.height - this.tabHeight - titleHeight) / this.slots;
            var yStart = bounds.y + titleHeight + this.tabHeight;

            for (var i = 0; i < this.slots; i++) {

                this.playerBackgrounds[i] = game.add.sprite(bounds.x + 25, yStart + yIncrement * i, this.entryBackgroundKey, null, this.leaderboardGroup);
                this.playerBackgrounds[i].width = bounds.width - this.controlsWidth -30;
                this.playerBackgrounds[i].height = yIncrement;
                this.playerBackgrounds[i].anchor.set(0, 0);
                this.playerBackgrounds[i].inputEnabled = true;
                this.playerBackgrounds[i].events.onInputUp.add(this.nameOnUpFunction, this);
                this.playerBackgrounds[i].events.onInputOver.add(function () { }, this);
                this.playerBackgrounds[i].events.onInputDown.add(function () { }, this);
                this.playerBackgrounds[i].events.onInputOut.add(function () { }, this);

                this.playerNames[i] = game.add.text(bounds.x + 35, yStart + yIncrement * i + yIncrement / 2, "Retrieving...", nameStyle, this.leaderboardGroup);
                this.playerNames[i].anchor.set(0, 0.5);
                this.playerNames[i].inputEnabled = true;

                this.playerScores[i] = game.add.text(bounds.x + bounds.width-this.controlsWidth-25, yStart + yIncrement * i + yIncrement/2, "----", scoreStyle, this.leaderboardGroup);
                this.playerScores[i].anchor.set(1, 0.5);
            }

            LeaderboardMessages.requestScores(function (message: summ.LeaderboardMessageStructure) {

                for (var i = 0; i < message.leaderboards[0].length; i++) {
                    this.leaderboards = message.leaderboards;
                    this.populateLeaderboards.call(this, this.currentLeaderboard);
                    // pauseMenu.addTextAsButton(message.leaderboards.leaderboard_all_time[i].name + "\t\t" + message.leaderboards.leaderboard_all_time[i].score);
                }


            }, this);

        }

        static loadDefaults(game: Phaser.Game, local:boolean = false) {
            var spritesheets = [
                ['lb_background', 800, 600],
                ['lb_close', 99, 99],
                ['lb_down', 115, 112],
                ['lb_entry', 651, 45],
                ['lb_left_arrow', 172, 91],
                ['lb_scroll_bar', 24, 305],
                ['lb_scroll_head', 14, 49],
                ['lb_tab', 355, 80],
                ['lb_title', 800, 88],
                ['lb_up', 120, 120],
            ];

            if (local) {
                for (var alpha in spritesheets) {
                    game.load.spritesheet(<string>spritesheets[alpha][0], 'assets/' + spritesheets[alpha][0] + '.png', <number>spritesheets[alpha][1], <number>spritesheets[alpha][2]);
                }
            } else {
                for (var alpha in spritesheets) {
                    game.load.spritesheet(<string>spritesheets[alpha][0], 'https://gitsumm.com/files/_/simon/Leaderboard Assets/' + spritesheets[alpha][0] + '.png', <number>spritesheets[alpha][1], <number>spritesheets[alpha][2]);
                }
            }
        }


        show() {
            this.leaderboardGroup.visible = true;

            LeaderboardMessages.requestScores(function (message: summ.LeaderboardMessageStructure) {
                    this.leaderboards = message.leaderboards;
                    this.populateLeaderboards.call(this, this.currentLeaderboard);
            }, this);

        }

        hide() {
            this.leaderboardGroup.visible = false;
        }


        private nameOnUpFunction() {
        }


        populateLeaderboards(leaderboardNumber: number = this.currentLeaderboard, startingPos?: number) {
            this.currentPos = startingPos || this.currentPos;
            if (this.leaderboards !== undefined && this.leaderboards[leaderboardNumber] !== undefined) {
                for (var i = 0; i < this.playerNames.length; i++) {
                    this.playerNames[i].events.onInputUp.removeAll(this.leaderboards);
                    if (this.currentPos + i < this.leaderboards[leaderboardNumber].length) {



                        this.playerNames[i].setText((this.currentPos + i + 1) + '. ' + this.leaderboards[leaderboardNumber][this.currentPos + i].display_name);
                        this.playerBackgrounds[i].visible = true;
                        this.playerBackgrounds[i].events.onInputUp.removeAll();
                        this.playerBackgrounds[i].events.onInputUp.add(this.nameOnUpFunction, this);
                        this.playerBackgrounds[i].events.onInputUp.add(function () { window.open(this, '_blank') }, 'https://gitsumm.com/live/members/' + this.leaderboards[leaderboardNumber][this.currentPos + i].nice_name);
                        this.playerScores[i].setText(""+this.leaderboards[leaderboardNumber][this.currentPos + i].score);
                    } else {
                        this.playerNames[i].setText("");
                        this.playerBackgrounds[i].visible = false;
                        this.playerBackgrounds[i].events.onInputUp.removeAll();
                        this.playerBackgrounds[i].events.onInputUp.add(this.nameOnUpFunction, this);
                        this.playerScores[i].setText("");
                    }
                }
            }
        }

    }


} 