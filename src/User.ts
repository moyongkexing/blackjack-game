import { Challenger } from "./Challenger";
import { Player } from "./types/PlayerInterface";

export class User extends Challenger implements Player {
  public constructor(username: string) {
    super(username);
  }
  
  public makeBet(userBetAmount: Challenger["betAmount"]): void {
    this.betAmount = userBetAmount;
  }
}
