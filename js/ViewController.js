var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
            var username = document.getElementById("username")
                .value;
            this.table = new Table_1.Table(username);
            this.hide("start-page");
            this.show("bet-page");
            this.renderBetPage();
            this.initializeClickEvent();
        }
        ViewController.prototype.initializeClickEvent = function () {
            var _this = this;
            var betAmount = document.getElementById("betAmountInBetPage");
            var _loop_1 = function (d) {
                document.getElementById("bet-" + d).addEventListener("click", function () {
                    var total = parseInt(betAmount.innerText) + d;
                    betAmount.innerText =
                        total > _this.table.user.money ? betAmount.innerText : String(total);
                });
            };
            // button of [5,20,50,100]
            for (var _i = 0, _a = Table_1.Table.betDenominations; _i < _a.length; _i++) {
                var d = _a[_i];
                _loop_1(d);
            }
            // "RESET" button
            document.getElementById("reset-btn").addEventListener("click", function () { return (betAmount.innerText = String(Table_1.Table.betDenominations[0])); });
            // "DEAL" button
            document.getElementById("deal-btn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.table.bet(parseInt(betAmount.innerText));
                            this.hide("bet-page");
                            this.show("deal-page");
                            this.table.distribution();
                            return [4 /*yield*/, this.renderDistribution()];
                        case 1:
                            _a.sent();
                            this.show("action-buttons");
                            if (this.table.user.isTurnEnd) {
                                this.hide("action-buttons");
                                this.table.dealerAct();
                                this.table.evaluation();
                                // state、つまりblackjackなどのstateがログに記録されないこと
                                // 一人一人のレンダリングに合わせてそれぞれのログを出力したい
                                // 勝敗の結果が記録されないこと
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            // button of ["surrender", "stand", "hit", "double"]
            var actions = ["surrender", "stand", "hit", "double"];
            var _loop_2 = function (action) {
                document.getElementById(action + "-btn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.table.userAct(action);
                                this.renderUserAction();
                                if (!this.table.user.isTurnEnd) return [3 /*break*/, 3];
                                this.hide("action-buttons");
                                this.table.botAct();
                                return [4 /*yield*/, this.renderBotAction()];
                            case 1:
                                _a.sent();
                                this.table.dealerAct();
                                return [4 /*yield*/, this.renderDealerAction()];
                            case 2:
                                _a.sent();
                                this.table.evaluation();
                                _a.label = 3;
                            case 3:
                                this.toString();
                                return [2 /*return*/];
                        }
                    });
                }); });
            };
            for (var _b = 0, actions_1 = actions; _b < actions_1.length; _b++) {
                var action = actions_1[_b];
                _loop_2(action);
            }
        };
        ViewController.prototype.renderDistribution = function () {
            return __awaiter(this, void 0, void 0, function () {
                var players, _i, players_1, player;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            players = [];
                            players.push(this.table.dealer);
                            this.table.players.forEach(function (player) { return players.push(player); });
                            _i = 0, players_1 = players;
                            _a.label = 1;
                        case 1:
                            if (!(_i < players_1.length)) return [3 /*break*/, 4];
                            player = players_1[_i];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 2:
                            _a.sent(); // wait a second
                            this.updateHand(player);
                            if (player.status !== "initial")
                                this.updateStatus(player);
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ViewController.prototype.renderUserAction = function () {
            this.updateHand(this.table.user);
            if (this.table.user.status !== "initial")
                this.updateStatus(this.table.user);
        };
        ViewController.prototype.renderBotAction = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, bot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, _a = this.table.bots;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            bot = _a[_i];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 2:
                            _b.sent();
                            this.updateHand(bot);
                            if (bot.status !== "initial")
                                this.updateStatus(bot);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ViewController.prototype.renderDealerAction = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                        case 1:
                            _a.sent();
                            this.updateHand(this.table.dealer);
                            if (this.table.dealer.status !== "initial")
                                this.updateStatus(this.table.dealer);
                            return [2 /*return*/];
                    }
                });
            });
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
        ViewController.prototype.renderBetPage = function () {
            document.getElementById("moneyAmountInBetPage").innerText = String(this.table.user.money);
        };
        ViewController.prototype.updateHand = function (player) {
            for (var i = 1; i <= player.hand.length; i++) {
                var card = player.hand[i - 1];
                document.getElementById(player.type + "-card-" + i).innerHTML = "<div class=\"card " + card.suit + "\"><span>" + card.rank + "</span></div>";
            }
            document.getElementById(player.type + "-width").style.width = (player.hand.length + 3) * 28 + "px";
        };
        ViewController.prototype.updateStatus = function (player) {
            document.getElementById(player.type + "-status").innerHTML = "" + player.status;
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
