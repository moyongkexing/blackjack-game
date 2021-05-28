import { Player } from "./Player";
import { Table } from "./Table";
import { BotStrategies, ActionType } from "./BotStrategies";
import { Card } from "./Card";

export class Bot extends Player {
  public readonly playerType = "Bot";
  public constructor(arg: Pick<Player, "name" | "gameType">) {
    super({ name: arg.name, gameType: arg.gameType });
  }
  
  public bet(): void {
    const random = this.money <= Table.betDenominations[3] * 3 // Table.betDenominations[3] * 3 = 300
    ? Math.floor(Math.random() * Table.betDenominations.length - 2) // 0 <= random <= 2
    : Math.floor(Math.random() * Table.betDenominations.length - 1); // 0 <= random <= 3
    this.betAmount = Table.betDenominations[random];
  }

  public makeAction(openCard: Card): ActionType
  {
    const strategy = BotStrategies[String(openCard.RankNum)];
    const actions = Object.keys(strategy) as ActionType[];
    for(let action of actions) {
      if(strategy[action].indexOf(this.handScore) !== -1) return action;
    }
    // handScoreが 18 以上の場合はstandを返す
    return "stand";
  }
}



