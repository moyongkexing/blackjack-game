import { Table } from "./Table";
import { ActionType } from "./types/ActionType";
import { User } from "./User";
import { Bot } from "./Bot";
import { Dealer } from "./Dealer";

export class ViewController {
  private table: Table;

  public constructor() {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    this.table = new Table(username);
    this.hide("start-page");
    this.show("bet-page");
    this.initializeBetPage();
    this.initializeClickEvent();
  }

  private initializeClickEvent(): void {
    let betAmount = document.getElementById("bet-amount") as HTMLSpanElement;

    // button of [5,20,50,100]
    for (let d of Table.betDenominations) {
      (document.getElementById(`bet-${d}`) as HTMLElement).addEventListener
      ("click",
        () => {
          const total: number = parseInt(betAmount.innerText) + d;
          betAmount.innerText =
            total > this.table.user.money ? betAmount.innerText : String(total);
        }
      );
    }

    // "RESET" button
    (document.getElementById("reset-btn") as HTMLElement).addEventListener
    ("click",
      () => (betAmount.innerText = String(Table.betDenominations[0]))
    );

    // "DEAL" button
    (document.getElementById("deal-btn") as HTMLElement).addEventListener
    ("click",
      async () => {
        console.log(this.table.players.filter(player => player instanceof User))
        this.hide("bet-page");
        this.show("deal-page");

        this.table.bet(parseInt(betAmount.innerText));
        this.table.distribution();
        await this.renderDistribution();
        this.updateLog();

        this.show("action-ctrl");
        if (this.table.user.isTurnEnd) await this.afterUserTurn();
      }
    );

    // button of ["surrender", "stand", "hit", "double"]
    const actions: ActionType[] = ["surrender", "stand", "hit", "double"];
    for (let action of actions) {
      (document.getElementById(`${action}-btn`) as HTMLButtonElement
      ).addEventListener("click", async () => {
        this.table.userAct(action);
        this.updateHand(this.table.user);
        this.updateLog();
        if (this.table.user.isTurnEnd) await this.afterUserTurn();
      });
    }

    (document.getElementById("next-btn") as HTMLButtonElement).addEventListener
    ("click", () => {
      this.hide("deal-page");
      this.show("bet-page");

      this.initializeBetPage();
      this.resetDealPage();
      this.table.resetTable();
    })
  }

  public async afterUserTurn() {
    (document.getElementById("action-buttons") as HTMLElement).style.visibility = "hidden";
    
    this.updateStatus(this.table.user);

    this.table.botAct();
    for(let bot of this.table.bots) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.updateHand(bot);
      this.updateStatus(bot);
    }
    this.updateLog();

    this.table.dealerAct();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.updateHand(this.table.dealer);
    this.updateStatus(this.table.dealer);
    this.updateLog();

    this.table.evaluation();
    // log
  }

  private async renderDistribution() {
    for (let player of this.table.players) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.updateHand(player);
      if (player.status === "blackjack") this.updateStatus(player);
    }
  }

  private initializeBetPage(): void {
    (document.getElementById("money-amount") as HTMLSpanElement
    ).innerText = String(this.table.user.money);
  }

  private resetDealPage(): void {
    for(let player of this.table.players) {
      for (let i = 1; i <= player.hand.length; i++) {
        (document.getElementById(`${player.type}-card-${i}`) as HTMLElement
        ).innerHTML = "";
      }
      (document.getElementById(`${player.type}-status`) as HTMLElement
      ).innerHTML = "";
    }
    (document.getElementById("action-buttons") as HTMLElement).style.visibility = "visible";
  }

  private async updateHand(player: User | Bot | Dealer) {
    for (let i = 1; i <= player.hand.length; i++) {
      let card = player.hand[i - 1];
      (document.getElementById(`${player.type}-card-${i}`) as HTMLElement
      ).innerHTML = `<div class="card ${card.suit}"><span>${card.rank}</span></div>`;
    }
    
    (document.getElementById(`${player.type}-width`) as HTMLElement
    ).style.width = `${(player.hand.length + 3) * 28}px`;
  }

  private updateStatus(player: User | Bot | Dealer): void {
    (document.getElementById(`${player.type}-status`) as HTMLElement
    ).innerHTML = `${player.status}`;
  }

  private hide(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.add("hidden");
  }

  private show(id: string): void {
    (document.getElementById(id) as HTMLElement).classList.remove("hidden");
  }


  private updateLog(): void {
    const lastIndex = this.table.log.length - 1;
    const target = (document.getElementById("game-log") as HTMLElement);
    for(let sentence of this.table.log[lastIndex]) {
      target.innerHTML += `<p>${sentence}</p>`;
    }
    target.scrollTop = target.scrollHeight;
  }
  private toString(): void {
    console.log("");
    console.log("");
    for (let player of this.table.players) {
      console.log(player);
      console.log(player.hand);
      console.log("isTurnEnd");
      console.log(player.isTurnEnd);
      console.log("handScore");
      console.log(player.handScore);
    }
    console.log(this.table.dealer);
    console.log(this.table.dealer.hand);
    console.log("handScore");
    console.log(this.table.dealer.handScore);
  }
}
