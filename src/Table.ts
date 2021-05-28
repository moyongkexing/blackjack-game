import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";

import { Dealer } from "./Dealer";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  public gameType: "Blackjack" | "Poker";
  private numBots: number = 2;
  private numInitialHands: number = 2;
  private deck: Deck;
  private dealer: Dealer;
  private user: User;
  private bots: Bot[];
  private players: Array<User | Bot>;
  private resultLog: string[];
  // private turnCounter: number;

  public constructor(arg: Pick<Table, "gameType">, username: string) {
    this.gameType = arg.gameType;
    this.deck = new Deck({gameType: this.gameType});
    this.dealer = new Dealer({name: "ディーラー", gameType: this.gameType});
    this.user = new User({name: username, gameType: this.gameType});
    switch(this.gameType) {
      case "Blackjack": this.bots = this.generateBotsBJ();break; // return [new Bot(), new Bot()]
      case "Poker": this.bots = this.generatePlayerArrPoker();break;
    }
    this.players = this.bots;
    this.players.push(this.user); // this.players = [Bot, Bot, User]
    this.resultLog = ["Have fun!"];
  }
  private generateBotsBJ(): Bot[] {
    let arr: Bot[] = [];
    [...Array(this.numBots)].forEach(i => {
      arr.push(new Bot({name: `ボット${i}号`, gameType: this.gameType}));
    });
    return arr;
  }
  private generatePlayerArrPoker(): Bot[] {
    // 今回実装しない
    return [];
  }
  private proceedGame(): void {
    while(!this.user.isBroke()) {
      this.betPhase();
      this.distributePhase();
      this.actPhase();
      this.evaluatePhase();
    }
    // ユーザーが破産したときの処理をここに書く
  }
  private betPhase(): void {
    for(let player of this.players) player.bet();
  }

  private distributePhase(): void {
    for(let player of this.players) { // this.players = [Bot, Bot, User]
      [...Array(this.numInitialHands)].forEach(() => player.getCard(this.deck.drawOne()));
    }
    this.dealer.getCard(this.deck.drawOne());
  }

  private actPhase(): void {
    for(let player of this.players) {
      // 手札がブラックジャックのプレイヤーは何もしない
      if(player.isBlackjack()) continue;
      // プレーヤーはsurrenderかstandするまでmakeAction()を繰り返す
      let isEnd = false;
      while(!isEnd) {
        // Botはディーラーのオープンカード（一枚目）のランクをもとに自動的にアクションを決定する
        let action = player.playerType === "Bot" ? player.makeAction(this.dealer.openCard) : player.makeAction();
        switch(action) {
          case "surrender": player.surrender(); isEnd = true; break; // player.status = "surrender"
          case "stand": player.stand(); isEnd = true; break; // player.status = "stand"
          case "hit": player.hit(this.deck.drawOne()); break; // player.status = "surrender"
          case "double": player.double(this.deck.drawOne()); break; // player.status = "surrender"
        }
      }
    }
  }
  private evaluatePhase(): void {

    // this.resultLog.push(this.generateLog());

  }
  private generateLog(phase: string): string {
    return `${phase}`;
  }

  


}