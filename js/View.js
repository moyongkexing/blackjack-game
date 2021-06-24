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
        define(["require", "exports", "./Table", "./types/ActionType", "./User", "./Dealer", "./types/StatusType"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.View = void 0;
    var Table_1 = require("./Table");
    var ActionType_1 = require("./types/ActionType");
    var User_1 = require("./User");
    var Dealer_1 = require("./Dealer");
    var StatusType_1 = require("./types/StatusType");
    var View = /** @class */ (function () {
        function View() {
            this.startPage = document.getElementById("start-page");
            this.usernameInput = document.getElementById("username-input");
            this.betPage = document.getElementById("bet-page");
            this.moneyAmount = document.getElementById("money-amount");
            this.betAmount = document.getElementById("bet-amount");
            this.dealBtn = document.getElementById("deal-btn");
            this.resetBtn = document.getElementById("reset-btn");
            this.dealPage = document.getElementById("deal-page");
            this.username = document.getElementById("username");
            this.actionButtons = document.getElementById("action-buttons");
            this.doubleBtn = document.getElementById("double-btn");
            this.hitBtn = document.getElementById("hit-btn");
            this.nextBtn = document.getElementById("next-btn");
            this.gameLog = document.getElementById("game-log");
            this.table = Table_1.Table.getInstance(this.usernameInput.value);
            this.initializeView();
            this.initializeController();
            this.startPage.classList.add("hidden");
            this.betPage.classList.remove("hidden");
        }
        View.prototype.initializeView = function () {
            this.moneyAmount.innerText = String(this.table.user.money);
            this.betAmount.innerText = String(Table_1.Table.betDenominations[0]); // 5$
            this.username.innerText = this.table.user.name;
            for (var _i = 0, _a = this.table.players; _i < _a.length; _i++) {
                var player = _a[_i];
                var id = this.getIdFromPlayer(player);
                document.getElementById(id + "-hands").innerHTML = "";
                document.getElementById(id + "-status").innerHTML = "";
            }
            this.actionButtons.style.visibility = "hidden";
        };
        View.prototype.initializeController = function () {
            var _this = this;
            // "DEAL" button
            this.dealBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                var _i, _a, player;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.betPage.classList.add("hidden");
                            this.dealPage.classList.remove("hidden");
                            this.nextBtn.classList.add("disable");
                            // assign the argument value to User.betAmount
                            this.table.bet(parseInt(this.betAmount.innerText));
                            // assign two cards to all players (dealer get only one card as exception)
                            this.table.distribution();
                            _i = 0, _a = this.table.players;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            player = _a[_i];
                            return [4 /*yield*/, this.sleep(1000)];
                        case 2:
                            _b.sent();
                            // draw the player's hand in the view
                            this.updatePlayerHand(player);
                            // in the case of player is blackjack, draw the status in the view
                            this.updatePlayerStatus(player);
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            ;
                            // ex: "BOT1 has bet 100$."
                            this.updateTurnLog();
                            this.actionButtons.style.visibility = "visible";
                            // user who has bet more than half of total money cannot choose double
                            if (!this.table.user.canDouble)
                                this.doubleBtn.classList.add("disable");
                            else
                                this.doubleBtn.classList.remove("disable");
                            if (!this.table.user.isTurnEnd) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.autoRendering()];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
            // Action button
            var actions = [ActionType_1.Action.SURRENDER, ActionType_1.Action.STAND, ActionType_1.Action.HIT, ActionType_1.Action.DOUBLE];
            var _loop_1 = function (action) {
                document.getElementById(action.toLowerCase() + "-btn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.table.userAct(action);
                                this.updatePlayerHand(this.table.user);
                                this.updateTurnLog();
                                if (!this.table.user.canDouble)
                                    this.doubleBtn.classList.add("disable");
                                if (!this.table.user.canHit)
                                    this.hitBtn.classList.add("disable");
                                if (!this.table.user.isTurnEnd) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.autoRendering()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
            };
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var action = actions_1[_i];
                _loop_1(action);
            }
            // "Next Game" button
            this.nextBtn.addEventListener("click", function () {
                _this.table.players.forEach(function (player) { return player.resetState(); });
                _this.initializeView();
                _this.makeChipButtonClickable();
                _this.dealPage.classList.add("hidden");
                _this.betPage.classList.remove("hidden");
            });
            // "RESET" button
            this.resetBtn.addEventListener("click", function () {
                _this.betAmount.innerText = String(Table_1.Table.betDenominations[0]); // 5$
                _this.makeChipButtonClickable();
            });
            var _loop_2 = function (i) {
                var chipBtn = document.getElementById("bet-" + Table_1.Table.betDenominations[i]);
                chipBtn.addEventListener("click", function () {
                    var total = parseInt(_this.betAmount.innerText) + Table_1.Table.betDenominations[i];
                    if (total + Table_1.Table.betDenominations[i] > _this.table.user.money) {
                        for (var j = i; j < Table_1.Table.betDenominations.length; j++) {
                            var disableChipBtn = document.getElementById("bet-" + Table_1.Table.betDenominations[j]);
                            disableChipBtn.classList.add("disable");
                        }
                    }
                    if (total <= _this.table.user.money)
                        _this.betAmount.innerText = String(total);
                });
            };
            // Chip button
            for (var i = 0; i < Table_1.Table.betDenominations.length; i++) {
                _loop_2(i);
            }
        };
        View.prototype.autoRendering = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, bot;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.actionButtons.style.visibility = "hidden";
                            this.updatePlayerStatus(this.table.user);
                            _i = 0, _a = this.table.players;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            bot = _a[_i];
                            if (bot instanceof User_1.User)
                                return [3 /*break*/, 3];
                            if (bot instanceof Dealer_1.Dealer)
                                return [3 /*break*/, 3];
                            return [4 /*yield*/, this.sleep(1000)];
                        case 2:
                            _b.sent();
                            this.table.botAct(bot);
                            this.updatePlayerHand(bot);
                            this.updatePlayerStatus(bot);
                            this.updateTurnLog();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [4 /*yield*/, this.sleep(1000)];
                        case 5:
                            _b.sent();
                            this.table.dealerOpen();
                            this.updatePlayerHand(this.table.dealer);
                            this.updateTurnLog();
                            return [4 /*yield*/, this.sleep(1000)];
                        case 6:
                            _b.sent();
                            this.table.dealerAct();
                            this.updatePlayerHand(this.table.dealer);
                            this.updatePlayerStatus(this.table.dealer);
                            this.updateTurnLog();
                            return [4 /*yield*/, this.sleep(1000)];
                        case 7:
                            _b.sent();
                            this.table.evaluation();
                            this.updateTurnLog();
                            if (this.table.user.isBroke) {
                                this.table.gameOver();
                                this.updateTurnLog();
                            }
                            else
                                this.nextBtn.classList.remove("disable");
                            return [2 /*return*/];
                    }
                });
            });
        };
        View.prototype.updatePlayerHand = function (player) {
            var id = this.getIdFromPlayer(player);
            var handArea = document.getElementById(id + "-hands");
            handArea.innerHTML = "";
            for (var i = 1; i <= player.hand.length; i++) {
                var card = player.hand[i - 1];
                handArea.innerHTML += "\n        <div id=\"" + id + "-card-" + i + "\">\n          <div class=\"card " + card.suit + "\"><span>" + card.rank + "</span></div>\n        </div>\n      ";
            }
            // player's hand should be centered horizontally
            handArea.style.width = (player.hand.length + 3) * 28 + "px";
        };
        View.prototype.updatePlayerStatus = function (player) {
            var id = this.getIdFromPlayer(player);
            if (player.status !== StatusType_1.ChallengerStatus.INITIAL) {
                document.getElementById(id + "-status").innerHTML = "" + player.status;
            }
        };
        View.prototype.updateTurnLog = function () {
            for (var _i = 0, _a = this.table.turnLog.pop(); _i < _a.length; _i++) {
                var sentence = _a[_i];
                this.gameLog.innerHTML += "<p>" + sentence + "</p>";
            }
            this.gameLog.scrollTop = this.gameLog.scrollHeight;
        };
        View.prototype.sleep = function (time) {
            return new Promise(function (resolve) { return setTimeout(resolve, time); });
        };
        View.prototype.makeChipButtonClickable = function () {
            for (var _i = 0, _a = Table_1.Table.betDenominations; _i < _a.length; _i++) {
                var d = _a[_i];
                var chipBtn = document.getElementById("bet-" + d);
                chipBtn.classList.remove("disable");
            }
        };
        View.prototype.getIdFromPlayer = function (player) {
            return player instanceof User_1.User ? "USER" : player instanceof Dealer_1.Dealer ? "DEALER" : player.id;
        };
        return View;
    }());
    exports.View = View;
});
