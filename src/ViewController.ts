import { Table } from "./Table";
import { ActionType } from "./types/ActionType";

export class ViewController {
  private table: Table;

  public constructor() {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    this.table = new Table(username);
    this.initializeEventListener();
    (document.getElementById("startPage") as HTMLElement).classList.add("hidden");
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
      (document.getElementById("betPage") as HTMLElement).classList.add("hidden");
      this.showDealPage();
      if(this.table.user.isTurnEnd) {
        (document.getElementById("action-buttons") as HTMLElement).style.display = "none";
        this.table.dealerAct();
        this.table.evaluation();
      }
      this.toString();
    });

    // button of ["surrender", "stand", "hit", "double"]
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for(let action of actions) {
      (document.getElementById(`${action}-btn`) as HTMLButtonElement).addEventListener
      ("click", () => {
          this.table.userAct(action);
          if(this.table.user.isTurnEnd) {
            (document.getElementById("action-buttons") as HTMLElement)
              .style.display = "none";
            this.table.dealerAct();
            this.table.evaluation();
            this.toString();
          }
        }
      )
    }
  }

  private renderHand(): void {
    
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
    (document.getElementById("betPage") as HTMLElement).classList.remove("hidden");
    (document.getElementById("moneyAmountInBetPage") as HTMLSpanElement)
      .innerText = String(this.table.user.money);
  }

  private showDealPage(): void {
    (document.getElementById("dealPage") as HTMLElement).classList.remove("hidden");
    (document.getElementById("betAmountInDealPage") as HTMLSpanElement)
      .innerText = String(this.table.user.betAmount);
  }
}
