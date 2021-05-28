var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Player", "./Table"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bot = void 0;
    var Player_1 = require("./Player");
    var Table_1 = require("./Table");
    var Bot = /** @class */ (function (_super) {
        __extends(Bot, _super);
        function Bot(arg) {
            return _super.call(this, { name: arg.name, gameType: arg.gameType }) || this;
        }
        Bot.prototype.getBetAmount = function () {
            // Table.betDenominations = [5,20,50,100]
            var random = this.money <= Table_1.Table.betDenominations[3] * 3
                ? Math.floor(Math.random() * Table_1.Table.betDenominations.length - 2)
                : Math.floor(Math.random() * Table_1.Table.betDenominations.length - 1);
            return Table_1.Table.betDenominations[random];
        };
        Bot.prototype.makeAction = function () {
            // if(this.isScoreOver16()) return "hit"
        };
        Bot.prototype.bet = function () {
            this.betAmount = this.getBetAmount();
        };
        Bot.prototype.isScoreOver16 = function () {
            return this.HandScore > 16;
        };
        return Bot;
    }(Player_1.Player));
    exports.Bot = Bot;
});
