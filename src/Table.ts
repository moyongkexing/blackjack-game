import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { ActionType } from "./types/ActionType";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  private numBots: number = 2;
  private deck: Deck;

  public user: User;
  public dealer: Dealer;
  public bots: Bot[] = [];
  public players: Array<User | Bot | Dealer> = [];

  public log: string[][] = [];

  public constructor(username: string) {
    this.deck = new Deck();

    this.user = new User(username);
    this.dealer = new Dealer();
    for(let i = 1; i <= this.numBots; i++) {
      const newBot = new Bot(`Bot${i}`);
      this.bots.push(newBot);
      this.players.push(newBot);
    }
    this.players.push(this.user, this.dealer);
  }

  // ###########################################################################
  //  Each public method here is called in ViewController
  //  bet → distribution → userAct → botAct → dealerAct → evaluation → bet → ...
  // ###########################################################################

  
  public bet(userBetAmount: number): void {
    let betLog = [];
    for(let player of this.players) {
      if(player instanceof Dealer) continue;
      if(player instanceof User) player.bet(userBetAmount);
      if(player instanceof Bot) player.bet();
      betLog.push(`${player.name} has bet ${player.betAmount}$`);
    }
    this.log.push(betLog);
  }

  public distribution(): void {
    for(let player of this.players) {
      if(player instanceof Dealer) player.getCard(this.deck.drawOne());
      else {
        player.getCard(this.deck.drawOne());
        player.getCard(this.deck.drawOne());
      }
    }
  }

  public userAct(action: ActionType): void {
    console.log("userAct() is called");
    switch(action) {
      case "surrender": this.user.surrender();break;
      case "stand": this.user.stand();break;
      case "hit": this.user.hit(this.deck.drawOne());break;
      case "double": this.user.double(this.deck.drawOne());break;
    }
    this.log.push([`${this.user.name} has chosen to ${action}`]);
  }

  public botAct(): void {
    console.log("botAct() is called");
    let botActLog: string[] = [];
    for(let bot of this.bots) {
      while(!bot.isTurnEnd) {
        let action = bot.makeAction(this.dealer.openCard);
        switch(action) {
          case "surrender": bot.surrender();break;
          case "stand": bot.stand();break;
          case "hit": bot.hit(this.deck.drawOne());break;
          case "double": bot.double(this.deck.drawOne());break;
        }
        botActLog.push(`${bot.name} has chosen to ${action}`);
      }
    }
    this.log.push(botActLog);
  }

  public dealerAct(): void {
    console.log("dealerAct() is called");
    this.dealer.getCard(this.deck.drawOne());
    let dealerActLog: string[] = [];
    while(!this.dealer.isTurnEnd) {
      this.dealer.hit(this.deck.drawOne());
      dealerActLog.push(`${this.dealer.name} has chosen to hit`);
    }
    this.log.push(dealerActLog);
  }

  public evaluation(): void {
    console.log("evaluation() is called")
    for(let player of this.players.filter(player => !(player instanceof Dealer)) as Array<User |Bot>) {
      switch(player.status) {
        case "surrender": player.loseMoney(player.betAmount * .5);break;
        case "bust": player.loseMoney(player.betAmount);break;
        case "doubleBust": player.loseMoney(player.betAmount * 2);break;
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
  
  private compareHand(player: User | Bot): void {
    if(player.handScore > this.dealer.handScore) player.earnMoney(player.betAmount);
    if(player.handScore < this.dealer.handScore) player.loseMoney(player.betAmount);
  }

  public resetTable(): void {
    this.deck.resetDeck();
    this.players.forEach(player => player.resetState());
  }
}
