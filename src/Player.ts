import { Card } from "./Card";
import { Table } from "./Table";
import { PlayerStatus } from "./types/StatusType";

export abstract class Player {
  public name: string;
  public hand: Card[] = [];
  public money: number = 400;
  public betAmount: number = Table.betDenominations[0];
  public status = PlayerStatus.INITIAL;
  public isTurnEnd: boolean = false;

  public constructor(username: string) {
    this.name = username;
  }

  abstract makeBet(arg: Player["betAmount"] | null): void;

  public get handScore(): number {
    let score = 0;
    for (let card of this.hand) score += card.rankNum;
    // If the score is over 21, subtract 10 if there is an Ace in player's hand (switch rank of Ace from 11 to 1)
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

  public get canDouble(): boolean {
    return this.money >= this.betAmount * 2;
  }

  public getCard(card: Card): void {
    this.hand.push(card);
    if(this.hand.length === 2 && this.isBlackjack) {
      this.status = PlayerStatus.BLACKJACK;
      this.isTurnEnd = true;
    }
  }
  
  public surrender(): void {
    this.status = PlayerStatus.SURRENDER;
    this.isTurnEnd = true;
  }

  public stand(): void {
    this.status = PlayerStatus.STAND;
    this.isTurnEnd = true;
  }

  public hit(card: Card): void {
    this.getCard(card);
    if(this.handScore > 21) {
      this.status = PlayerStatus.BUST;
      this.isTurnEnd = true;
    } 
  }

  public double(card: Card): void {
    this.getCard(card);
    this.status = PlayerStatus.DOUBLE;
    if(this.handScore > 21) this.status = PlayerStatus.DOUBLEBUST;
    this.isTurnEnd = true;
  }

  public resetState(): void {
    this.hand = [];
    this.betAmount = Table.betDenominations[0];
    this.status = PlayerStatus.INITIAL;
    this.isTurnEnd = false;
  }

  public calculation(result: "win" | "lose"): void {
    const map: { [key in Exclude<PlayerStatus, PlayerStatus.INITIAL>]: number } = {
      Surrender: -0.5,
      Bust: -1,
      DoubleBust: -2,
      Stand: result === "win" ? 1 : -1,
      Double: result === "win" ? 2 : -2,
      Blackjack: 1.5,
    };
    this.money += Math.floor(this.betAmount * map[status as Exclude<PlayerStatus, PlayerStatus.INITIAL>]);
  }
}
