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
    exports.DealerStatus = exports.ChallengerStatus = void 0;
    var ChallengerStatus;
    (function (ChallengerStatus) {
        ChallengerStatus["INITIAL"] = "Initial";
        ChallengerStatus["SURRENDER"] = "Surrender";
        ChallengerStatus["STAND"] = "Stand";
        ChallengerStatus["BUST"] = "Bust";
        ChallengerStatus["DOUBLE"] = "Double";
        ChallengerStatus["DOUBLEBUST"] = "DoubleBust";
        ChallengerStatus["BLACKJACK"] = "Blackjack";
    })(ChallengerStatus || (ChallengerStatus = {}));
    exports.ChallengerStatus = ChallengerStatus;
    var DealerStatus;
    (function (DealerStatus) {
        DealerStatus["INITIAL"] = "Initial";
        DealerStatus["STAND"] = "Stand";
        DealerStatus["BUST"] = "Bust";
        DealerStatus["BLACKJACK"] = "Blackjack";
    })(DealerStatus || (DealerStatus = {}));
    exports.DealerStatus = DealerStatus;
});
