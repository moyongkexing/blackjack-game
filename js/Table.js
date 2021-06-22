(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Deck", "./User", "./Bot", "./Dealer", "./types/ActionType", "./types/StatusType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    var Deck_1 = require("./Deck");
    var User_1 = require("./User");
    var Bot_1 = require("./Bot");
    var Dealer_1 = require("./Dealer");
    var ActionType_1 = require("./types/ActionType");
    var StatusType_1 = require("./types/StatusType");
    var Table = /** @class */ (function () {
        function Table(username) {
            this.players = [];
            this.turnCounter = 0;
            this.turnLog = [];
            // private cardCountingTotal: number = 0;
            this.cardCountingTotal = 0;
            this.deck = new Deck_1.Deck();
            this.user = new User_1.User(username);
            this.dealer = new Dealer_1.Dealer();
            this.players.push(this.dealer, this.user, new Bot_1.Bot("Bot1"), new Bot_1.Bot("Bot2"));
        }
        Table.getInstance = function (username) {
            if (Table.instance)
                return Table.instance;
            Table.instance = new Table(username);
            return Table.instance;
        };
        // ######################################
        //  Each public method here is called in View class
        //  bet → distribution → userAct → botAct → dealerOpen → dealerAct → evaluation → bet → ...
        // ######################################
        Table.prototype.bet = function (userBetAmount) {
            this.turnCounter++;
            var betLog = [
                "---------------------------------------------",
                "Turn " + this.turnCounter + "."
            ];
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player instanceof Dealer_1.Dealer)
                    continue;
                if (player instanceof User_1.User)
                    player.makeBet(userBetAmount);
                if (player instanceof Bot_1.Bot)
                    player.makeBet(this.cardCountingTotal);
                betLog.push(player.name + " has bet " + player.betAmount + "$.");
            }
            this.turnLog.push(betLog);
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
            if (this.user.isTurnEnd)
                return;
            switch (action) {
                case ActionType_1.Action.SURRENDER:
                    this.user.surrender();
                    break;
                case ActionType_1.Action.STAND:
                    this.user.stand();
                    break;
                case ActionType_1.Action.HIT:
                    this.user.hit(this.deck.drawOne());
                    break;
                case ActionType_1.Action.DOUBLE:
                    this.user.double(this.deck.drawOne());
                    break;
            }
            this.turnLog.push([this.user.name + " has chosen to " + action + "."]);
        };
        Table.prototype.botAct = function (bot) {
            var botActLog = [];
            while (!bot.isTurnEnd) {
                var action = bot.makeAction(this.dealer.openCard);
                switch (action) {
                    case ActionType_1.Action.SURRENDER:
                        bot.surrender();
                        break;
                    case ActionType_1.Action.STAND:
                        bot.stand();
                        break;
                    case ActionType_1.Action.HIT:
                        bot.hit(this.deck.drawOne());
                        break;
                    case ActionType_1.Action.DOUBLE:
                        bot.double(this.deck.drawOne());
                        break;
                }
                botActLog.push(bot.name + " has chosen to " + action + ".");
            }
            this.turnLog.push(botActLog);
        };
        Table.prototype.dealerOpen = function () {
            this.dealer.hit(this.deck.drawOne());
            this.turnLog.push([this.dealer.name + " opened the first card."]);
        };
        Table.prototype.dealerAct = function () {
            var log = [];
            while (!this.dealer.isTurnEnd) {
                this.dealer.hit(this.deck.drawOne());
                log.push(this.dealer.name + " has hit.");
            }
            this.turnLog.push(log);
        };
        Table.prototype.evaluation = function () {
            var log = [];
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player instanceof Dealer_1.Dealer)
                    continue;
                var result = "push";
                switch (player.status) {
                    case StatusType_1.ChallengerStatus.SURRENDER:
                    case StatusType_1.ChallengerStatus.BUST:
                    case StatusType_1.ChallengerStatus.DOUBLEBUST: {
                        result = "lose";
                        break;
                    }
                    case StatusType_1.ChallengerStatus.BLACKJACK: {
                        if (this.dealer.status !== StatusType_1.DealerStatus.BLACKJACK)
                            result = "win";
                        break;
                    }
                    case StatusType_1.ChallengerStatus.STAND:
                    case StatusType_1.ChallengerStatus.DOUBLE: {
                        result = this.compareHand(player);
                        break;
                    }
                }
                var exMoney = player.money;
                if (result !== "push")
                    player.calculation(result);
                log.push(player.name + " " + result + ". (" + exMoney + "$ \u2192 " + player.money + "$)");
            }
            this.turnLog.push(log);
            this.setCardCountingTotal();
            console.log(this.cardCountingTotal);
            if (this.deck.remain <= 10)
                this.resetDeck();
        };
        Table.prototype.resetDeck = function () {
            this.deck.resetDeck();
            this.cardCountingTotal = 0;
        };
        Table.prototype.gameOver = function () {
            this.turnLog.push(["Game Over!"]);
        };
        Table.prototype.compareHand = function (player) {
            if (this.dealer.status === StatusType_1.DealerStatus.BLACKJACK)
                return "lose";
            if (this.dealer.status === StatusType_1.DealerStatus.BUST)
                return "win";
            var diff = player.handScore - this.dealer.handScore;
            return diff > 0 ? "win" : diff < 0 ? "lose" : "push";
        };
        Table.prototype.setCardCountingTotal = function () {
            var _loop_1 = function (player) {
                var score = 0;
                player.hand.forEach(function (card) { return score += card.cardCountingValue; });
                this_1.cardCountingTotal += score;
            };
            var this_1 = this;
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                _loop_1(player);
            }
        };
        Table.betDenominations = [5, 20, 50, 100];
        return Table;
    }());
    exports.Table = Table;
});
