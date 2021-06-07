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
            this.log = [];
            this.deck = new Deck_1.Deck();
            this.user = new User_1.User(username);
            this.dealer = new Dealer_1.Dealer();
            for (var i = 1; i <= this.numBots; i++) {
                var newBot = new Bot_1.Bot("Bot" + i);
                this.bots.push(newBot);
                this.players.push(newBot);
            }
            this.players.push(this.user, this.dealer);
        }
        // ###########################################################################
        //  Each public method here is called in ViewController
        //  bet → distribution → userAct → botAct → dealerAct → evaluation → bet → ...
        // ###########################################################################
        Table.prototype.bet = function (userBetAmount) {
            var betLog = [];
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player instanceof Dealer_1.Dealer)
                    continue;
                if (player instanceof User_1.User)
                    player.bet(userBetAmount);
                if (player instanceof Bot_1.Bot)
                    player.bet();
                betLog.push(player.name + " has bet " + player.betAmount + "$");
            }
            this.log.push(betLog);
        };
        Table.prototype.distribution = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player instanceof Dealer_1.Dealer)
                    player.getCard(this.deck.drawOne());
                else {
                    player.getCard(this.deck.drawOne());
                    player.getCard(this.deck.drawOne());
                }
            }
        };
        Table.prototype.userAct = function (action) {
            console.log("userAct() is called");
            switch (action) {
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
            this.log.push([this.user.name + " has chosen to " + action]);
        };
        Table.prototype.botAct = function () {
            console.log("botAct() is called");
            var botActLog = [];
            for (var _i = 0, _a = this.bots; _i < _a.length; _i++) {
                var bot = _a[_i];
                while (!bot.isTurnEnd) {
                    var action = bot.makeAction(this.dealer.openCard);
                    switch (action) {
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
                    botActLog.push(bot.name + " has chosen to " + action);
                }
            }
            this.log.push(botActLog);
        };
        Table.prototype.dealerAct = function () {
            console.log("dealerAct() is called");
            this.dealer.getCard(this.deck.drawOne());
            var dealerActLog = [];
            while (!this.dealer.isTurnEnd) {
                this.dealer.hit(this.deck.drawOne());
                dealerActLog.push(this.dealer.name + " has chosen to hit");
            }
            this.log.push(dealerActLog);
        };
        Table.prototype.evaluation = function () {
            console.log("evaluation() is called");
            for (var _i = 0, _a = this.players.filter(function (player) { return !(player instanceof Dealer_1.Dealer); }); _i < _a.length; _i++) {
                var player = _a[_i];
                switch (player.status) {
                    case "surrender":
                        player.loseMoney(player.betAmount * .5);
                        break;
                    case "bust":
                        player.loseMoney(player.betAmount);
                        break;
                    case "doubleBust":
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
        Table.prototype.compareHand = function (player) {
            if (player.handScore > this.dealer.handScore)
                player.earnMoney(player.betAmount);
            if (player.handScore < this.dealer.handScore)
                player.loseMoney(player.betAmount);
        };
        Table.prototype.resetTable = function () {
            this.deck.resetDeck();
            this.players.forEach(function (player) { return player.resetState(); });
        };
        Table.betDenominations = [5, 20, 50, 100];
        return Table;
    }());
    exports.Table = Table;
});
