import { Player } from "./Player";
import { Table } from "./Table";

export class User extends Player {
  public readonly playerType = "User";
  public constructor(arg: Pick<Player, "name" | "gameType">) {
    super({ name: arg.name, gameType: arg.gameType });
  }
  

  // これはModelにViewの状態が依存してる悪い例...?
  private getBetAmount(): number {
    let amount = 0;
    // Table.betDenominations = [5,20,50,100]
    for (let bd of Table.betDenominations) {
      let label = document.getElementById(`betLabel${bd}`)!.innerText;
      let value = document.getElementById(`betInput${bd}`)!.value;
      amount += parseInt(label) * parseInt(value);
    }
    return amount;
  }
  
  public makeAction(): Player["action"] {
    // idのvalueをもってきてaction
  }

  public bet(): void {
    this.betAmount = this.getBetAmount();
  }
  
}