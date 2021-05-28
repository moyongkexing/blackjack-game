(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Deck", "./User", "./Bot", "./House"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    var Deck_1 = require("./Deck");
    var User_1 = require("./User");
    var Bot_1 = require("./Bot");
    var House_1 = require("./House");
    var Table = /** @class */ (function () {
        // private turnCounter: number;
        function Table(arg, username) {
            this.gameType = arg.gameType;
            this.numBots = 2;
            this.deck = new Deck_1.Deck({ gameType: this.gameType });
            this.house = new House_1.House({ name: "HOUSE", gameType: this.gameType });
            switch (this.gameType) {
                case "Blackjack":
                    this.players = this.generatePlayerArrBJ(username);
                    break;
                case "Poker":
                    this.players = this.generatePlayerArrPoker(username);
                    break;
            }
            this.resultLog = ["Have fun!"];
        }
        Table.prototype.generatePlayerArrBJ = function (username) {
            var arr = [];
            for (var i = 1; i <= this.numBots; i++) {
                arr.push(new Bot_1.Bot({ name: "BOT " + i, gameType: this.gameType }));
            }
            arr.push(new User_1.User({ name: username, gameType: this.gameType }));
            return arr;
        };
        Table.prototype.generatePlayerArrPoker = function (username) {
            // 今回実装しない
            return [];
        };
        Table.prototype.proceedGame = function () {
            // ユーザーが破産するまで繰り返す
            while (!this.players[this.numBots].isBroke()) {
                this.betPhase();
                this.distributePhase();
                this.actPhase();
                this.evaluatePhase();
            }
        };
        Table.prototype.betPhase = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.bet();
            }
        };
        Table.prototype.distributePhase = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                player.getCard(this.deck.drawOne());
                player.getCard(this.deck.drawOne());
            }
            this.house.getCard(this.deck.drawOne());
        };
        Table.prototype.actPhase = function () {
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                var isEnd = false;
                // プレーヤーがsurrenderかstandするまで繰り返す
                while (!isEnd) {
                    var action = player.makeAction();
                    switch (action) {
                        case "surrender":
                            player.surrender();
                            isEnd = true;
                            break;
                        case "stand":
                            player.stand();
                            isEnd = true;
                            break;
                        case "hit":
                            player.hit(this.deck.drawOne());
                            break;
                        case "double":
                            player.double(this.deck.drawOne());
                            break;
                    }
                }
            }
        };
        Table.prototype.evaluatePhase = function () {
            // this.resultLog.push(this.generateLog());
        };
        Table.prototype.generateLog = function (phase) {
            return "" + phase;
        };
        Table.betDenominations = [5, 20, 50, 100];
        Table.gamePhase = [
            "playerBetting",
            "distributing",
            "playerActing",
            "evaluatingWinners",
            // phase5: "gameOver",
        ];
        return Table;
    }());
    exports.Table = Table;
});
// class House extends Player {
//   constructor(arg: Pick<Player, "gameType">) {
//     super({name: "House", gameType: arg.gameType, state: "waiting"});
//   }
// }
