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
                _this.table.bet(parseInt(betAmount.innerText));
                _this.table.distribution();
                _this.table.botAct();
                _this.hide("betPage");
                _this.showDealPage();
                _this.isUserTuenEnd();
                _this.toString();
            });
            // button of ["surrender", "stand", "hit", "double"]
            var actions = ["surrender", "stand", "hit", "double"];
            var _loop_2 = function (action) {
                document.getElementById(action + "-btn").addEventListener("click", function () {
                    _this.table.userAct(action);
                    if (_this.table.user.isTurnEnd) {
                        _this.hide("actionBtns");
                        _this.table.dealerAct();
                        _this.table.evaluation();
                    }
                    _this.toString();
                });
            };
            for (var _b = 0, actions_1 = actions; _b < actions_1.length; _b++) {
                var action = actions_1[_b];
                _loop_2(action);
            }
        };
        ViewController.prototype.toString = function () {
            console.log("");
            console.log("");
            for (var _i = 0, _a = this.table.players; _i < _a.length; _i++) {
                var player = _a[_i];
                console.log(player);
                console.log(player.hand);
                console.log("isTurnEnd");
                console.log(player.isTurnEnd);
                console.log("handScore");
                console.log(player.handScore);
            }
            console.log(this.table.dealer);
            console.log(this.table.dealer.hand);
            console.log("handScore");
            console.log(this.table.dealer.handScore);
        };
        ViewController.prototype.isUserTuenEnd = function () {
            if (this.table.user.isTurnEnd) {
                this.hide("actionBtns");
                this.table.dealerAct();
                this.table.evaluation();
            }
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
