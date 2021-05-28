import { Card } from "./Card";

export class Player {
  public name: string;
  public gameType: "Blackjack" | "Poker";
  // stateの説明
  //  waiting: 他プレイヤーがbettingまたはplayingのときの状態
  //  betting: 掛け金を選択しているときの状態
  //  playing: アクション（hitやstandなど）の選択および終了までの間の状態
  protected hand: Card[];
  protected money: number;
  protected betAmount: number;
  protected winAmount: number;
  protected status: "surrender" | "stand" | "bust" | "doublebust" | "blackjack" | "initial";

  public constructor(arg: Pick<Player, "name" | "gameType">) {
    this.name = arg.name;
    this.gameType = arg.gameType;
    this.status = "initial";
    this.hand = [];
    this.money = 400;
    this.betAmount = 0;
    this.winAmount = 0;
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
  public isBroke(): boolean {
    return this.money === 0;
  }

  private loseMoney(amount: number): void {
    this.money -= amount;
  }
  private earnMoney(amount: number): void {
    this.money += amount;
  }
  public getCard(card: Card): void {
    this.hand.push(card);
    if(this.isBlackjack()) this.status = "blackjack";
  }
  public surrender(): void {
    this.status = "surrender";
  }
  public stand(): void {
    this.status = "stand";
  }
  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) this.status = "bust";
  }
  public double(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) this.status = "doublebust";
  }
}





















