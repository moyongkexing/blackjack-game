import { Challenger } from "./Challenger";

export class User extends Challenger {
  public constructor(username: string) {
    super(username);
  }
  
  public makeBet(userBetAmount: Challenger["betAmount"]): void {
    this.betAmount = userBetAmount;
  }
}
