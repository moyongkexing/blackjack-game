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
    exports.Dealer = void 0;
    var Dealer = /** @class */ (function () {
        function Dealer() {
            this.name = "Dealer";
            this.status = "stand";
            this.hand = [];
        }
        Object.defineProperty(Dealer.prototype, "openCard", {
            get: function () {
                return this.hand[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dealer.prototype, "handScore", {
            get: function () {
                var score = 0;
                for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
                    var card = _a[_i];
                    score += card.rankNum;
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
        Object.defineProperty(Dealer.prototype, "NumAce", {
            get: function () {
                return this.hand.filter(function (card) { return card.rank === "A"; }).length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dealer.prototype, "isBlackjack", {
            get: function () {
                return this.handScore === 21 && this.NumAce > 0;
            },
            enumerable: false,
            configurable: true
        });
        Dealer.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.hand.length === 2 && this.isBlackjack)
                this.status = "blackjack";
        };
        Dealer.prototype.hit = function (card) {
            this.getCard(card);
            if (this.handScore > 21)
                this.status = "bust";
        };
        return Dealer;
    }());
    exports.Dealer = Dealer;
});
