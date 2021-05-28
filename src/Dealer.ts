import { Card } from "./Card";
import { Table } from "./Table";

export class Dealer {
  public name: string;
  public gameType: "Blackjack" | "Poker";
  // stateの説明
  //  waiting: 他プレイヤーがbettingまたはplayingのときの状態
  //  betting: 掛け金を選択しているときの状態
  //  playing: アクション（hitやstandなど）の選択および終了までの間の状態
  protected hand: Card[];
  protected status: | "stand" | "bust" | "blackjack" | "initial";

  public constructor(arg: Pick<Dealer, "name" | "gameType">) {
    this.name = arg.name;
    this.gameType = arg.gameType;
    this.status = "initial";
    this.hand = [];
  }
  public get openCard(): Card {
    return this.hand[0];
  }
  protected get handScore(): number {
    let score = 0;
    for (let card of this.hand) score += card.RankNum;
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
  public isBlackjack(): boolean {
    return this.handScore === 21 && this.NumAce > 0;
  }

  public getCard(card: Card): void {
    this.hand.push(card);
  }
  public stand(): void {
    this.status = "stand";
  }
  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) this.status = "bust";
  }
}
