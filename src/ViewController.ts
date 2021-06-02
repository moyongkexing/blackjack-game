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
      this.table.bet(parseInt(betAmount.innerText));
      this.table.distribution();
      this.table.botAct();
      this.toString();
      this.hide("betPage");
      this.showDealPage();
    });

    // button of ["surrender", "stand", "hit", "double"]
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for(let action of actions) {
      (document.getElementById(`${action}-btn`) as HTMLButtonElement).addEventListener
      ("click", () => {
          this.table.userAct(action);
          if(this.table.user.isTurnEnd) {
            this.hide("actionBtns");
            this.table.dealerAct();
            this.table.evaluation();
          } 
          this.toString();
        }
      )
    }
  }

  private toString(): void {
    console.log("")
    console.log("")
    for(let player of this.table.players) {
      console.log(player);
      console.log(player.hand);
      console.log("isTurnEnd");
      console.log(player.isTurnEnd);
      console.log("handScore");
      console.log(player.handScore);
    }
    console.log(this.table.dealer)
    console.log(this.table.dealer.hand)
    console.log("handScore");
    console.log(this.table.dealer.handScore);
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