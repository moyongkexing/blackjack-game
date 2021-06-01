import { Deck } from "./Deck";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";
import { ViewController } from "./ViewController";
import { ActionType } from "./types/ActionType";

export class Table {
  public static readonly betDenominations = [5,20,50,100];
  private numBots: number = 2;
  private numInitialHands: number = 2;
  private deck: Deck;
  private dealer: Dealer;
  public user: User;
  private players: Array<User | Bot> = [];
  private resultLog: string[];

  public constructor(username: string) {
    this.deck = new Deck();
    this.dealer = new Dealer();
    this.user = new User(username);
    this.players.push(this.user);
    for(let i = 1; i <= this.numBots; i++) {
      this.players.push(new Bot(`BOT ${i}`));
    }
    this.resultLog = ["Have fun!"];
  }

  public betPhase(userBetAmount: number): void {
    // this.players = [User, Bot, Bot]
    for(let player of this.players) {
      switch(player.playerType) {
        case "User": (player as User).bet(userBetAmount);break;
        case "Bot": (player as Bot).bet();
      }
    }
    this.distributePhase();
  }

  private distributePhase(): void {
    console.log("distributePhaseが呼ばれた")
    for(let player of this.players) {
      [...Array(this.numInitialHands)] // = [undifined, undifined]
      .forEach(() => player.getCard(this.deck.drawOne()));
    }
    this.dealer.getCard(this.deck.drawOne());
    this.players.forEach((player) => console.log(player.hand))

  }

  public actPhase(userAction: ActionType): void {
    for(let player of this.players) {
      if(player.isBlackjack) continue;

      let isTurnEnd: boolean = false;
      while(!isTurnEnd) {
        // BOT determines the action based on the rank of the dealer's open cards
        let action = player.playerType === "User"
        ? userAction
        : (player as Bot).makeAction(this.dealer.openCard);

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