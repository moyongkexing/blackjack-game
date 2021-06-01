import { Player } from "./Player";
import { Table } from "./Table";
import { BotStrategies } from "./BotStrategies";
import { ActionType } from "./types/ActionType";
import { Card } from "./Card";

export class Bot extends Player {
  public readonly playerType = "Bot";
  public constructor(username: string) {
    super(username);
  }
  
  public bet(): void {
    // betDenominations = [5,20,50,100];
    const randomIndex = Math.floor(Math.random() * 3);
    this.betAmount = this.money >= Table.betDenominations[3] * 3
    ? Table.betDenominations[Table.betDenominations.length - 1]
    : Table.betDenominations[randomIndex];
  }

  public makeAction(openCard: Card): ActionType {
    const strategy = BotStrategies[String(openCard.RankNum)];// src/BotStrategies.ts
    const actions = Object.keys(strategy) as ActionType[];
    for(let action of actions) {
      if(strategy[action].indexOf(this.handScore) !== -1) return action;
    }
    // handScoreが 18 以上の場合はstandを返す
    return "stand";
  }
}



