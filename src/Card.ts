export class Card {
  public readonly suit: string;
  public readonly rank: string;

  public constructor(arg: Omit<Card, 'rankNum'>) {
    this.suit = arg.suit;
    this.rank = arg.rank;
  }

  public get rankNum(): number {
    const hash: {[key: string]: number} = {
      A:11, J:10, Q:10, K:10,
    }
    if(hash[this.rank] !== undefined) return hash[this.rank];
    return Number(this.rank);
  }
}