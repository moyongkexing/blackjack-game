import { Card } from "./Card";
import { Table } from "./Table";

export class Deck {
  private static suits = ["H", "D", "C", "S"];
  private static ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  private cards: Card[] = [];

  public constructor(arg: Pick<Table, "gameType">) {
    this.resetDeck(arg.gameType);
  }
  private resetDeck(gameType: Table["gameType"]): void {
    this.cards = [];
    switch(gameType) {
      case "Blackjack": this.createDeckBJ();break;
      case "Poker": this.createDeckPoker();break;
    }
    this.shuffle();
  }
  private createDeckBJ(): void {
    for(let suit of Deck.suits) {
      for(let rank of Deck.ranks) {
        this.cards.push(new Card({suit: suit, rank: rank}));
      }
    }
  }
  private createDeckPoker(): void {
    // 今回実装しない
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
  public drawOne(): Card {
    return this.cards.pop() as Card;
  }
}