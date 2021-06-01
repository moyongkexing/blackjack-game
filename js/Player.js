(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Table"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    var Table_1 = require("./Table");
    var Player = /** @class */ (function () {
        function Player(username) {
            this.name = username;
            this.status = "initial";
            this.hand = [];
            this.money = Player.initialMoney;
            this.betAmount = 0;
            this.winAmount = 0;
        }
        Object.defineProperty(Player.prototype, "handScore", {
            get: function () {
                var score = 0;
                for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                    var card = _a[_i];
                    score += card.RankNum;
                }
                // 21を超えている場合、エースがあれば10を引く(Rankを11から1に切り替える)
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
                return this.money < Table_1.Table.betDenominations[0]; // Table.betDenominations[0] = 5
            },
            enumerable: false,
            configurable: true
        });
        Player.prototype.loseMoney = function (amount) {
            this.money -= amount;
        };
        Player.prototype.earnMoney = function (amount) {
            this.money += amount;
        };
        Player.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.isBlackjack)
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
            if (this.handScore > 21)
                this.status = "bust";
        };
        Player.prototype.double = function (card) {
            this.getCard(card);
            if (this.handScore > 21)
                this.status = "doublebust";
        };
        Player.initialMoney = 400;
        return Player;
    }());
    exports.Player = Player;
});
