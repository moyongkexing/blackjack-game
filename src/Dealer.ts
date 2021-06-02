import { Card } from "./Card";

export class Dealer {
  public name: string;
  public hand: Card[];
  public status: "bust" | "blackjack" | "stand";

  public constructor() {
    this.name = "Dealer";
    this.status = "stand";
    this.hand = [];
  }

  public get openCard(): Card {
    return this.hand[0];
  }

  public get handScore(): number {
    let score = 0;
    for (let card of this.hand) score += card.rankNum;
    // 21を超えている場合、エースがあれば10を引く(Rankを11から1に切り替える)
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
    if(this.hand.length === 2 && this.isBlackjack) this.status = "blackjack";
  }

  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) this.status = "bust";
  }
}
