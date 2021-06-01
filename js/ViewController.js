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
    exports.ViewController = void 0;
    var Table_1 = require("./Table");
    var ViewController = /** @class */ (function () {
        function ViewController() {
            var username = document.getElementById("username").value;
            this.table = new Table_1.Table(username);
            this.initializeEventListener();
            this.hide("startPage");
            this.showBetPage();
            // 開発用↓
            // (document.getElementById("username") as HTMLInputElement).value = "test";
            // (document.getElementById("gametype") as HTMLInputElement).value = "Blackjack";
            // this.startGame();
        }
        ViewController.prototype.initializeEventListener = function () {
            var _this = this;
            var betAmount = document.getElementById("betAmountInBetPage");
            var _loop_1 = function (d) {
                document.getElementById("bet-" + d).addEventListener("click", function () {
                    var total = parseInt(betAmount.innerText) + d;
                    betAmount.innerText = total > _this.table.user.money
                        ? betAmount.innerText
                        : String(total);
                });
            };
            // button of [5,20,50,100]
            for (var _i = 0, _a = Table_1.Table.betDenominations; _i < _a.length; _i++) {
                var d = _a[_i];
                _loop_1(d);
            }
            // "RESET" button
            document.getElementById("resetBtn").addEventListener("click", function () { return betAmount.innerText = String(Table_1.Table.betDenominations[0]); });
            // "DEAL" button
            document.getElementById("dealBtn").addEventListener("click", function () {
                _this.table.betPhase(parseInt(betAmount.innerText));
                _this.hide("betPage");
                _this.showDealPage();
            });
            // button of ["stand", "hit", "double", "surrender"]
            // const actions: ActionType[] = ["stand", "hit", "double", "surrender"];
            // for(let action of actions) {
            //   (document.getElementById(`${action}-btn`) as HTMLButtonElement).addEventListener
            //   ("click", () => {
            //       this.table.actPhase(action);
            //     }
            //   )
            // }
        };
        ViewController.prototype.showBetPage = function () {
            this.show("betPage");
            document.getElementById("moneyAmountInBetPage")
                .innerText = String(this.table.user.money);
        };
        ViewController.prototype.showDealPage = function () {
            this.show("dealPage");
            document.getElementById("betAmountInDealPage")
                .innerText = String(this.table.user.betAmount);
        };
        ViewController.prototype.hide = function (id) {
            document.getElementById(id).classList.add("hidden");
        };
        ViewController.prototype.show = function (id) {
            document.getElementById(id).classList.remove("hidden");
        };
        return ViewController;
    }());
    exports.ViewController = ViewController;
});
