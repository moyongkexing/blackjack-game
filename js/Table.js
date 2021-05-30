var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Deck", "./User", "./Bot", "./Dealer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    var Deck_1 = require("./Deck");
    var User_1 = require("./User");
    var Bot_1 = require("./Bot");
    var Dealer_1 = require("./Dealer");
    var Table = /** @class */ (function () {
        function Table(gameType, username) {
            this.numBots = 2;
            this.numInitialHands = 2;
            this.gameType = gameType;
            this.deck = new Deck_1.Deck({ gameType: this.gameType });
            this.dealer = new Dealer_1.Dealer({ name: "DEALER", gameType: this.gameType });
            this.user = new User_1.User({ name: username, gameType: this.gameType });
            switch (this.gameType) {
                case "Blackjack":
                    this.bots = this.generateBotsBJ();
                    break;
                case "Poker":
                    this.bots = this.generatePlayerArrPoker();
                    break;
            }
            this.players = this.bots;
            this.players.push(this.user);
            this.resultLog = ["Have fun!"];
        }
        Table.prototype.generateBotsBJ = function () {
            var _this = this;
            var arr = [];
            __spreadArray([], Array(this.numBots)).forEach(function (i) {
                arr.push(new Bot_1.Bot({ name: "\u30DC\u30C3\u30C8" + i + "\u53F7", gameType: _this.gameType }));
            });
            return arr;
        };
        Table.prototype.generatePlayerArrPoker = function () {
            // 今回実装しない
            return [];
        };
        Table.prototype.proceedBJ = function () {
            while (!this.user.isBroke) {
                this.betPhase();
                this.distributePhase();
                this.actPhase();
                this.evaluatePhase();
            }
            // ユーザーが破産したときの処理をここに書く
        };
        Table.prototype.betPhase = function () {
            // this.players = [Bot, Bot, User]
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.bet();
            }
        };
        Table.prototype.distributePhase = function () {
            var _this = this;
            var _loop_1 = function (player) {
                __spreadArray([], Array(this_1.numInitialHands)).forEach(function () { return player.getCard(_this.deck.drawOne()); });
            };
            var this_1 = this;
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                _loop_1(player);
            }
            this.dealer.getCard(this.deck.drawOne());
        };
        Table.prototype.actPhase = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.isBlackjack)
                    continue;
                // プレーヤーはsurrenderかstandするまでmakeAction()を繰り返す
                var isTurnEnd = false;
                while (!isTurnEnd) {
                    var action = player.playerType === "Bot"
                        ? player.makeAction(this.dealer.openCard)
                        : player.makeAction();
                    switch (action) {
                        case "surrender": {
                            player.surrender();
                            isTurnEnd = true;
                            break;
                        }
                        case "stand": {
                            player.stand();
                            isTurnEnd = true;
                            break;
                        }
                        case "hit":
                            player.hit(this.deck.drawOne());
                            break;
                        case "double":
                            player.double(this.deck.drawOne());
                            break;
                    }
                }
            }
        };
        Table.prototype.evaluatePhase = function () {
        };
        Table.betDenominations = [5, 20, 50, 100];
        return Table;
    }());
    exports.Table = Table;
});
