import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { Action } from "./types/ActionType";
import { ChallengerStatus, DealerStatus } from "./types/StatusType";

export class Table {
  public static instance: Table;
  public static betDenominations = [5,20,50,100] as const;
  private deck: Deck;
  public readonly user: User;
  public readonly dealer: Dealer;
  public readonly players: Array<User | Bot | Dealer> = [];
  public turnCounter: number = 0;
  public turnLog: string[][] = [];
  // private cardCountingTotal: number = 0;
  public cardCountingTotal: number = 0;

  private constructor(username: string) {
    this.deck = new Deck();
    this.user = new User(username);
    this.dealer = new Dealer();
    this.players.push(this.dealer, this.user, new Bot("Bot1"), new Bot("Bot2"));
  }

  public static getInstance(username: string): Table {
    if(Table.instance) return Table.instance;
    Table.instance = new Table(username);
    return Table.instance;
  }

// ######################################
//  Each public method here is called in View class
//  bet → distribution → userAct → botAct → dealerOpen → dealerAct → evaluation → bet → ...
// ######################################

  public bet(userBetAmount: number): void {
    this.turnCounter++;
    let betLog = [
      "---------------------------------------------", 
      `Turn ${this.turnCounter}.`
    ];

    for(let player of this.players) {
      if(player instanceof Dealer) continue;
      if(player instanceof User) player.makeBet(userBetAmount);
      if(player instanceof Bot) player.makeBet(this.cardCountingTotal);
      betLog.push(`${player.name} has bet ${player.betAmount}$.`);
    }
    this.turnLog.push(betLog);
  }

  public distribution(): void {
    for(let player of this.players) {
      if (player instanceof Dealer) player.getCard(this.deck.drawOne());
      else {
        player.getCard(this.deck.drawOne());
        player.getCard(this.deck.drawOne());
      }
    }
  }

  public userAct(action: Action): void {
    if(this.user.isTurnEnd) return;
    switch(action) {
      case Action.SURRENDER: this.user.surrender();break;
      case Action.STAND: this.user.stand();break;
      case Action.HIT: this.user.hit(this.deck.drawOne());break;
      case Action.DOUBLE: this.user.double(this.deck.drawOne());break;
    }
    this.turnLog.push([`${this.user.name} has chosen to ${action}.`]);
  }

  public botAct(bot: Bot): void {
    let botActLog: string[] = [];
    while(!bot.isTurnEnd) {
      let action = bot.makeAction(this.dealer.openCard);
      switch(action) {
        case Action.SURRENDER: bot.surrender();break;
        case Action.STAND: bot.stand();break;
        case Action.HIT: bot.hit(this.deck.drawOne());break;
        case Action.DOUBLE: bot.double(this.deck.drawOne());break;
      }
      botActLog.push(`${bot.name} has chosen to ${action}.`);
    }
    this.turnLog.push(botActLog);
  }

  public dealerOpen(): void {
    this.dealer.hit(this.deck.drawOne());
    this.turnLog.push([`${this.dealer.name} opened the first card.`]);
  }
  
  public dealerAct(): void {
    let log: string[] = [];
    while(!this.dealer.isTurnEnd) {
      this.dealer.hit(this.deck.drawOne());
      log.push(`${this.dealer.name} has hit.`);
    }
    this.turnLog.push(log);
  }

  public evaluation(): void {
    let log: string[] = [];
    for(let player of this.players) {
      if(player instanceof Dealer) continue;

      let result: "win" | "lose" | "push" = "push";
      switch(player.status) {
        case ChallengerStatus.SURRENDER:
        case ChallengerStatus.BUST:
        case ChallengerStatus.DOUBLEBUST: {
          result = "lose";break; 
        }
        case ChallengerStatus.BLACKJACK: {
          if(this.dealer.status !== DealerStatus.BLACKJACK) result = "win";break;
        }
        case ChallengerStatus.STAND:
        case ChallengerStatus.DOUBLE: {
          result = this.compareHand(player);break;
        }
      }

      const exMoney = player.money;
      if(result !== "push") player.calculation(result);
      log.push(`${player.name} ${result}. (${exMoney}$ → ${player.money}$)`);
    }
    this.turnLog.push(log);
    this.setCardCountingTotal();
    console.log(this.cardCountingTotal);
    if(this.deck.remain <= 10) this.resetDeck();
  }
  
  public resetDeck(): void {
    this.deck.resetDeck();
    this.cardCountingTotal = 0;
  }

  public gameOver(): void {
    this.turnLog.push(["Game Over!"]);
  }

  private compareHand(player: User | Bot): "win" | "lose" | "push"{
    if(this.dealer.status === DealerStatus.BLACKJACK) return "lose";
    if(this.dealer.status === DealerStatus.BUST) return "win";
    let diff = player.handScore - this.dealer.handScore;
    return diff > 0 ? "win" : diff < 0 ? "lose" : "push";
  }

  private setCardCountingTotal(): void {
    for(let player of this.players) {
      let score = 0;
      player.hand.forEach(card => score += card.cardCountingValue);
      this.cardCountingTotal += score;
    }
  }
}
