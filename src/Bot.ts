import { Challenger } from "./Challenger";
import { Table } from "./Table";
import { BotStrategies } from "./BotStrategies";
import { Action } from "./types/ActionType";
import { Card } from "./Card";
import { Player } from "./types/PlayerInterface";

export class Bot extends Challenger implements Player {
  public readonly id: string;
  // K-O System - https://vegasdocs.com/blackjack/counting.html#anc6
  private knockOutNumber: number = 2;
  public constructor(username: string) {
    super(username);
    this.id = username.toUpperCase();
  }
  
  public makeBet(cardCountingTotal: number): void {
    const lastIndex = Table.betDenominations.length - 1;
    const randomIndex = Math.floor(Math.random() * lastIndex);
    this.betAmount = this.money >= lastIndex * 3
    ? Table.betDenominations[lastIndex]
    : Table.betDenominations[randomIndex];
    if(this.knockOutNumber <= cardCountingTotal) {
      this.betAmount = this.betAmount * (1 + randomIndex / 10);
    }
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


