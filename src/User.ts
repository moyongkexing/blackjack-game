import { Player } from "./Player";

export class User extends Player {
  public type: string = "USER";
  public constructor(username: string) {
    super(username);
  }
  
  public makeBet(userBetAmount: number): void {
    this.betAmount = userBetAmount;
  }
}