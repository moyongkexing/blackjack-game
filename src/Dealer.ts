import { Card } from "./Card";
import { DealerStatus } from "./types/StatusType";

export class Dealer {
  public name: string = "Dealer";
  public hand: Card[] = [];
  public status = DealerStatus.INITIAL;
  public isTurnEnd: boolean = false;

  public get openCard(): Card {
    return this.hand[0];
  }

  public get handScore(): number {
    let score = 0;
    for (let card of this.hand) score += card.rankNum;
    // If score is over 21, subtract 10 if there is an ace in one's hand(switch the rank from 11 to 1).
    let i = this.NumAce;
    while (score > 21 && i > 0) {
      score -= 10;
      i--;
    }
    return score;
  }
  
  private get NumAce(): number {
    return this.hand.filter((card) => card.rank === "A").length;
  }

  public get isBlackjack(): boolean {
    return this.handScore === 21 && this.NumAce > 0;
  }

  public getCard(card: Card): void {
    this.hand.push(card);
    if(this.hand.length === 2 && this.isBlackjack) {
      this.status = DealerStatus.BLACKJACK;
      this.isTurnEnd = true;
    } 
  }

  public stand(): void {
    this.status = DealerStatus.STAND;
    this.isTurnEnd = true;
  }

  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 16) this.stand();
    if(this.handScore > 21) this.status = DealerStatus.BUST;
  }
  
  public resetState(): void {
    this.hand = [];
    this.status = DealerStatus.INITIAL;
    this.isTurnEnd = false;
  }
}
