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
        define(["require", "exports", "./Challenger", "./Table", "./BotStrategies", "./types/ActionType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bot = void 0;
    var Challenger_1 = require("./Challenger");
    var Table_1 = require("./Table");
    var BotStrategies_1 = require("./BotStrategies");
    var ActionType_1 = require("./types/ActionType");
    var Bot = /** @class */ (function (_super) {
        __extends(Bot, _super);
        function Bot(username) {
            var _this = _super.call(this, username) || this;
            _this.id = username.toUpperCase();
            return _this;
        }
        Bot.prototype.makeBet = function () {
            var lastIndex = Table_1.Table.betDenominations.length - 1;
            var randomIndex = Math.floor(Math.random() * lastIndex);
            this.betAmount = this.money >= lastIndex * 3
                ? Table_1.Table.betDenominations[lastIndex]
                : Table_1.Table.betDenominations[randomIndex];
        };
        Bot.prototype.makeAction = function (openCard) {
            var strategy = BotStrategies_1.BotStrategies[String(openCard.rankNum)];
            var actions = Object.keys(strategy);
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var action = actions_1[_i];
                if (strategy[action].indexOf(this.handScore) !== -1) {
                    // If bot doesn't have enough money, choose to hit instead of double
                    if (action === "Double")
                        return this.canDouble ? ActionType_1.Action.DOUBLE : ActionType_1.Action.HIT;
                    else
                        return action;
                }
            }
            return ActionType_1.Action.STAND;
        };
        return Bot;
    }(Challenger_1.Challenger));
    exports.Bot = Bot;
});
