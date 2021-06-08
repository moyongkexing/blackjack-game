import { Card } from "./Card";

export class Deck {
  private static suits = ["heart", "diamond", "club", "spade"];
  private static ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  private cards: Card[] = [];

  public constructor() {
    this.resetDeck();
  }

  public resetDeck(): void {
    this.cards = [];
    for(let suit of Deck.suits) {
      for(let rank of Deck.ranks) {
        this.cards.push(new Card({suit: suit, rank: rank}));
      }
    }
    this.shuffle();
  }

  public drawOne(): Card {
    return this.cards.pop() as Card;
  }

  private shuffle(): void {
    const len = this.cards.length;
    for(let i = 0; i < len; i++) {
      let random = Math.floor(Math.random() * (len - i));
      let temp = this.cards[i];
      this.cards[i] = this.cards[random];
      this.cards[random] = temp;
    }
  }
}