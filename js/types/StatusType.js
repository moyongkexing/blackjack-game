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
    exports.DealerStatus = exports.PlayerStatus = void 0;
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus["INITIAL"] = "Initial";
        PlayerStatus["SURRENDER"] = "Surrender";
        PlayerStatus["STAND"] = "Stand";
        PlayerStatus["BUST"] = "Bust";
        PlayerStatus["DOUBLE"] = "Double";
        PlayerStatus["DOUBLEBUST"] = "DoubleBust";
        PlayerStatus["BLACKJACK"] = "Blackjack";
    })(PlayerStatus || (PlayerStatus = {}));
    exports.PlayerStatus = PlayerStatus;
    var DealerStatus;
    (function (DealerStatus) {
        DealerStatus["INITIAL"] = "Initial";
        DealerStatus["STAND"] = "Stand";
        DealerStatus["BUST"] = "Bust";
        DealerStatus["BLACKJACK"] = "Blackjack";
    })(DealerStatus || (DealerStatus = {}));
    exports.DealerStatus = DealerStatus;
});
