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
    exports.House = void 0;
    var House = /** @class */ (function () {
        function House(arg) {
            this.name = arg.name;
            this.gameType = arg.gameType;
            this.state = "waiting";
            this.status = null;
            this.hand = [];
        }
        Object.defineProperty(House.prototype, "openCard", {
            get: function () {
                return this.hand[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(House.prototype, "HandScore", {
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
        Object.defineProperty(House.prototype, "NumAce", {
            get: function () {
                return this.hand.filter(function (card) { return card.rank === "A"; }).length;
            },
            enumerable: false,
            configurable: true
        });
        House.prototype.isScoreOver16 = function () {
            return this.HandScore > 16;
        };
        House.prototype.getCard = function (card) {
            this.hand.push(card);
        };
        return House;
    }());
    exports.House = House;
});
