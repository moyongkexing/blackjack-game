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
    exports.Challenger = void 0;
    var Table_1 = require("./Table");
    var StatusType_1 = require("./types/StatusType");
    var Challenger = /** @class */ (function () {
        function Challenger(username) {
            this.username = username;
            this.hand = [];
            this.money = 400;
            this.betAmount = Table_1.Table.betDenominations[0];
            this.status = StatusType_1.ChallengerStatus.INITIAL;
            this.isTurnEnd = false;
            this.name = username;
        }
        Object.defineProperty(Challenger.prototype, "handScore", {
            get: function () {
                var score = 0;
                for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                    var card = _a[_i];
                    score += card.rankNum;
                }
                // If the score is over 21, subtract 10 if there is an Ace in Challenger's hand (switch rank of Ace from 11 to 1)
                var i = this.numAce;
                while (score > 21 && i > 0) {
                    score -= 10;
                    i--;
                }
                return score;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Challenger.prototype, "numAce", {
            get: function () {
                return this.hand.filter(function (card) { return card.rank === "A"; }).length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Challenger.prototype, "isBlackjack", {
            get: function () {
                return this.handScore === 21 && this.numAce > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Challenger.prototype, "isBroke", {
            get: function () {
                return this.money < Table_1.Table.betDenominations[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Challenger.prototype, "canHit", {
            get: function () {
                return this.status !== StatusType_1.ChallengerStatus.DOUBLE;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Challenger.prototype, "canDouble", {
            get: function () {
                return this.money >= this.betAmount * 2 && this.status !== StatusType_1.ChallengerStatus.DOUBLE;
            },
            enumerable: false,
            configurable: true
        });
        Challenger.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.hand.length === 2 && this.isBlackjack) {
                this.status = StatusType_1.ChallengerStatus.BLACKJACK;
                this.isTurnEnd = true;
            }
        };
        Challenger.prototype.surrender = function () {
            this.status = StatusType_1.ChallengerStatus.SURRENDER;
            this.isTurnEnd = true;
        };
        Challenger.prototype.stand = function () {
            this.status = StatusType_1.ChallengerStatus.STAND;
            this.isTurnEnd = true;
        };
        Challenger.prototype.hit = function (card) {
            this.getCard(card);
            if (this.handScore > 21) {
                this.status = StatusType_1.ChallengerStatus.BUST;
                this.isTurnEnd = true;
            }
        };
        Challenger.prototype.double = function (card) {
            this.getCard(card);
            this.status = StatusType_1.ChallengerStatus.DOUBLE;
            if (this.handScore > 21) {
                this.status = StatusType_1.ChallengerStatus.DOUBLEBUST;
                this.isTurnEnd = true;
            }
        };
        Challenger.prototype.resetState = function () {
            this.hand = [];
            this.betAmount = Table_1.Table.betDenominations[0];
            this.status = StatusType_1.ChallengerStatus.INITIAL;
            this.isTurnEnd = false;
        };
        Challenger.prototype.updateMoney = function (result) {
            var map = {
                Surrender: -0.5,
                Bust: -1,
                DoubleBust: -2,
                Stand: result === "win" ? 1 : -1,
                Double: result === "win" ? 2 : -2,
                Blackjack: 1.5,
            };
            this.money += Math.floor(this.betAmount * map[this.status]);
        };
        return Challenger;
    }());
    exports.Challenger = Challenger;
});
