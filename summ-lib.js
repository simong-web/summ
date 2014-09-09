/// <reference path="jquery.d.ts" />
//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var summ;
(function (summ) {
    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    }
    summ.urlParam = urlParam;

    var messageList = new Array();

    function recieveMessage(event) {
        if (event.origin == "http://www.gitsumm.com" || event.origin == "http://gitsumm.com") {
            var reply = JSON.parse(event.data);
            if (reply && reply.action) {
                for (var i = 0; i < messageList.length; i++) {
                    if (messageList[i].action == reply.action) {
                        var message = messageList[i];
                        messageList.splice(i, 1);

                        var secondArg;
                        if (reply.action == 'set_score')
                            if (reply.status[0] == 'higher') {
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

                        message.callback.call(message.context, reply, secondArg);
                        return;
                    }
                }
            }
        }
    }
    window.addEventListener("message", recieveMessage, false);

    var LeaderboardMessageStructure = (function () {
        function LeaderboardMessageStructure() {
        }
        return LeaderboardMessageStructure;
    })();
    summ.LeaderboardMessageStructure = LeaderboardMessageStructure;
    ;

    var LeaderboardSubmissionUser = (function () {
        function LeaderboardSubmissionUser() {
        }
        return LeaderboardSubmissionUser;
    })();
    summ.LeaderboardSubmissionUser = LeaderboardSubmissionUser;

    var LeaderboardEntry = (function () {
        function LeaderboardEntry() {
        }
        return LeaderboardEntry;
    })();
    summ.LeaderboardEntry = LeaderboardEntry;

    var LeaderboardMessages = (function () {
        function LeaderboardMessages() {
        }
        LeaderboardMessages.sendScore = function (score, callback, callbackContext, timeout) {
            if (typeof timeout === "undefined") { timeout = 0; }
            try  {
                //parent.postMessage(JSON.stringify({ action: 'set_score', score: score }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'set_score', score: score }), '*');
            } catch (e) {
            }
            messageList.push({ action: 'set_score', callback: callback, context: callbackContext });
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
        };

        LeaderboardMessages.requestPlayer = function (callback, callbackContext, timeout) {
            if (typeof timeout === "undefined") { timeout = 0; }
            try  {
                //parent.postMessage(JSON.stringify({ action: 'get_player' }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'get_player' }), '*');
            } catch (e) {
            }
            messageList.push({ action: 'get_player', callback: callback, context: callbackContext });
        };

        LeaderboardMessages.requestScores = function (callback, callbackContext, timeout) {
            if (typeof timeout === "undefined") { timeout = 0; }
            try  {
                //parent.postMessage(JSON.stringify({ action: 'get_leaderboard' }), 'http://www.gitsumm.com');
                parent.postMessage(JSON.stringify({ action: 'get_leaderboard' }), '*');
            } catch (e) {
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
        };
        return LeaderboardMessages;
    })();
    summ.LeaderboardMessages = LeaderboardMessages;

    var ScrollBar = (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(game, bounds, callbackFunction, callbackContext, scrollHead, scrollBar, group, horizontal) {
            if (typeof horizontal === "undefined") { horizontal = false; }
            _super.call(this, game, bounds.x, bounds.y, scrollBar, null);
            this.oldHeadPos = 0;
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
            this.head.input.enableDrag(false, false, true, 240, new Phaser.Rectangle(this.x, this.y, this.width, this.height));
            this.head.input.allowVerticalDrag = true;
            this.head.input.allowHorizontalDrag = false;
            this.moveHeadToValue(0);

            this.events.onInputDown.add(function (bar, pointer) {
                this.moveHeadToPoint(pointer);
            }, this);

            this.callbackFunction = callbackFunction;
            this.callbackContext = callbackContext;
        }
        ScrollBar.prototype.update = function () {
            var headPos = this.horizontal ? this.head.x : this.head.y;

            if (headPos != this.oldHeadPos) {
                this.updateValue();
                this.callbackFunction.call(this.callbackContext, this.value);
                this.oldHeadPos = headPos;
            }
        };

        ScrollBar.prototype.updateValue = function () {
            if (this.horizontal) {
                var effectiveLength = this.width - this.head.width;
                var distFromStart = this.head.x - this.x - this.head.width / 2;
                this.value = Phaser.Math.clamp(distFromStart / effectiveLength * 100, 0, 100);
            } else {
                var effectiveLength = this.height - this.head.height;
                var distFromStart = this.head.y - this.y - this.head.height / 2;
                this.value = Phaser.Math.clamp(distFromStart / effectiveLength * 100, 0, 100);
            }
        };

        ScrollBar.prototype.moveHeadToPoint = function (pointer) {
            if (this.horizontal) {
                var headHalfWidth = this.head.width / 2;
                this.head.x = Phaser.Math.clamp(pointer.x, this.x + headHalfWidth, this.x + this.width - headHalfWidth);
            } else {
                var headHalfHeight = this.head.height / 2;
                this.head.y = Phaser.Math.clamp(pointer.y, this.y + headHalfHeight, this.y + this.height - headHalfHeight);
            }
        };

        ScrollBar.prototype.moveHeadToValue = function (value) {
            value = Phaser.Math.clamp(value, 0, 100);

            if (this.horizontal) {
                var effectiveLength = this.width - this.head.width;
                var headHalfWidth = this.head.width / 2;

                this.head.x = Phaser.Math.clamp(this.x + headHalfWidth + effectiveLength * value / 100, this.x + headHalfWidth, this.x + this.width - headHalfWidth);
            } else {
                var effectiveLength = this.height - this.head.height;
                var headHalfHeight = this.head.height / 2;

                this.head.y = Phaser.Math.clamp(this.y + headHalfHeight + effectiveLength * value / 100, this.y + headHalfHeight, this.y + this.height - headHalfHeight);
            }
            this.value = value;
        };
        return ScrollBar;
    })(Phaser.Sprite);
    summ.ScrollBar = ScrollBar;

    var LeaderboardDisplay = (function () {
        function LeaderboardDisplay(game, tabImage, exitImage, jumpUpImage, stepUpImage, onExitCallback, onExitContext, tabHeight, controlsWidth, slots, bounds, tabFont, nameStyle, scoreStyle, leaderboardNames) {
            if (typeof tabFont === "undefined") { tabFont = { font: "bold 14px Arial", fill: "#ffffff", align: "middle" }; }
            if (typeof nameStyle === "undefined") { nameStyle = { font: "bold 16px Arial", fill: "#ffffff", align: "left" }; }
            if (typeof scoreStyle === "undefined") { scoreStyle = { font: "bold 16px Arial", fill: "#ffffff", align: "right" }; }
            //Settings
            this.leaderboardNames = ['All Time', 'Monthly', 'Weekly'];
            this.tabHeight = 60;
            this.controlsWidth = 60;
            this.slots = 10;
            this.currentLeaderboard = 0;
            this.currentPos = 0;
            this.playerNames = new Array(this.slots);
            this.playerScores = new Array(this.slots);
            this.entryBackgroundKey = 'lb_entry';
            exitImage = exitImage || 'lb_exit';
            stepUpImage = stepUpImage || 'lb_up';
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
            var bg = game.add.sprite(0, 0, bitmap, null, this.leaderboardGroup);
            bg.alpha = 0.8;
            bg.inputEnabled = true;

            bounds = bounds || new Phaser.Rectangle(100, 100, 460, 400);

            var xTabIncrement = (bounds.width - this.controlsWidth) / this.leaderboardNames.length;
            for (var i = 0; i < this.leaderboardNames.length; i++) {
                var buttonContext = { leaderboardDisplay: this, leaderboardNumber: i };

                var button = game.add.button(bounds.x + xTabIncrement * i, bounds.y, tabImage, function () {
                    this.leaderboardDisplay.currentLeaderboard = this.leaderboardNumber;
                    this.leaderboardDisplay.populateLeaderboards.call(this.leaderboardDisplay, this.leaderboardDisplay.currentLeaderboard);
                }, buttonContext, 2, 1, 0, 1, this.leaderboardGroup);
                button.width = xTabIncrement;
                button.height = this.tabHeight;
                var text = game.add.text(button.x + button.width / 2, button.y + button.height / 2, this.leaderboardNames[i], tabFont, this.leaderboardGroup);
                text.anchor.set(0.5, 0.5);
            }

            var exitButton = game.add.button(bounds.x + bounds.width, bounds.y, exitImage, function () {
                this.hide();
                if (typeof this.onExitCallback === "function") {
                    this.onExitCallback.call(this.onExitContext);
                }
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            exitButton.anchor.set(1, 0);
            exitButton.width = this.controlsWidth;
            exitButton.height = this.tabHeight;

            //New Scroll bar layout
            var stepUpButton = game.add.button(bounds.x + bounds.width, bounds.y + this.tabHeight, stepUpImage, function () {
                this.currentPos = Math.max(this.currentPos - 1, 0);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepUpButton.anchor.set(1, 0);
            stepUpButton.width = this.controlsWidth;
            stepUpButton.height = this.controlsWidth;

            var stepDownButton = game.add.button(bounds.x + bounds.width, bounds.y + bounds.height, stepUpImage, function () {
                this.currentPos = Math.min(this.currentPos + 1, this.leaderboards[this.currentLeaderboard].length - 1);
                this.populateLeaderboards();
            }, this, 0, 1, 2, 3, this.leaderboardGroup);
            stepDownButton.anchor.set(1, 1);
            stepDownButton.width = this.controlsWidth;
            stepDownButton.height = -this.controlsWidth;

            var scrollBar = new ScrollBar(game, new Phaser.Rectangle(bounds.x + bounds.width - this.controlsWidth / 2, bounds.y + this.tabHeight * 2, 0, bounds.height - this.tabHeight - this.controlsWidth * 2), function (value) {
                if (this.leaderboards) {
                    this.currentPos = Math.floor(value / 100 * (this.leaderboards[this.currentLeaderboard].length - 1));
                    this.populateLeaderboards();
                }
            }, this, 'lb_scroll_head', 'lb_scroll_bar', this.leaderboardGroup, false);

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
            var yIncrement = (bounds.height - this.tabHeight) / this.slots;
            var yStart = bounds.x + bounds.halfHeight - this.slots / 2 * yIncrement + this.tabHeight;

            for (var i = 0; i < this.slots; i++) {
                this.playerNames[i] = game.add.text(bounds.x, yStart + yIncrement * i, "Retrieving...", nameStyle, this.leaderboardGroup);
                this.playerNames[i].anchor.set(0, 0.5);
                this.playerNames[i].inputEnabled = true;

                this.playerNames[i].events.onInputUp.add(this.nameOnUpFunction, this);
                this.playerNames[i].events.onInputOver.add(function () {
                }, this);
                this.playerNames[i].events.onInputDown.add(function () {
                }, this);
                this.playerNames[i].events.onInputOut.add(function () {
                }, this);

                this.playerScores[i] = game.add.text(bounds.x + bounds.width - this.controlsWidth - 5, yStart + yIncrement * i, "----", scoreStyle, this.leaderboardGroup);
                this.playerScores[i].anchor.set(1, 0.5);
            }

            LeaderboardMessages.requestScores(function (message) {
                for (var i = 0; i < message.leaderboards[0].length; i++) {
                    this.leaderboards = message.leaderboards;
                    this.populateLeaderboards.call(this, this.currentLeaderboard);
                    // pauseMenu.addTextAsButton(message.leaderboards.leaderboard_all_time[i].name + "\t\t" + message.leaderboards.leaderboard_all_time[i].score);
                }
            }, this);
        }
        LeaderboardDisplay.loadDefaults = function (game, local) {
            if (typeof local === "undefined") { local = false; }
            var images = [
                'lb_background',
                'lb_close',
                'lb_down',
                'lb_entry',
                'lb_left_arrow',
                'lb_scroll_bar',
                'lb_scroll_head',
                'lb_tab',
                'lb_up'
            ];

            if (local) {
                for (var alpha in images) {
                    game.load.image(images[alpha], 'assets/' + images[alpha] + '.png');
                }
            } else {
                for (var alpha in images) {
                    game.load.image(images[alpha], 'http://gitsumm.com/files/_/simon/Leaderboard Assets/' + images[alpha] + '.png');
                }
            }
        };

        LeaderboardDisplay.prototype.show = function () {
            this.leaderboardGroup.visible = true;

            LeaderboardMessages.requestScores(function (message) {
                this.leaderboards = message.leaderboards;
                this.populateLeaderboards.call(this, this.currentLeaderboard);
            }, this);
        };

        LeaderboardDisplay.prototype.hide = function () {
            this.leaderboardGroup.visible = false;
        };

        LeaderboardDisplay.prototype.nameOnUpFunction = function () {
        };

        LeaderboardDisplay.prototype.populateLeaderboards = function (leaderboardNumber, startingPos) {
            if (typeof leaderboardNumber === "undefined") { leaderboardNumber = this.currentLeaderboard; }
            this.currentPos = startingPos || this.currentPos;
            if (this.leaderboards !== undefined && this.leaderboards[leaderboardNumber] !== undefined) {
                for (var i = 0; i < this.playerNames.length; i++) {
                    this.playerNames[i].events.onInputUp.removeAll(this.leaderboards);
                    if (this.currentPos + i < this.leaderboards[leaderboardNumber].length) {
                        this.playerNames[i].setText(this.leaderboards[leaderboardNumber][this.currentPos + i].display_name);
                        this.playerNames[i].events.onInputUp.removeAll();
                        this.playerNames[i].events.onInputUp.add(this.nameOnUpFunction, this);
                        this.playerNames[i].events.onInputUp.add(function () {
                            window.open(this, '_blank');
                        }, 'http://gitsumm.com/live/members/' + this.leaderboards[leaderboardNumber][this.currentPos + i].nice_name);
                        this.playerScores[i].setText("" + this.leaderboards[leaderboardNumber][this.currentPos + i].score);
                    } else {
                        this.playerNames[i].setText("");
                        this.playerNames[i].events.onInputUp.removeAll();
                        this.playerNames[i].events.onInputUp.add(this.nameOnUpFunction, this);
                        this.playerScores[i].setText("");
                    }
                }
            }
        };
        return LeaderboardDisplay;
    })();
    summ.LeaderboardDisplay = LeaderboardDisplay;
})(summ || (summ = {}));
//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />
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

            this.menuBox = menuBounds || new Phaser.Rectangle(0, 0, this.game.width, this.game.height);

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
                    return this.addTextAsButton(text, callback, null, null, null, null, setButtonTextInContext, scaleX, scaleY, textStyle);
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
            return;
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

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            buttonText.inputEnabled = true;
            if (callback) {
                buttonText.events.onInputUp.add(callback, callbackContext);
                if (onOverSize)
                    buttonText.events.onInputUp.add(function () {
                        this.scale.set(onOverSize);
                    }, buttonText);
            }
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
            return buttonText;
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
        };

        PauseMenu.prototype.addExistingButton = function (buttonText, button) {
            button = button || null;
            this.buttons.push(button);

            this.buttonsText.push(buttonText);
            this.updateButtonPositions();
            return;
        };

        PauseMenu.prototype.showMenu = function () {
            if (this.backgroundSprite)
                this.game.add.existing(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.add.existing(this.buttons[i]);
                this.game.add.existing(this.buttonsText[i]);
            }

            if (this.onShowCallback)
                this.onShowCallback.call(this.showHideCallbackContext);
        };

        PauseMenu.prototype.hideMenu = function () {
            if (this.backgroundSprite)
                this.game.world.remove(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.world.remove(this.buttons[i]);
                this.game.world.remove(this.buttonsText[i]);
            }

            if (this.onHideCallback)
                this.onHideCallback.call(this.showHideCallbackContext);
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
        PauseMenu.prototype.manualPause = function (pause) {
            if (pause === undefined)
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
                    this.game.stage.preUpdate = function () {
                    };
                    this.updateFunction = this.game.stage.update;
                    this.game.stage.update = function () {
                        this.game.time.events.pause();
                    };

                    this.stateUpdate = this.game.state.update;
                    this.game.state.update = function () {
                    };

                    this.stagePostUpdate = this.game.stage.postUpdate;
                    this.game.stage.postUpdate = function () {
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

                    this.game.state.update = this.stateUpdate;

                    this.game.stage.postUpdate = this.stagePostUpdate;

                    this.game.tweens.update = this.tweenUpdate;
                    this.game.time.events.resume();
                    this.game.onResume.dispatch();
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

                    this.stateUpdate = this.game.state.update;
                    this.game.state.update = function () {
                    };

                    this.stagePostUpdate = this.game.stage.postUpdate;
                    this.game.stage.postUpdate = function () {
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

                    this.game.state.update = this.stateUpdate;

                    this.game.stage.postUpdate = this.stagePostUpdate;

                    this.game.tweens.update = this.tweenUpdate;
                    this.game.time.events.resume();
                    this.game.onResume.dispatch();

                    //Hide menu
                    this.hideMenu();
                }
            }
        };

        PauseMenu.prototype.handleClick = function (pointer) {
            for (var i = 0; i < this.buttonsText.length; i++) {
                if (this.buttons[i]) {
                    if (this.buttons[i].getBounds().contains(pointer.x, pointer.y)) {
                        this.buttons[i].onInputUpHandler(this.buttons[i], pointer, true);
                    }
                } else if (this.buttonsText[i].getBounds().contains(pointer.x, pointer.y)) {
                    this.buttonsText[i].events.onInputUp.dispatch(this.buttonsText[i], pointer, true);
                }
            }

            this.buttons.forEach(function (button) {
                if (button.getBounds().contains(pointer.x, pointer.y)) {
                    button.onInputUpHandler(button, pointer, true);
                }
            }, this);
        };
        return PauseMenu;
    })();
    summ.PauseMenu = PauseMenu;
})(summ || (summ = {}));
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var Ad = (function (_super) {
        __extends(Ad, _super);
        function Ad(game, x, y, width, height, key, frame, startDelay, upTime, onEnd, onEndContext, clickToClear, centerAnchor, stretchToFit, link) {
            if (typeof centerAnchor === "undefined") { centerAnchor = true; }
            if (typeof stretchToFit === "undefined") { stretchToFit = false; }
            this.upTime = upTime || 3000;
            this.onEnd = onEnd;
            this.onEndContext = onEndContext;
            this.clickToClear = clickToClear || true;

            _super.call(this, game, x, y, key, frame);

            if (link) {
                this.inputEnabled = true;
                this.events.onInputUp.addOnce(function () {
                    window.open(link, '_blank');
                }, this);
            }

            if (!stretchToFit) {
                var multiplier = Math.min((height / this.height), (width / this.width));
                this.width = Math.round(this.width * multiplier);
                this.height = Math.round(this.height * multiplier);
            } else {
                this.width = width;
                this.height = height;
            }

            if (centerAnchor)
                this.anchor.set(0.5);

            if (startDelay >= 0) {
                this.game.time.events.add(startDelay, function () {
                    this.show();
                }, this);
            }
        }
        Ad.prototype.show = function () {
            this.game.add.existing(this);
            this.game.time.events.add(this.upTime, function () {
                this.remove();
            }, this);

            if (this.clickToClear)
                this.game.input.onUp.addOnce(function () {
                    this.remove();
                }, this);
        };

        Ad.prototype.remove = function () {
            if (this.game) {
                this.game.time.events.remove;
                this.game.time.events.add(0, function () {
                    if (this)
                        this.destroy();
                }, this);
                if (typeof this.onEnd === 'function') {
                    this.onEnd.call(this.onEndContext);
                }
            }
        };
        return Ad;
    })(Phaser.Sprite);
    summ.Ad = Ad;
})(summ || (summ = {}));
//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var Preloader = (function () {
        function Preloader() {
        }
        Preloader.load = function (game, loadAssets, context, nextState) {
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
                    bar.x -= bar.width / 2;

                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context, this.game);
                    summ.LeaderboardDisplay.loadDefaults(this.game);
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
                    summ.LeaderboardDisplay.loadDefaults(this.game);
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
//#######################FullScreenSettings.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var FullScreenSettings = (function () {
        function FullScreenSettings() {
        }
        FullScreenSettings.apply = function (game) {
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            game.canvas.onresize = function () {
                game.scale.refresh();
            };

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
                } else {
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
                }

                this.scale.refresh();
            }, game);
        };
        return FullScreenSettings;
    })();
    summ.FullScreenSettings = FullScreenSettings;
})(summ || (summ = {}));
//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    //Just a comment
    var DepthSprite = (function (_super) {
        __extends(DepthSprite, _super);
        function DepthSprite(game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this._depth = 1;
            this._lastDepth = 1;
            this.anchor.set(0.5);
            this.xHorizon = this.game.width / 2;
            this.yHorizon = this.game.height / 2;
            this._xHorizon = this.xHorizon;
            this._yHorizon = this.yHorizon;
        }
        Object.defineProperty(DepthSprite.prototype, "depth", {
            get: function () {
                return this._depth;
            },
            set: function (value) {
                this._depth = value;
            },
            enumerable: true,
            configurable: true
        });

        DepthSprite.prototype.preUpdate = function () {
            this._halfWidth = this.game.width / 2;
            this._halfHeight = this.game.height / 2;
            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x *= this._lastDepth;
            this.y *= this._lastDepth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x * this._lastDepth, this.scale.y * this._lastDepth);
            _super.prototype.preUpdate.call(this);
        };

        DepthSprite.prototype.update = function () {
        };

        DepthSprite.prototype.postUpdate = function () {
            _super.prototype.postUpdate.call(this);

            this._lastDepth = this._depth;

            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x /= this._depth;
            this.y /= this._depth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x / this._depth, this.scale.y / this._depth);
        };
        return DepthSprite;
    })(Phaser.Sprite);
    summ.DepthSprite = DepthSprite;
})(summ || (summ = {}));
//# sourceMappingURL=summ-lib.js.map
