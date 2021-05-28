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
    exports.User = void 0;
    var Player_1 = require("./Player");
    var Table_1 = require("./Table");
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User(arg) {
            var _this = _super.call(this, { name: arg.name, gameType: arg.gameType }) || this;
            _this.playerType = "User";
            return _this;
        }
        // これはModelにViewの状態が依存してる悪い例...?
        User.prototype.getBetAmount = function () {
            var amount = 0;
            // Table.betDenominations = [5,20,50,100]
            for (var _i = 0, _a = Table_1.Table.betDenominations; _i < _a.length; _i++) {
                var bd = _a[_i];
                var label = document.getElementById("betLabel" + bd).innerText;
                var value = document.getElementById("betInput" + bd).value;
                amount += parseInt(label) * parseInt(value);
            }
            return amount;
        };
        User.prototype.makeAction = function () {
            // idのvalueをもってきてaction
        };
        User.prototype.bet = function () {
            this.betAmount = this.getBetAmount();
        };
        return User;
    }(Player_1.Player));
    exports.User = User;
});
