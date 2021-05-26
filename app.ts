// class Player {
//   private card:
// }

class Card {
  private suit: string;
  private rank: string;

  public constructor(arg: Omit<Card, 'getRankNumber'>) {
    this.suit = arg.suit;
    this.rank = arg.rank;
  }

  // public getRankNumber(): number {
  //   const hashmap: {[key: string]: number} = {
  //     "A":11, "J":10, "Q":10, "K":10,
  //   }
  //   if(hashmap[this.rank] === undefined) return hashmap[this.rank];
  //   else return Number(this.rank);
  // }
}

class Deck {
  private static suits = ["H", "D", "C", "S"];
  private static ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  private cards: Card[] = [];

  public constructor(gameType: "BlackJack" | "Poker") {
    this.resetDeck(gameType);
  }

  private resetDeck(gameType: "BlackJack" | "Poker"): void {
    this.cards = [];
    for(let suit of Deck.suits) {
      for(let rank of Deck.ranks) {
        this.cards.push(new Card({suit: suit, rank: rank}));
      }
    }
  }
}
