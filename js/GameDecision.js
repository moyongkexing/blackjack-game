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
    exports.GameDecision = void 0;
    var GameDecision = /** @class */ (function () {
        function GameDecision(arg) {
            this.action = arg.action;
            this.amount = arg.amount;
        }
        return GameDecision;
    }());
    exports.GameDecision = GameDecision;
});
