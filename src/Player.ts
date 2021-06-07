import { Card } from "./Card";
import { Table } from "./Table";

export class Player {
  public name: string;
  public hand: Card[] = [];
  public money: number = 400;
  public betAmount: number = Table.betDenominations[0];
  public status: "surrender" | "stand" | "bust" | "doubleBust" | "blackjack" | "initial" = "initial";
  public isTurnEnd: boolean = false;

  public constructor(username: string) {
    this.name = username;
  }

  public get handScore(): number {
    let score = 0;
    for (let card of this.hand) score += card.rankNum;
    // If the score is over 21, subtract 10 if there is an Ace in player's hand (switch rank of A from 11 to 1)
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

  private get isBlackjack(): boolean {
    return this.handScore === 21 && this.NumAce > 0;
  }

  public get isBroke(): boolean {
    return this.money < Table.betDenominations[0]; 
  }

  public getCard(card: Card): void {
    this.hand.push(card);
    if(this.hand.length === 2 && this.isBlackjack) {
      this.status = "blackjack";
      this.isTurnEnd = true;
    }
  }
  
  public surrender(): void {
    this.status = "surrender";
    this.isTurnEnd = true;
  }

  public stand(): void {
    this.status = "stand";
    this.isTurnEnd = true;
  }

  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) {
      this.status = "bust";
      this.isTurnEnd = true;
    } 
  }

  public double(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) {
      this.status = "doubleBust";
      this.isTurnEnd = true;
    } 
  }
  
  public loseMoney(amount: number): void {
    this.money = Math.floor(this.money - amount);
  }

  public earnMoney(amount: number): void {
    this.money = Math.floor(this.money + amount);
  }

  public resetState(): void {
    this.hand = [];
    this.betAmount = Table.betDenominations[0];
    this.status = "initial";
    this.isTurnEnd = false;
  }
}





















