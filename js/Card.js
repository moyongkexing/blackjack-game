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
    exports.Card = void 0;
    var Card = /** @class */ (function () {
        function Card(arg) {
            this.suit = arg.suit;
            this.rank = arg.rank;
        }
        Object.defineProperty(Card.prototype, "RankNum", {
            get: function () {
                var hash = {
                    A: 11, J: 10, Q: 10, K: 10,
                };
                if (hash[this.rank] !== undefined)
                    return hash[this.rank];
                return Number(this.rank);
            },
            enumerable: false,
            configurable: true
        });
        return Card;
    }());
    exports.Card = Card;
});
