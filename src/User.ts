import { Player } from "./Player";
import { Table } from "./Table";

export class User extends Player {
  public readonly playerType = "User";
  public constructor(arg: Pick<Player, "name" | "gameType">) {
    super({ name: arg.name, gameType: arg.gameType });
  }
  
  // これはModelにViewの状態が依存してる悪い例かも
  public bet(): void {
    let amount = 0;
    // Table.betDenominations = [5,20,50,100]
    for (let bd of Table.betDenominations) {
      let label = (<HTMLInputElement>document.getElementById(`betLabel${bd}`)).innerText;
      let value = (<HTMLInputElement>document.getElementById(`betInput${bd}`)).value;
      amount += parseInt(label) * parseInt(value);
    }
    this.betAmount = amount;
  }

  public makeAction(): any {
    return "test";
    // idのvalueをもってきてaction
  }
  // public makeAction(): Player["action"] {
  //   // idのvalueをもってきてaction
  // }
}