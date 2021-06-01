import { Player } from "./Player";
import { Table } from "./Table";
import { ActionType } from "./types/ActionType";

export class User extends Player {
  public readonly playerType = "User";
  public constructor(username: string) {
    super(username);
  }
  
  public bet(userBetAmount: number): void {
    this.betAmount = userBetAmount;
  }

  // public makeAction(action): ActionType {
  //   return this.nextAction;
  // }
  // public makeAction(): Player["action"] {
  //   // idのvalueをもってきてaction
  // }
}