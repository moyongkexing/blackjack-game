(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Table", "./types/StatusType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    var Table_1 = require("./Table");
    var StatusType_1 = require("./types/StatusType");
    var Player = /** @class */ (function () {
        function Player(username) {
            this.hand = [];
            this.money = 400;
            this.betAmount = Table_1.Table.betDenominations[0];
            this.status = StatusType_1.PlayerStatus.INITIAL;
            this.isTurnEnd = false;
            this.name = username;
        }
        Object.defineProperty(Player.prototype, "handScore", {
            get: function () {
                var score = 0;
                for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                    var card = _a[_i];
                    score += card.rankNum;
                }
                // If the score is over 21, subtract 10 if there is an Ace in player's hand (switch rank of Ace from 11 to 1)
                var i = this.NumAce;
                while (score > 21 && i > 0) {
                    score -= 10;
                    i--;
                }
                return score;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "NumAce", {
            get: function () {
                return this.hand.filter(function (card) { return card.rank === "A"; }).length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isBlackjack", {
            get: function () {
                return this.handScore === 21 && this.NumAce > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "isBroke", {
            get: function () {
                return this.money < Table_1.Table.betDenominations[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "canDouble", {
            get: function () {
                return this.money >= this.betAmount * 2;
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.hand.length === 2 && this.isBlackjack) {
                this.status = StatusType_1.PlayerStatus.BLACKJACK;
                this.isTurnEnd = true;
            }
        };
        Player.prototype.surrender = function () {
            this.status = StatusType_1.PlayerStatus.SURRENDER;
            this.isTurnEnd = true;
        };
        Player.prototype.stand = function () {
            this.status = StatusType_1.PlayerStatus.STAND;
            this.isTurnEnd = true;
        };
        Player.prototype.hit = function (card) {
            this.getCard(card);
            if (this.handScore > 21) {
                this.status = StatusType_1.PlayerStatus.BUST;
                this.isTurnEnd = true;
            }
        };
        Player.prototype.double = function (card) {
            this.getCard(card);
            this.status = StatusType_1.PlayerStatus.DOUBLE;
            if (this.handScore > 21)
                this.status = StatusType_1.PlayerStatus.DOUBLEBUST;
            this.isTurnEnd = true;
        };
        Player.prototype.resetState = function () {
            this.hand = [];
            this.betAmount = Table_1.Table.betDenominations[0];
            this.status = StatusType_1.PlayerStatus.INITIAL;
            this.isTurnEnd = false;
        };
        Player.prototype.calculation = function (result) {
            var map = {
                Surrender: -0.5,
                Bust: -1,
                DoubleBust: -2,
                Stand: result === "win" ? 1 : -1,
                Double: result === "win" ? 2 : -2,
                Blackjack: 1.5,
            };
            this.money += Math.floor(this.betAmount * map[status]);
        };
        return Player;
    }());
    exports.Player = Player;
});
