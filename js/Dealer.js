(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./types/StatusType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dealer = void 0;
    var StatusType_1 = require("./types/StatusType");
    var Dealer = /** @class */ (function () {
        function Dealer() {
            this.name = "Dealer";
            this.hand = [];
            this.status = StatusType_1.DealerStatus.INITIAL;
            this.isTurnEnd = false;
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
                // If score is over 21, subtract 10 if there is an ace in one's hand(switch the rank from 11 to 1).
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
        Object.defineProperty(Dealer.prototype, "numAce", {
            get: function () {
                return this.hand.filter(function (card) { return card.rank === "A"; }).length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Dealer.prototype, "isBlackjack", {
            get: function () {
                return this.handScore === 21 && this.numAce > 0;
            },
            enumerable: false,
            configurable: true
        });
        Dealer.prototype.getCard = function (card) {
            this.hand.push(card);
            if (this.hand.length === 2 && this.isBlackjack) {
                this.status = StatusType_1.DealerStatus.BLACKJACK;
                this.isTurnEnd = true;
            }
        };
        Dealer.prototype.stand = function () {
            this.status = StatusType_1.DealerStatus.STAND;
            this.isTurnEnd = true;
        };
        Dealer.prototype.hit = function (card) {
            this.getCard(card);
            if (this.handScore > 16)
                this.stand();
            if (this.handScore > 21)
                this.status = StatusType_1.DealerStatus.BUST;
        };
        Dealer.prototype.resetState = function () {
            this.hand = [];
            this.status = StatusType_1.DealerStatus.INITIAL;
            this.isTurnEnd = false;
        };
        return Dealer;
    }());
    exports.Dealer = Dealer;
});
