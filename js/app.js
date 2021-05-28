(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Table"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Table_1 = require("./Table");
    var View = /** @class */ (function () {
        function View() {
        }
        View.createBetFrom = function () {
            var form = document.getElementById("betForm");
            for (var _i = 0, _a = Table_1.Table.betDenominations; _i < _a.length; _i++) {
                var d = _a[_i];
                var label = document.createElement("p");
                label.id = "betLabel" + d;
                label.innerText = "" + d;
                var input = document.createElement("input");
                input.id = "betInput" + d;
                input.type = "number";
                input.min = "0";
                input.value = "0";
                input.classList.add("betInput" + d);
                var inputBx = document.createElement("div");
                inputBx.append(label, input);
                form === null || form === void 0 ? void 0 : form.append(inputBx);
            }
        };
        return View;
    }());
    View.createBetFrom();
    console.log("hi");
});
// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
