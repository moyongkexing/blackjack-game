import { Player } from "./Player";
import { Table } from "./Table";
import { ActionType } from "./types/ActionType";

export class User extends Player {
  public constructor(username: string) {
    super(username);
  }
  
  public bet(userBetAmount: number): void {
    this.betAmount = userBetAmount;
  }
}