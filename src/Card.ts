export class Card {
  public readonly suit: string;
  public readonly rank: string;

  public constructor(arg: Pick<Card, 'suit' | 'rank'>) {
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

  public get cardCountingValue(): number {
    if(2 <= this.rankNum && this.rankNum <= 7) return 1;
    else if(8 <= this.rankNum && this.rankNum <= 9) return 0;
    else return -1;
  }
}
