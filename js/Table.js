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
        function Table(username) {
            this.numBots = 2;
            this.numInitialHands = 2;
            this.players = [];
            this.deck = new Deck_1.Deck();
            this.dealer = new Dealer_1.Dealer();
            this.user = new User_1.User(username);
            this.players.push(this.user);
            for (var i = 1; i <= this.numBots; i++) {
                this.players.push(new Bot_1.Bot("BOT " + i));
            }
            this.resultLog = ["Have fun!"];
        }
        Table.prototype.betPhase = function (userBetAmount) {
            // this.players = [User, Bot, Bot]
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                switch (player.playerType) {
                    case "User":
                        player.bet(userBetAmount);
                        break;
                    case "Bot": player.bet();
                }
            }
            this.distributePhase();
        };
        Table.prototype.distributePhase = function () {
            var _this = this;
            console.log("distributePhaseが呼ばれた");
            var _loop_1 = function (player) {
                __spreadArray([], Array(this_1.numInitialHands)).forEach(function () { return player.getCard(_this.deck.drawOne()); });
            };
            var this_1 = this;
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                _loop_1(player);
            }
            this.dealer.getCard(this.deck.drawOne());
            this.players.forEach(function (player) { return console.log(player.hand); });
        };
        Table.prototype.actPhase = function (userAction) {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.isBlackjack)
                    continue;
                var isTurnEnd = false;
                while (!isTurnEnd) {
                    // BOT determines the action based on the rank of the dealer's open cards
                    var action = player.playerType === "User"
                        ? userAction
                        : player.makeAction(this.dealer.openCard);
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
