(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Card"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deck = void 0;
    var Card_1 = require("./Card");
    var Deck = /** @class */ (function () {
        function Deck(arg) {
            this.cards = [];
            this.resetDeck(arg.gameType);
        }
        Deck.prototype.resetDeck = function (gameType) {
            this.cards = [];
            switch (gameType) {
                case "Blackjack":
                    this.createDeckBJ();
                    break;
                case "Poker":
                    this.createDeckPoker();
                    break;
            }
            this.shuffle();
        };
        Deck.prototype.createDeckBJ = function () {
            for (var _i = 0, _a = Deck.suits; _i < _a.length; _i++) {
                var suit = _a[_i];
                for (var _b = 0, _c = Deck.ranks; _b < _c.length; _b++) {
                    var rank = _c[_b];
                    this.cards.push(new Card_1.Card({ suit: suit, rank: rank }));
                }
            }
        };
        Deck.prototype.createDeckPoker = function () {
            // 今回実装しない
        };
        Deck.prototype.shuffle = function () {
            var len = this.cards.length;
            for (var i = 0; i < len; i++) {
                var random = Math.floor(Math.random() * (len - i));
                var temp = this.cards[i];
                this.cards[i] = this.cards[random];
                this.cards[random] = temp;
            }
        };
        Deck.prototype.drawOne = function () {
            return this.cards.pop();
        };
        Deck.suits = ["H", "D", "C", "S"];
        Deck.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        return Deck;
    }());
    exports.Deck = Deck;
});
