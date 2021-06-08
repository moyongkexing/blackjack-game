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
        define(["require", "exports", "./Player", "./Table", "./BotStrategies"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bot = void 0;
    var Player_1 = require("./Player");
    var Table_1 = require("./Table");
    var BotStrategies_1 = require("./BotStrategies");
    var Bot = /** @class */ (function (_super) {
        __extends(Bot, _super);
        function Bot(username) {
            var _this = _super.call(this, username) || this;
            _this.type = username.toUpperCase();
            return _this;
        }
        Bot.prototype.bet = function () {
            var randomIndex = Math.floor(Math.random() * 3);
            this.betAmount = this.money >= Table_1.Table.betDenominations[3] * 3 // betDenominations = [5,20,50,100];
                ? Table_1.Table.betDenominations[Table_1.Table.betDenominations.length - 1]
                : Table_1.Table.betDenominations[randomIndex];
        };
        Bot.prototype.makeAction = function (openCard) {
            var strategy = BotStrategies_1.BotStrategies[String(openCard.rankNum)]; // src/BotStrategies.ts
            var actions = Object.keys(strategy);
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var action = actions_1[_i];
                if (strategy[action].indexOf(this.handScore) !== -1) {
                    if (action === "double")
                        return this.betAmount * 2 <= this.money ? "double" : "hit";
                }
            }
            return "stand";
        };
        return Bot;
    }(Player_1.Player));
    exports.Bot = Bot;
});
