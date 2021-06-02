import { Deck } from "./Deck";
import { Card } from "./Card";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { Player } from "./Player";
import { ViewController } from "./ViewController";
import { ActionType } from "./types/ActionType";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  private numBots: number = 2;
  private deck: Deck;
  public dealer: Dealer;
  public user: User;
  public bots: Bot[] = [];
  public players: Array<User | Bot> = [];
  // private dealer: Dealer;
  // public user: User;
  // private bots: Bot[] = [];
  // private players: Array<User | Bot> = [];
  // private players: Array<User | Bot> = [];
  private resultLog: string[];

  public constructor(username: string) {
    this.deck = new Deck();
    this.dealer = new Dealer();
    this.user = new User(username);
    for(let i = 1; i <= this.numBots; i++) {
      let newBot = new Bot(`BOT ${i}`);
      this.bots.push(newBot);
      this.players.push(newBot);
    }
    this.players.push(this.user);
    this.resultLog = ["Have fun!"];
  }

  // Each method here is called in ViewContoller
  // bet → distribution → {player}Act → evaluation → bet → ... as blackjack's flow
  public bet(userBetAmount: number): void {
    this.user.bet(userBetAmount);
    for(let bot of this.bots) {
      bot.bet();
    }
  }

  public distribution(): void {
    this.user.getCard(new Card({suit: "S", rank: "K"}));
    this.user.getCard(new Card({suit: "S", rank: "A"}));
    for(let player of this.bots) {
      player.getCard(this.deck.drawOne());
      player.getCard(this.deck.drawOne());
    }
    this.dealer.getCard(this.deck.drawOne());
  }

  public userAct(userAction: ActionType): void {
    switch(userAction) {
      case "surrender": this.user.surrender();break;
      case "stand": this.user.stand();break;
      case "hit": this.user.hit(this.deck.drawOne());break;
      case "double": this.user.double(this.deck.drawOne());break;
    }
  }

  public botAct(): void {
    for(let bot of this.bots) {
      while(!bot.isTurnEnd) {
        let botAction = bot.makeAction(this.dealer.openCard)
        switch(botAction) {
          case "surrender": bot.surrender();break;
          case "stand": bot.stand();break;
          case "hit": bot.hit(this.deck.drawOne());break;
          case "double": bot.double(this.deck.drawOne());break;
        }
      }
    }
  }

  public dealerAct(): void {
    this.dealer.getCard(this.deck.drawOne());
    while(this.dealer.handScore < 17) this.dealer.hit(this.deck.drawOne());
  }

  public evaluation(): void {
    console.log("evaluation() is called")
    for(let player of this.players) {
      // player.status = "surrender" || "stand" || "bust" || "doublebust" || "blackjack" ;
      // dealer.status = "bust" || "blackjack" || "stand"; ;
      switch(player.status) {
        case "surrender": player.loseMoney(player.betAmount * .5);break;
        case "bust": player.loseMoney(player.betAmount);break;
        case "doublebust": player.loseMoney(player.betAmount * 2);break;
        case "stand": {
          switch(this.dealer.status) {
            case "bust": player.earnMoney(player.betAmount);break;
            case "stand": this.compareHand(player);break;
            case "blackjack": player.loseMoney(player.betAmount);break;
          }
        }break;
        case "blackjack": {
          if(this.dealer.status === "blackjack") break;
          else player.earnMoney(player.betAmount * 1.5);break;
        }
      }
    }
  }

  private compareHand(player: Player): void {
    if(player.handScore > this.dealer.handScore) {
      player.earnMoney(player.betAmount);
    }
    if(player.handScore < this.dealer.handScore) {
      player.loseMoney(player.betAmount);
    }
  }
}