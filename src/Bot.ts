import { Player } from "./Player";
import { Table } from "./Table";
import { BotStrategies } from "./BotStrategies";
import { ActionType } from "./types/ActionType";
import { Card } from "./Card";

export class Bot extends Player {
  public type: string;
  public constructor(username: string) {
    super(username);
    this.type = username.toUpperCase();
  }
  
  public makeBet(): void {
    const randomIndex = Math.floor(Math.random() * 3);
    this.betAmount = this.money >= Table.betDenominations[3] * 3 // betDenominations = [5,20,50,100];
    ? Table.betDenominations[Table.betDenominations.length - 1]
    : Table.betDenominations[randomIndex];
  }

  public makeAction(openCard: Card): ActionType {
    const strategy = BotStrategies[String(openCard.rankNum)]; // src/BotStrategies.ts
    const actions = Object.keys(strategy) as ActionType[];
    for(let action of actions) {
      if(strategy[action].indexOf(this.handScore) !== -1) {
        if(action === "double") return this.betAmount * 2 <= this.money ? "double" : "hit";
      }
    }
    return "stand";
  }
}


