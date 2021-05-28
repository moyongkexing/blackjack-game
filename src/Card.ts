export class Card {
  public suit: string;
  public rank: string;

  public constructor(arg: Omit<Card, 'RankNum'>) {
    this.suit = arg.suit;
    this.rank = arg.rank;
  }

  public get RankNum(): number {
    const hash: {[key: string]: number} = {
      A:11, J:10, Q:10, K:10,
    }
    if(hash[this.rank] !== undefined) return hash[this.rank];
    return Number(this.rank);
  }
}