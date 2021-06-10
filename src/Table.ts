import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { ActionType } from "./types/ActionType";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  private deck: Deck;

  public user: User;
  public dealer: Dealer;
  public players: Array<User | Bot | Dealer> = [];

  public turnCounter: number = 0;
  public turnLog: string[][] = [];

  public constructor(username: string) {
    this.deck = new Deck();

    this.user = new User(username);
    this.dealer = new Dealer();
    this.players.push(this.dealer, this.user, new Bot("Bot1"), new Bot("Bot2"));
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
      if(player instanceof Bot) player.makeBet();
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

  public userAct(action: ActionType): void {
    if(this.user.isTurnEnd) return;
    switch(action) {
      case "surrender": this.user.surrender();break;
      case "stand": this.user.stand();break;
      case "hit": this.user.hit(this.deck.drawOne());break;
      case "double": this.user.double(this.deck.drawOne());break;
    }
    this.turnLog.push([`${this.user.name} has chosen to ${action}.`]);
  }

  public botAct(bot: Bot): void {
    let botActLog: string[] = [];
    while(!bot.isTurnEnd) {
      let action = bot.makeAction(this.dealer.openCard);
      switch(action) {
        case "surrender": bot.surrender();break;
        case "stand": bot.stand();break;
        case "hit": bot.hit(this.deck.drawOne());break;
        case "double": bot.double(this.deck.drawOne());break;
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
        // player loses unconditionally
        case "Surrender": case "Bust": case "Doublebust": result = "lose";break; 
        case "Blackjack": if(this.dealer.status !== "Blackjack") result = "win";break;
        case "Stand": case "Double": result = this.compareHand(player);break;
      }

      const exMoney = player.money;
      if(result !== "push") player.calculation(result);
      log.push(`${player.name} ${result}. (${exMoney}$ → ${player.money}$)`);
    }
    this.turnLog.push(log);
  }
  
  public resetTable(): void {
    this.deck.resetDeck();
    this.players.forEach(player => player.resetState());
  }

  public gameOver(): void {
    this.turnLog.push(["Game Over!"]);
  }

  private compareHand(player: User | Bot): "win" | "lose" | "push"{
    if(this.dealer.status === "Blackjack") return "lose";
    if(this.dealer.status === "Bust") return "win";
    let diff = player.handScore - this.dealer.handScore;
    return diff > 0 ? "win" : diff < 0 ? "lose" : "push";
  }
}
