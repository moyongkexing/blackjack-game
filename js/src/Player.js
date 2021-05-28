(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    var Player = /** @class */ (function () {
        function Player(arg) {
            this.name = arg.name;
            this.gameType = arg.gameType;
            this.action = null;
            this.status = null;
            this.hand = [];
            this.money = 400;
            this.betAmount = 0; // 不要かも
            this.winAmount = 0; // 不要かも
        }
        Object.defineProperty(Player.prototype, "HandScore", {
            get: function () {
                var score = 0;
                for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                    var card = _a[_i];
                    score += card.RankNum;
                }
                // 21を超えている場合、エースがあれば10を引く
                var numAce = this.NumAce;
                while (score > 21 && numAce > 0) {
                    score -= 10;
                    numAce--;
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
        Player.prototype.hasAce = function () {
            return this.NumAce > 0;
        };
        Player.prototype.isScore21 = function () {
            return this.HandScore === 21;
        };
        Player.prototype.isScoreOver21 = function () {
            return this.HandScore > 21;
        };
        Player.prototype.isBlackjack = function () {
            return this.isScore21() && this.hasAce();
        };
        Player.prototype.isBroke = function () {
            return this.money === 0;
        };
        Player.prototype.loseMoney = function (amount) {
            this.money -= amount;
        };
        Player.prototype.earnMoney = function () {
        };
        Player.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.isBlackjack())
                this.status = "blackjack";
        };
        Player.prototype.surrender = function () {
            this.status = "surrender";
        };
        Player.prototype.stand = function () {
            this.status = "stand";
        };
        Player.prototype.hit = function (card) {
            this.getCard(card);
            if (this.isScoreOver21())
                this.status = "bust";
        };
        Player.prototype.double = function (card) {
            this.getCard(card);
            if (this.isScoreOver21())
                this.status = "doublebust";
        };
        return Player;
    }());
    exports.Player = Player;
});
