import { Challenger } from "./Challenger";
import { Table } from "./Table";
import { BotStrategies } from "./BotStrategies";
import { Action } from "./types/ActionType";
import { Card } from "./Card";

export class Bot extends Challenger {
  public readonly id: string;
  public constructor(username: string) {
    super(username);
    this.id = username.toUpperCase();
  }
  
  public makeBet(): void {
    const lastIndex = Table.betDenominations.length - 1;
    const randomIndex = Math.floor(Math.random() * lastIndex);
    this.betAmount = this.money >= lastIndex * 3
    ? Table.betDenominations[lastIndex]
    : Table.betDenominations[randomIndex];
  }

  public makeAction(openCard: Card): Action {
    const strategy = BotStrategies[String(openCard.rankNum)];
    const actions = Object.keys(strategy) as Action[];
    for(let action of actions) {
      if(strategy[action].indexOf(this.handScore) !== -1) {
        // If bot doesn't have enough money, choose to hit instead of double
        if(action === "Double") return this.canDouble ? Action.DOUBLE : Action.HIT;
        else return action;
      }
    }
    return Action.STAND;
  }
}


