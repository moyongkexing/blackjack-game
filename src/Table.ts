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

  public constructor(arg: Pick<Table, "gameType">, username: string) {
    this.gameType = arg.gameType;
    this.deck = new Deck({gameType: this.gameType});
    this.dealer = new Dealer({name: "DEALER", gameType: this.gameType});
    this.user = new User({name: username, gameType: this.gameType});
    switch(this.gameType) {
      
      case "Blackjack": this.bots = this.generateBotsBJ();break; 
      case "Poker": this.bots = this.generatePlayerArrPoker();break;
    }
    this.players = this.bots;
    this.players.push(this.user);
    this.resultLog = ["Have fun!"];
  }
  // return [new Bot(), new Bot()]
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
  private proceedBJ(): void {
    while(!this.user.isBroke) {
      this.betPhase();
      this.distributePhase();
      this.actPhase();
      this.evaluatePhase();
    }
    // ユーザーが破産したときの処理をここに書く
  }
  private betPhase(): void {
    // this.players = [Bot, Bot, User]
    for(let player of this.players) player.bet();
  }

  private distributePhase(): void {
    for(let player of this.players) {
      [...Array(this.numInitialHands)] // = [undifined, undifined]
      .forEach(() => player.getCard(this.deck.drawOne()));
    }
    this.dealer.getCard(this.deck.drawOne());
  }

  private actPhase(): void {
    for(let player of this.players) {
      if(player.isBlackjack) continue;

      // プレーヤーはsurrenderかstandするまでmakeAction()を繰り返す
      let isTurnEnd = false;
      while(!isTurnEnd) {
        let action = player.playerType === "Bot"
        ? player.makeAction(this.dealer.openCard)
        : player.makeAction();

        switch(action) {
          case "surrender": {
            player.surrender();
            isTurnEnd = true;break; 
          } 
          case "stand": {
            player.stand();
            isTurnEnd = true;break;
          } 
          case "hit": player.hit(this.deck.drawOne());break;
          case "double": player.double(this.deck.drawOne());break;
        }
      }
    }
  }
  private evaluatePhase(): void {

  }

  


}