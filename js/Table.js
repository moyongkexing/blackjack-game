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
            this.deck = new Deck_1.Deck();
            this.dealer = new Dealer_1.Dealer();
            this.user = new User_1.User(username);
            for (var i = 1; i <= this.numBots; i++) {
                var newBot = new Bot_1.Bot("BOT " + i);
                this.bots.push(newBot);
                this.players.push(newBot);
            }
            this.players.push(this.user);
            this.resultLog = ["Have fun!"];
        }
        // Each method here is called in ViewContoller
        // bet → distribution → {player}Act → evaluation → bet → ... as blackjack's flow
        Table.prototype.bet = function (userBetAmount) {
            this.user.bet(userBetAmount);
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                bot.bet();
            }
        };
        Table.prototype.distribution = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.getCard(this.deck.drawOne());
                player.getCard(this.deck.drawOne());
            }
            this.dealer.getCard(this.deck.drawOne());
        };
        Table.prototype.userAct = function (userAction) {
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
        };
        Table.prototype.botAct = function () {
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
                }
            }
        };
        Table.prototype.dealerAct = function () {
            this.dealer.getCard(this.deck.drawOne());
            while (this.dealer.handScore < 17)
                this.dealer.hit(this.deck.drawOne());
        };
        Table.prototype.evaluation = function () {
            console.log("evaluation() is called");
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                // player.status = "surrender" || "stand" || "bust" || "doublebust" || "blackjack" ;
                // dealer.status = "bust" || "blackjack" || "stand"; ;
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
