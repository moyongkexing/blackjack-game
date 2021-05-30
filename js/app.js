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
    var Controller = /** @class */ (function () {
        function Controller() {
            var _this = this;
            // const startBtn = document.getElementById("start-btn") as HTMLElement;
            var form = document.getElementById("form");
            if (form)
                form.addEventListener("submit", function () { return _this.startGame(); });
        }
        Controller.prototype.startGame = function () {
            console.log("hi");
        };
        Controller.IDS = {
            betCtrl: "control-wrapper bet-ctrl",
            actionCtrl: "control-wrapper bet-ctrl",
        };
        return Controller;
    }());
    new Controller();
});
// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
