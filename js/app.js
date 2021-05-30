"use strict";
// import { Table } from "./Table";
// const IDS = {
//   root: document.getElementById("root"),
// }
var ViewControl = /** @class */ (function () {
    function ViewControl() {
        var startBtn = document.getElementById("start-btn");
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener("click", function () { return ViewControl.startGame(); });
    }
    ViewControl.startGame = function () {
        console.log("test");
    };
    return ViewControl;
}());
new ViewControl();
// 状態の更新は必ずそのクラスのインスタンスメソッドで行う
// 他クラスの状態は、読み取るだけで更新することはしない
// Playerクラスが肥大化してる...?
