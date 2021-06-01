import { Table } from "./Table";
import { ActionType } from "./types/ActionType";

export class ViewController {
  private table: Table;

  public constructor() {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    this.table = new Table(username);
    this.initializeEventListener();
    this.hide("startPage");
    this.showBetPage();
    // 開発用↓
    // (document.getElementById("username") as HTMLInputElement).value = "test";
    // (document.getElementById("gametype") as HTMLInputElement).value = "Blackjack";
    // this.startGame();
  }
  
  private initializeEventListener(): void {
    let betAmount = (document.getElementById("betAmountInBetPage") as HTMLSpanElement);
    
    // button of [5,20,50,100]
    for(let d of Table.betDenominations) {
      (document.getElementById(`bet-${d}`) as HTMLElement).addEventListener(
        "click", () => {
          const total: number = parseInt(betAmount.innerText) + d;
          betAmount.innerText = total > this.table.user.money
          ? betAmount.innerText
          : String(total);
        }
      )
    }

    // "RESET" button
    (document.getElementById("resetBtn") as HTMLElement).addEventListener
    ("click", () => betAmount.innerText = String(Table.betDenominations[0]));

    // "DEAL" button
    (document.getElementById("dealBtn") as HTMLElement).addEventListener
    ("click", () => {
      this.table.betPhase(parseInt(betAmount.innerText));
      this.hide("betPage");
      this.showDealPage();
    });

    // button of ["stand", "hit", "double", "surrender"]
    // const actions: ActionType[] = ["stand", "hit", "double", "surrender"];
    // for(let action of actions) {
    //   (document.getElementById(`${action}-btn`) as HTMLButtonElement).addEventListener
    //   ("click", () => {
    //       this.table.actPhase(action);

    //     }
    //   )
    // }
  }

  private showBetPage(): void {
    this.show("betPage");
    (document.getElementById("moneyAmountInBetPage") as HTMLSpanElement)
      .innerText = String(this.table.user.money);
  }

  private showDealPage(): void {
    this.show("dealPage");
    (document.getElementById("betAmountInDealPage") as HTMLSpanElement)
      .innerText = String(this.table.user.betAmount);
  }

  private hide(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.add("hidden");
  }
  private show(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.remove("hidden");
  }
}