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
    exports.BotStrategies = void 0;
    // https://www.blackjackinfo.com/16vt-rs-wtf/
    exports.BotStrategies = {
        2: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 12],
            "Double": [10, 11],
            "Stand": [13, 14, 15, 16, 17],
            "Surrender": [],
        },
        3: {
            "Hit": [3, 4, 5, 6, 7, 8, 12],
            "Double": [9, 10, 11],
            "Stand": [13, 14, 15, 16, 17],
            "Surrender": [],
        },
        4: {
            "Hit": [3, 4, 5, 6, 7, 8],
            "Double": [9, 10, 11],
            "Stand": [12, 13, 14, 15, 16, 17],
            "Surrender": [],
        },
        5: {
            "Hit": [3, 4, 5, 6, 7, 8],
            "Double": [9, 10, 11],
            "Stand": [12, 13, 14, 15, 16, 17],
            "Surrender": [],
        },
        6: {
            "Hit": [3, 4, 5, 6, 7, 8],
            "Double": [9, 10, 11],
            "Stand": [12, 13, 14, 15, 16, 17],
            "Surrender": [],
        },
        7: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16],
            "Double": [10, 11],
            "Stand": [17],
            "Surrender": [],
        },
        8: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16],
            "Double": [10, 11],
            "Stand": [17],
            "Surrender": [],
        },
        9: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15],
            "Double": [10, 11],
            "Stand": [17],
            "Surrender": [16],
        },
        10: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14],
            "Double": [11],
            "Stand": [17],
            "Surrender": [15, 16],
        },
        11: {
            "Hit": [3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15],
            "Double": [10, 11],
            "Stand": [17],
            "Surrender": [16],
        },
    };
});
