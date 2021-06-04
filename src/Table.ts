import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { Card } from "./Card";
import { ActionType } from "./types/ActionType";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  private numBots: number = 2;
  private deck: Deck;
  public dealer: Dealer;
  public user: User;
  public bots: Bot[] = [];
  public players: Array<User | Bot> = [];
  public resultLog: string[] = [];

  public constructor(username: string) {
    this.deck = new Deck();
    this.dealer = new Dealer();
    this.user = new User(username);
    this.players.push(this.user);
    for(let i = 1; i <= this.numBots; i++) {
      let newBot = new Bot(`Bot${i}`);
      this.bots.push(newBot);
      this.players.push(newBot);
    }
  }

  // #####################################################################
  // Each public method in this class is called in ViewContoller
  // bet → distribution → {player}Act → evaluation → bet → distribution →...
  // #####################################################################

  public bet(userBetAmount: number): void {
    this.user.bet(userBetAmount);
    this.resultLog.push(this.user.generateLog("bet"));
    for(let bot of this.bots) {
      bot.bet();
      this.resultLog.push(bot.generateLog("bet"));
    }
  }

  public distribution(): void {
    for(let player of this.players) {
      player.getCard(this.deck.drawOne());
      player.getCard(this.deck.drawOne());
    }
    this.dealer.getCard(this.deck.drawOne());
    this.dealer.getCard(this.deck.drawOne());
  }

  public userAct(userAction: ActionType): void {
    console.log("userAct() is called");
    switch(userAction) {
      case "surrender": this.user.surrender();break;
      case "stand": this.user.stand();break;
      case "hit": this.user.hit(this.deck.drawOne());break;
      case "double": this.user.double(this.deck.drawOne());break;
    }
    this.resultLog.push(this.user.generateLog(userAction));
  }

  public botAct(): void {
    console.log("botAct() is called");
    for(let bot of this.bots) {
      while(!bot.isTurnEnd) {
        let botAction = bot.makeAction(this.dealer.openCard)
        switch(botAction) {
          case "surrender": bot.surrender();break;
          case "stand": bot.stand();break;
          case "hit": bot.hit(this.deck.drawOne());break;
          case "double": bot.double(this.deck.drawOne());break;
        }
        this.resultLog.push(bot.generateLog(botAction));
      }
    }
  }

  public dealerAct(): void {
    console.log("dealerAct() is called");
    while(!this.dealer.isTurnEnd) {
      this.dealer.hit(this.deck.drawOne());
      this.resultLog.push(this.dealer.generateLog("hit"));
    }
  }

  public evaluation(): void {
    console.log("evaluation() is called")
    for(let player of this.players) {
      switch(player.status) {
        case "surrender": player.loseMoney(player.betAmount * .5);break;
        case "bust": player.loseMoney(player.betAmount);break;
        case "doublebust": player.loseMoney(player.betAmount * 2);break;
        case "stand": {
          switch(this.dealer.status) {
            case "bust": player.earnMoney(player.betAmount);break;
            case "stand": this.compareHand(player);break;
            case "blackjack": player.loseMoney(player.betAmount);break;
            default: break;
          }
        }break;
        case "blackjack": {
          if(this.dealer.status === "blackjack") break;
          else player.earnMoney(player.betAmount * 1.5);break;
        }
      }
    }
  }
  
  public reset(): void {
    this.deck.resetDeck();
    this.dealer.resetState();
    this.players.forEach(player => player.resetState());
  }
  private compareHand(player: User | Bot): void {
    if(player.handScore > this.dealer.handScore) {
      player.earnMoney(player.betAmount);
    }
    if(player.handScore < this.dealer.handScore) {
      player.loseMoney(player.betAmount);
    }
  }
}