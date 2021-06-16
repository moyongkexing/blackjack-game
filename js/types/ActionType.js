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
    exports.Action = void 0;
    var Action;
    (function (Action) {
        Action["SURRENDER"] = "Surrender";
        Action["STAND"] = "Stand";
        Action["HIT"] = "Hit";
        Action["DOUBLE"] = "Double";
    })(Action = exports.Action || (exports.Action = {}));
});
