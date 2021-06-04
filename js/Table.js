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
            this.bots = [];
            this.players = [];
            this.resultLog = [];
            this.deck = new Deck_1.Deck();
            this.dealer = new Dealer_1.Dealer();
            this.user = new User_1.User(username);
            this.players.push(this.user);
            for (var i = 1; i <= this.numBots; i++) {
                var newBot = new Bot_1.Bot("Bot" + i);
                this.bots.push(newBot);
                this.players.push(newBot);
            }
        }
        // #####################################################################
        // Each public method in this class is called in ViewContoller
        // bet → distribution → {player}Act → evaluation → bet → distribution →...
        // #####################################################################
        Table.prototype.bet = function (userBetAmount) {
            this.user.bet(userBetAmount);
            this.resultLog.push(this.user.generateLog("bet"));
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                bot.bet();
                this.resultLog.push(bot.generateLog("bet"));
            }
        };
        Table.prototype.distribution = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.getCard(this.deck.drawOne());
                player.getCard(this.deck.drawOne());
            }
            this.dealer.getCard(this.deck.drawOne());
            this.dealer.getCard(this.deck.drawOne());
        };
        Table.prototype.userAct = function (userAction) {
            console.log("userAct() is called");
            switch (userAction) {
                case "surrender":
                    this.user.surrender();
                    break;
                case "stand":
                    this.user.stand();
                    break;
                case "hit":
                    this.user.hit(this.deck.drawOne());
                    break;
                case "double":
                    this.user.double(this.deck.drawOne());
                    break;
            }
            this.resultLog.push(this.user.generateLog(userAction));
        };
        Table.prototype.botAct = function () {
            console.log("botAct() is called");
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                while (!bot.isTurnEnd) {
                    var botAction = bot.makeAction(this.dealer.openCard);
                    switch (botAction) {
                        case "surrender":
                            bot.surrender();
                            break;
                        case "stand":
                            bot.stand();
                            break;
                        case "hit":
                            bot.hit(this.deck.drawOne());
                            break;
                        case "double":
                            bot.double(this.deck.drawOne());
                            break;
                    }
                    this.resultLog.push(bot.generateLog(botAction));
                }
            }
        };
        Table.prototype.dealerAct = function () {
            console.log("dealerAct() is called");
            while (!this.dealer.isTurnEnd) {
                this.dealer.hit(this.deck.drawOne());
                this.resultLog.push(this.dealer.generateLog("hit"));
            }
        };
        Table.prototype.evaluation = function () {
            console.log("evaluation() is called");
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                switch (player.status) {
                    case "surrender":
                        player.loseMoney(player.betAmount * .5);
                        break;
                    case "bust":
                        player.loseMoney(player.betAmount);
                        break;
                    case "doublebust":
                        player.loseMoney(player.betAmount * 2);
                        break;
                    case "stand":
                        {
                            switch (this.dealer.status) {
                                case "bust":
                                    player.earnMoney(player.betAmount);
                                    break;
                                case "stand":
                                    this.compareHand(player);
                                    break;
                                case "blackjack":
                                    player.loseMoney(player.betAmount);
                                    break;
                                default: break;
                            }
                        }
                        break;
                    case "blackjack": {
                        if (this.dealer.status === "blackjack")
                            break;
                        else
                            player.earnMoney(player.betAmount * 1.5);
                        break;
                    }
                }
            }
        };
        Table.prototype.reset = function () {
            this.deck.resetDeck();
            this.dealer.resetState();
            this.players.forEach(function (player) { return player.resetState(); });
        };
        Table.prototype.compareHand = function (player) {
            if (player.handScore > this.dealer.handScore) {
                player.earnMoney(player.betAmount);
            }
            if (player.handScore < this.dealer.handScore) {
                player.loseMoney(player.betAmount);
            }
        };
        Table.betDenominations = [5, 20, 50, 100];
        return Table;
    }());
    exports.Table = Table;
});
